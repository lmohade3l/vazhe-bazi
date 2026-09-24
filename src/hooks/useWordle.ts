import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDailyPuzzle, isValidWord } from '../data/words';
import { ENTER, BACKSPACE } from '../data/keyboard';
import {
  buildLetterStates,
  checkHardMode,
  evaluateGuess,
  type LetterStates,
} from '../lib/evaluate';
import { normalize, toFa, toLetters } from '../lib/persian';
import { KEYS, applyResult, defaultStats, readStore, writeStore } from '../lib/storage';
import { useLocalStorage } from './useLocalStorage';
import type {
  GameRecord,
  GameStatus,
  LetterState,
  Puzzle,
  Stats,
  ToastMessage,
} from '../types';

export const PLAYING = 'playing';
export const WON = 'won';
export const LOST = 'lost';

const REVEAL_STEP = 250;
const REVEAL_TAIL = 450;
const WIN_MODAL_DELAY = 950;
const LOSS_MODAL_DELAY = 400;
const TOAST_DURATION = 1600;
const SHAKE_DURATION = 550;

/** بخشی از `GameRecord` که برای شروعِ state لازم است. */
type RestoredGame = Pick<GameRecord, 'guesses' | 'status' | 'scored'>;

/** بازیِ ذخیره‌شده را می‌خواند؛ اگر مربوط به پازل دیگری باشد نادیده می‌گیرد. */
function loadGame(puzzleNumber: number): RestoredGame {
  const saved = readStore<Partial<GameRecord> | null>(KEYS.game, null);
  if (!saved || saved.puzzle !== puzzleNumber || !Array.isArray(saved.guesses)) {
    return { guesses: [], status: PLAYING, scored: false };
  }
  const status: GameStatus =
    saved.status === WON || saved.status === LOST ? saved.status : PLAYING;
  return {
    guesses: saved.guesses,
    status,
    scored: saved.scored ?? status !== PLAYING,
  };
}

interface UseWordleOptions {
  hardMode: boolean;
}

export interface WordleGame {
  puzzle: Puzzle;
  solution: string;
  wordLength: number;
  rows: number;
  guesses: string[];
  evaluations: LetterState[][];
  current: string;
  status: GameStatus;
  letterStates: LetterStates;
  /** اندیس ردیفی که در حال چرخیدن است؛ ‎-1 یعنی هیچ ردیفی. */
  animatingRow: number;
  shaking: boolean;
  bouncing: boolean;
  toast: ToastMessage | null;
  stats: Stats;
  /** شماره‌ی تلاشی که بازی با آن برده شد — برای پررنگ‌کردن میله‌ی توزیع. */
  lastWinRow: number | null;
  gameOverOpen: boolean;
  /** ورودی گرفته نمی‌شود: یا بازی تمام شده یا در حال نمایش نتیجه‌ی حدس است. */
  locked: boolean;
  canChangeHardMode: boolean;
  handleKey: (key: string) => void;
  showToast: (message: string) => void;
  closeGameOver: () => void;
  openGameOver: () => void;
  playAgain: () => void;
}

