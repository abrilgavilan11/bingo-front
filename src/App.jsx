import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HostApp from './pages/HostApp';
import MobilePlayer from './pages/MobilePlayer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HostApp />} />
        <Route path="/play/:gameId/:cardId" element={<MobilePlayer />} />
      </Routes>
    </BrowserRouter>
  );
}
