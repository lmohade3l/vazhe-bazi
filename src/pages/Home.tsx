import { Link } from 'react-router-dom';
import { formatPersianDate } from '../lib/persian';
import styles from './Home.module.css';
import { GAME, GAME_COLORS } from '../data/types';

const GAMES = [
  {
    title: 'حدس‌واژه',
    description: 'کلمه‌ی پنج‌حرفیِ امروز را در ۶ تلاش پیدا کن',
    to: '/wordle',
    colors: ['var(--correct)', 'var(--present)', 'var(--absent)', 'var(--correct)'],
  },
  {
    title: 'واژه‌یاب',
    description: 'از حروف داده‌شده بیشترین کلمه را بساز',
  },
  {
    title: 'پیوند',
    description: 'کلمه‌ها را در گروه‌های پنهان دسته‌بندی کن',
  },
  {
    title: 'نردبان واژه',
    description: 'با تغییر یک حرف از کلمه‌ای به کلمه‌ی دیگر برس',
  },
];

function CardIcon({ colors } : {colors: GAME_COLORS}) {
  const palette = colors ?? Array(4).fill('var(--tile-empty)');
  return (
    <div className={styles.icon} aria-hidden="true">
      {palette.map((color, index) => (
        <span key={index} style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

function CardBody({ game }: {game: GAME}) {
  if(!game.colors) return <></>
  return (
    <>
      <CardIcon colors={game.colors} />
      <div className={styles.text}>
        <h2 className={styles.cardTitle}>
          {game.title}
          {game.to ? null : <span className={styles.badge}>به‌زودی</span>}
        </h2>
        <p className={styles.cardDescription}>{game.description}</p>
      </div>
      {game.to ? (
        <span className={styles.arrow} aria-hidden="true">
          ←
        </span>
      ) : null}
    </>
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>واژه‌بازی</h1>
      <p className={styles.subtitle}>مجموعه بازی‌های کلمه‌ای فارسی</p>
      <p className={styles.date}>{formatPersianDate()}</p>

      <div className={styles.cards}>
        {GAMES.map((game) =>
          game.to ? (
            <Link key={game.title} to={game.to} className={`${styles.card} ${styles.active}`}>
              <CardBody game={game} />
            </Link>
          ) : (
            <div key={game.title} className={`${styles.card} ${styles.disabled}`} aria-disabled="true">
              <CardBody game={game} />
            </div>
          ),
        )}
      </div>
    </main>
  );
}
