import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Wordle from './pages/Wordle';
import { useSettings } from './hooks/useSettings';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { settings, setSetting } = useSettings();
  useTheme(settings.theme, settings.colorBlind);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/wordle" element={<Wordle settings={settings} setSetting={setSetting} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
