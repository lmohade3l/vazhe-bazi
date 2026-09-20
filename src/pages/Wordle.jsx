import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Board from '../components/Board';
import Keyboard from '../components/Keyboard';
import Toast from '../components/Toast';
import Help from '../components/modals/Help';
import Stats from '../components/modals/Stats';
import Settings from '../components/modals/Settings';
import GameOver from '../components/modals/GameOver';
import { BACKSPACE, ENTER, keyboardRows } from '../data/keyboard';
import { normalize } from '../lib/persian';
import { WON } from '../hooks/useWordle';
import { useWordle } from '../hooks/useWordle';
import styles from './Wordle.module.css';

/** حروفی که کیبورد فیزیکی مجاز است وارد کند. */
const LETTERS = new Set(
  keyboardRows.flat().filter((key) => key !== ENTER && key !== BACKSPACE),
);

/** صفحه‌ی بازی حدس‌واژه. */
export default function Wordle({ settings, setSetting }) {
  const game = useWordle({ hardMode: settings.hardMode });
  const [openModal, setOpenModal] = useState(null);

  const closeModal = useCallback(() => setOpenModal(null), []);
  const anyModalOpen = openModal !== null || game.gameOverOpen;

  const physicalInputBlocked = anyModalOpen || game.status !== 'playing';

  useEffect(() => {
    if (physicalInputBlocked) return undefined;

    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key === 'Enter') {
        event.preventDefault();
        game.handleKey(ENTER);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        game.handleKey(BACKSPACE);
      } else if (LETTERS.has(normalize(event.key))) {
        event.preventDefault();
        game.handleKey(event.key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [game, physicalInputBlocked]);

  const highlight = useMemo(
    () => (game.status === WON ? game.lastWinRow : null),
    [game.status, game.lastWinRow],
  );

  return (
    <div className={styles.page}>
      <Header
        onHelp={() => setOpenModal('help')}
        onStats={() => setOpenModal('stats')}
        onSettings={() => setOpenModal('settings')}
      />

      <Toast toast={game.toast} />

      <main className={styles.main}>
        <Board
          rows={game.rows}
          wordLength={game.wordLength}
          guesses={game.guesses}
          evaluations={game.evaluations}
          current={game.current}
          animatingRow={game.animatingRow}
          shaking={game.shaking}
          bouncing={game.bouncing}
        />
      </main>

      <Keyboard
        letterStates={game.letterStates}
        onKey={game.handleKey}
        disabled={game.locked}
      />

      <Help open={openModal === 'help'} onClose={closeModal} />

      <Stats
        open={openModal === 'stats'}
        onClose={closeModal}
        stats={game.stats}
        rows={game.rows}
        highlight={highlight}
      />

      <Settings
        open={openModal === 'settings'}
        onClose={closeModal}
        settings={settings}
        setSetting={setSetting}
        canChangeHardMode={game.canChangeHardMode}
        onHardModeBlocked={() => game.showToast('حالت سخت فقط در شروع بازی')}
      />

      <GameOver
        open={game.gameOverOpen}
        onClose={game.closeGameOver}
        won={game.status === WON}
        stats={game.stats}
        rows={game.rows}
        guesses={game.guesses}
        solution={game.solution}
        puzzleNumber={game.puzzle.number}
        settings={settings}
        onPlayAgain={game.playAgain}
        onShareFailed={() => game.showToast('اشتراک‌گذاری ممکن نشد')}
      />
    </div>
  );
}
