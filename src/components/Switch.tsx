import styles from './Switch.module.css';

export default function Switch(
  {
    checked,
    onChange,
    label,
    description,
    onBlocked
  }:
    {
      checked: boolean,
      onChange: (value: boolean) => void,
      label: string,
      description: string,
      onBlocked?: () => boolean
    }
) {
  const handleClick = () => {
    if (onBlocked && onBlocked()) return;
    onChange(!checked);
  };

  return (
    <div className={styles.row}>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`${styles.track} ${checked ? styles.on : ''}`}
        onClick={handleClick}
      >
        <span className={styles.knob} />
      </button>
    </div>
  );
}
