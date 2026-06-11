import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Plus, Play, Trash2, Save } from 'lucide-react';

export default function MainMenu() {
  const { saves, loadSaves, createSave, loadSave, deleteSave } = useGameStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [playerName, setPlayerName] = useState('店长');

  if (saves.length === 0) {
    loadSaves();
  }

  const handleCreateSave = () => {
    if (saveName.trim()) {
      createSave(saveName.trim(), playerName.trim() || '店长');
      setShowCreateModal(false);
      setSaveName('');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <span className="text-5xl">🐱</span>
          猫咪点心店
          <span className="text-5xl">🍩</span>
        </h1>
        <p className="text-text-muted">经营你的专属猫咪甜品店</p>
      </div>

      <div className="w-full max-w-md">
        {saves.length === 0 ? (
          <div className="cat-card text-center py-12">
            <div className="text-6xl mb-4">🎂</div>
            <p className="text-text-muted mb-4">还没有存档</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="cat-button flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              创建新存档
            </button>
          </div>
        ) : (
          <>
            <div className="cat-card mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text">我的存档</h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="cat-button flex items-center gap-1 text-sm"
                >
                  <Plus size={16} />
                  新建
                </button>
              </div>
              <div className="space-y-3">
                {saves.map((save) => (
                  <div
                    key={save.id}
                    className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors cursor-pointer group"
                    onClick={() => loadSave(save.id)}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                      {save.difficulty === 'easy' ? '😊' : '🔥'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text truncate">{save.name}</h3>
                      <p className="text-sm text-text-muted">
                        {save.playerName} · 第 {save.dayCount} 天 · {save.gold} 💰
                      </p>
                      <p className="text-xs text-text-muted">{formatDate(save.lastSave)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('确定要删除这个存档吗？')) {
                            deleteSave(save.id);
                          }
                        }}
                        className="p-2 text-danger opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-danger/10"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadSave(save.id);
                        }}
                        className="cat-button text-sm flex items-center gap-1"
                      >
                        <Play size={16} />
                        继续
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="cat-card w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">新建存档</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSaveName('');
                }}
                className="text-text-muted hover:text-text"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">存档名称</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="给存档起个名字"
                  className="cat-input"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">店长名字</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="你的名字"
                  className="cat-input"
                  maxLength={10}
                />
              </div>
              <button
                onClick={handleCreateSave}
                disabled={!saveName.trim()}
                className="cat-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                创建存档
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
