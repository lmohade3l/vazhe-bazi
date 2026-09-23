import { SETTINGS } from '../../lib/storage';
import Modal from '../Modal';
import Switch from '../Switch';
import styles from './Settings.module.css';

interface SettingsProps { 
  open: boolean,
  onClose: () => void,
  settings: SETTINGS,
  setSetting: (label: string, value: SETTINGS) => void,
  canChangeHardMode: boolean,
  onHardModeBlocked: () => void
}

export default function Settings({
  open,
  onClose,
  settings,
  setSetting,
  canChangeHardMode,
  onHardModeBlocked,
}:SettingsProps) {
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
