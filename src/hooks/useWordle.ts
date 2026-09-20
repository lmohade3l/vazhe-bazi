import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDailyPuzzle, isValidWord } from '../data/words';
import { ENTER, BACKSPACE } from '../data/keyboard';
import { buildLetterStates, checkHardMode, evaluateGuess } from '../lib/evaluate';
import { normalize, toFa, toLetters } from '../lib/persian';
import {
  KEYS,
  applyResult,
  defaultStats,
  readStore,
  writeStore,
} from '../lib/storage';
import { useLocalStorage } from './useLocalStorage';

export const PLAYING = 'playing';
export const WON = 'won';
export const LOST = 'lost';

const REVEAL_STEP = 250;
const REVEAL_TAIL = 450;
const WIN_MODAL_DELAY = 950;
const LOSS_MODAL_DELAY = 400;
const TOAST_DURATION = 1600;
const SHAKE_DURATION = 550;

/** بازیِ ذخیره‌شده را می‌خواند؛ اگر مربوط به پازل دیگری باشد نادیده می‌گیرد. */
function loadGame(puzzleNumber) {
  const saved = readStore(KEYS.game, null);
  if (!saved || saved.puzzle !== puzzleNumber || !Array.isArray(saved.guesses)) {
    return { guesses: [], status: PLAYING, scored: false };
  }
  const status = saved.status === WON || saved.status === LOST ? saved.status : PLAYING;
  return {
    guesses: saved.guesses,
    status,
    scored: saved.scored ?? status !== PLAYING,
  };
}

/** تمام state بازی حدس‌واژه. */
export function useWordle({ hardMode }) {
  const puzzle = useMemo(() => getDailyPuzzle(), []);
  const solution = puzzle.solution;
  const wordLength = toLetters(solution).length;
  const rows = wordLength + 1;

  const restored = useRef(null);
  if (restored.current === null) restored.current = loadGame(puzzle.number);

  const [guesses, setGuesses] = useState(restored.current.guesses);
  const [status, setStatus] = useState(restored.current.status);
  const [current, setCurrent] = useState('');
  const [revealedCount, setRevealedCount] = useState(restored.current.guesses.length);
  const [shaking, setShaking] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [toast, setToast] = useState(null);
  const [gameOverOpen, setGameOverOpen] = useState(false);

  const [stats, setStats] = useLocalStorage(KEYS.stats, defaultStats);
  const [lastWinRow, setLastWinRow] = useState(
    restored.current.status === WON ? restored.current.guesses.length : null,
  );

  /** آمار هر پازل فقط یک‌بار ثبت می‌شود، حتی اگر دوباره بازی شود. */
  const scored = useRef(restored.current.scored);

  const timers = useRef([]);
  const later = useCallback((fn, delay) => {
    const id = window.setTimeout(fn, delay);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    },
    [],
  );

  const showToast = useCallback(
    (message) => {
      setToast({ message, id: Date.now() });
      later(() => setToast(null), TOAST_DURATION);
    },
    [later],
  );

  const rejectGuess = useCallback(
    (message) => {
      showToast(message);
      setShaking(true);
      later(() => setShaking(false), SHAKE_DURATION);
    },
    [later, showToast],
  );

  const revealing = revealedCount < guesses.length;
  const locked = status !== PLAYING || revealing;

  const addLetter = useCallback(
    (letter) => {
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
    (nextGuesses, won) => {
      setStatus(won ? WON : LOST);
      writeStore(KEYS.game, {
        puzzle: puzzle.number,
        guesses: nextGuesses,
        status: won ? WON : LOST,
        scored: true,
      });
      if (!scored.current) {
        scored.current = true;
        setStats((current) =>
          applyResult({ ...defaultStats, ...current }, {
            won,
            attempts: nextGuesses.length,
            rows,
          }),
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
    });

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
    (key) => {
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
    closeGameOver: () => setGameOverOpen(false),
    openGameOver: () => setGameOverOpen(true),
    playAgain: () => {
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
      });
    },
  };
}
