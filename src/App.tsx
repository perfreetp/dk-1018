import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import MainMenu from '@/components/MainMenu';
import Navigation from '@/components/Navigation';
import Shop from '@/components/Shop';
import Kitchen from '@/components/Kitchen';
import Orders from '@/components/Orders';
import Dormitory from '@/components/Dormitory';
import Decoration from '@/components/Decoration';
import Collection from '@/components/Collection';
import SettingsPage from '@/components/Settings';

export default function App() {
  const { isPlaying, currentPage, loadSaves } = useGameStore();

  useEffect(() => {
    loadSaves();
  }, []);

  if (!isPlaying) {
    return <MainMenu />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return <Shop />;
      case 'kitchen':
        return <Kitchen />;
      case 'orders':
        return <Orders />;
      case 'dormitory':
        return <Dormitory />;
      case 'decoration':
        return <Decoration />;
      case 'collection':
        return <Collection />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Shop />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
      <Navigation />
    </div>
  );
}