/** تمام state بازی حدس‌واژه. */
export function useWordle({ hardMode }: UseWordleOptions): WordleGame {
  const puzzle = useMemo(() => getDailyPuzzle(), []);
  const solution = puzzle.solution;
  const wordLength = toLetters(solution).length;
  const rows = wordLength + 1;

  // فقط یک‌بار در عمر کامپوننت خوانده می‌شود.
  const [restored] = useState<RestoredGame>(() => loadGame(puzzle.number));

  const [guesses, setGuesses] = useState<string[]>(restored.guesses);
  const [status, setStatus] = useState<GameStatus>(restored.status);
  const [current, setCurrent] = useState('');
  const [revealedCount, setRevealedCount] = useState(restored.guesses.length);
  const [shaking, setShaking] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [gameOverOpen, setGameOverOpen] = useState(false);

  const [stats, setStats] = useLocalStorage<Stats>(KEYS.stats, defaultStats);
  const [lastWinRow, setLastWinRow] = useState<number | null>(
    restored.status === WON ? restored.guesses.length : null,
  );

  /** آمار هر پازل فقط یک‌بار ثبت می‌شود، حتی اگر دوباره بازی شود. */
  const scored = useRef(restored.scored);

  const timers = useRef<number[]>([]);
  const later = useCallback((fn: () => void, delay: number): number => {
    const id = window.setTimeout(fn, delay);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    },
    [],
  );

  const showToast = useCallback(
    (message: string) => {
      setToast({ message, id: Date.now() });
      later(() => setToast(null), TOAST_DURATION);
    },
    [later],
  );

  const rejectGuess = useCallback(
    (message: string) => {
      showToast(message);
      setShaking(true);
      later(() => setShaking(false), SHAKE_DURATION);
    },
    [later, showToast],
  );

  const revealing = revealedCount < guesses.length;
  const locked = status !== PLAYING || revealing;

  const addLetter = useCallback(
    (letter: string) => {
      setCurrent((value) =>
        toLetters(value).length >= wordLength ? value : value + letter,
      );
    },
    [wordLength],
  );

  const removeLetter = useCallback(() => {
    setCurrent((value) => toLetters(value).slice(0, -1).join(''));
  }, []);

  const finishGame = useCallback(
    (nextGuesses: string[], won: boolean) => {
      setStatus(won ? WON : LOST);
      writeStore(KEYS.game, {
        puzzle: puzzle.number,
        guesses: nextGuesses,
        status: won ? WON : LOST,
        scored: true,
      } satisfies GameRecord);

      if (!scored.current) {
        scored.current = true;
        setStats((currentStats) =>
          applyResult(
            { ...defaultStats, ...currentStats },
            { won, attempts: nextGuesses.length, rows },
          ),
        );
      }

      if (won) {
        setLastWinRow(nextGuesses.length);
        setBouncing(true);
        later(() => setGameOverOpen(true), WIN_MODAL_DELAY);
      } else {
        later(() => setGameOverOpen(true), LOSS_MODAL_DELAY);
      }
    },
    [later, puzzle.number, rows, setStats],
  );

  const submitGuess = useCallback(() => {
    if (locked) return;

    const guess = current;
    if (toLetters(guess).length < wordLength) {
      rejectGuess('حرف کافی نیست');
      return;
    }
    if (!isValidWord(guess, normalize)) {
      rejectGuess('این کلمه در فهرست نیست');
      return;
    }
    if (hardMode) {
      const violation = checkHardMode(guess, guesses, solution, toFa);
      if (violation) {
        rejectGuess(violation);
        return;
      }
    }

    const nextGuesses = [...guesses, guess];
    setGuesses(nextGuesses);
    setCurrent('');
    writeStore(KEYS.game, {
      puzzle: puzzle.number,
      guesses: nextGuesses,
      status: PLAYING,
      scored: scored.current,
    } satisfies GameRecord);

    later(() => {
      setRevealedCount(nextGuesses.length);
      const won = normalize(guess) === normalize(solution);
      if (won || nextGuesses.length === rows) finishGame(nextGuesses, won);
    }, wordLength * REVEAL_STEP + REVEAL_TAIL);
  }, [
    current,
    finishGame,
    guesses,
    hardMode,
    later,
    locked,
    puzzle.number,
    rejectGuess,
    rows,
    solution,
    wordLength,
  ]);

  const handleKey = useCallback(
    (key: string) => {
      if (locked) return;
      if (key === ENTER) submitGuess();
      else if (key === BACKSPACE) removeLetter();
      else addLetter(key);
    },
    [addLetter, locked, removeLetter, submitGuess],
  );

  const evaluations = useMemo(
    () => guesses.map((guess) => evaluateGuess(guess, solution)),
    [guesses, solution],
  );

  const letterStates = useMemo(
    () => buildLetterStates(guesses.slice(0, revealedCount), solution),
    [guesses, revealedCount, solution],
  );

  const playAgain = useCallback(() => {
    setGameOverOpen(false);
    setGuesses([]);
    setRevealedCount(0);
    setCurrent('');
    setStatus(PLAYING);
    setBouncing(false);
    writeStore(KEYS.game, {
      puzzle: puzzle.number,
      guesses: [],
      status: PLAYING,
      scored: scored.current,
    } satisfies GameRecord);
  }, [puzzle.number]);

  const closeGameOver = useCallback(() => setGameOverOpen(false), []);
  const openGameOver = useCallback(() => setGameOverOpen(true), []);

  const animatingRow = revealing ? guesses.length - 1 : -1;

  return {
    puzzle,
    solution,
    wordLength,
    rows,
    guesses,
    evaluations,
    current,
    status,
    letterStates,
    animatingRow,
    shaking,
    bouncing,
    toast,
    stats: { ...defaultStats, ...stats },
    lastWinRow,
    gameOverOpen,
    locked,
    canChangeHardMode: guesses.length === 0 || status !== PLAYING,
    handleKey,
    showToast,
    closeGameOver,
    openGameOver,
    playAgain,
  };
}
