import Modal from '../Modal';
import Switch from '../Switch';
import styles from './Settings.module.css';

export default function Settings({
  open,
  onClose,
  settings,
  setSetting,
  canChangeHardMode,
  onHardModeBlocked,
}) {
  return (
    <Modal open={open} onClose={onClose} title="تنظیمات" labelledBy="settings-title">
      <div className={styles.list}>
        <Switch
          label="حالت تاریک"
          description="پس‌زمینه‌ی تیره"
          checked={settings.theme === 'dark'}
          onChange={(value) => setSetting('theme', value ? 'dark' : 'light')}
        />
        <Switch
          label="حالت سخت"
          description="باید از همه‌ی سرنخ‌های پیداشده استفاده کنی"
          checked={settings.hardMode}
          onBlocked={() => {
            if (canChangeHardMode) return false;
            onHardModeBlocked();
            return true;
          }}
          onChange={(value) => setSetting('hardMode', value)}
        />
        <Switch
          label="حالت رنگ‌کوری"
          description="رنگ‌های نارنجی و آبیِ پرکنتراست"
          checked={settings.colorBlind}
          onChange={(value) => setSetting('colorBlind', value)}
        />
      </div>
    </Modal>
  );
}
