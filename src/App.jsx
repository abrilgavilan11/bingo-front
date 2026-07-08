import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HostApp from './pages/HostApp';
import MobilePlayer from './pages/MobilePlayer';
import HowToPlay from './pages/HowToPlay';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HostApp />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/play/:gameId/:cardId" element={<MobilePlayer />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
