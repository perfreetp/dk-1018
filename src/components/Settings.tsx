import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Settings as SettingsIcon, Save, Home, Moon, Sun, AlertTriangle, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const { currentSave, saveGame, setDifficulty, deleteSave, setCurrentPage, loadSaves } = useGameStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!currentSave) return null;

  const handleSave = () => {
    saveGame();
    setSaveMessage('游戏已保存！');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleDelete = () => {
    if (confirm('确定要删除当前存档吗？此操作无法撤销！')) {
      deleteSave(currentSave.saveId);
    }
  };

  const handleReturnToMain = () => {
    saveGame();
    loadSaves();
    setCurrentPage('main');
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-gray-600 to-gray-700 p-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon size={24} />
          设置
        </h1>
      </header>

      <main className="p-4">
        <div className="cat-card mb-4">
          <h2 className="text-lg font-semibold text-text mb-4">存档信息</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <span className="text-text-muted">存档名称</span>
              <span className="font-medium text-text">存档 #{currentSave.saveId.slice(0, 5)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <span className="text-text-muted">店长名字</span>
              <span className="font-medium text-text">{currentSave.playerName}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <span className="text-text-muted">游戏天数</span>
              <span className="font-medium text-text">第 {currentSave.dayCount} 天</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <span className="text-text-muted">当前金币</span>
              <span className="font-medium text-accent">{currentSave.gold} 💰</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <span className="text-text-muted">最后保存</span>
              <span className="font-medium text-text">
                {new Date(currentSave.lastSave).toLocaleString('zh-CN')}
              </span>
            </div>
          </div>
        </div>

        <div className="cat-card mb-4">
          <h2 className="text-lg font-semibold text-text mb-4">难度设置</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setDifficulty('easy')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                currentSave.difficulty === 'easy'
                  ? 'bg-success text-white'
                  : 'bg-secondary text-text-muted hover:bg-secondary/80'
              }`}
            >
              <Sun size={18} />
              轻松模式
            </button>
            <button
              onClick={() => setDifficulty('challenge')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                currentSave.difficulty === 'challenge'
                  ? 'bg-danger text-white'
                  : 'bg-secondary text-text-muted hover:bg-secondary/80'
              }`}
            >
              <Moon size={18} />
              挑战模式
            </button>
          </div>
          <p className="text-xs text-text-muted mt-3 text-center">
            {currentSave.difficulty === 'easy' 
              ? '轻松模式：顾客耐心更高，游戏节奏更慢' 
              : '挑战模式：顾客耐心更低，游戏节奏更快'}
          </p>
        </div>

        <div className="cat-card mb-4">
          <h2 className="text-lg font-semibold text-text mb-4">保存管理</h2>
          <div className="space-y-3">
            <button
              onClick={handleSave}
              className="w-full cat-button flex items-center justify-center gap-2"
            >
              <Save size={18} />
              手动保存
            </button>
            {saveMessage && (
              <p className="text-center text-sm text-success">{saveMessage}</p>
            )}
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full px-4 py-3 bg-danger/20 text-danger rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-danger/30 transition-colors"
            >
              <RotateCcw size={18} />
              删除存档
            </button>
          </div>
          <p className="text-xs text-text-muted mt-3 text-center">
            游戏会每30秒自动保存一次
          </p>
        </div>

        <div className="cat-card mb-4">
          <h2 className="text-lg font-semibold text-text mb-4">游戏说明</h2>
          <div className="space-y-3 text-sm text-text-muted">
            <div className="flex items-start gap-2">
              <span className="text-lg">🍩</span>
              <p>拖拽食材到制作台制作甜点，满足顾客订单获取金币</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🐱</span>
              <p>雇佣猫咪员工可以自动处理订单，记得让它们休息恢复体力</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🏠</span>
              <p>购买装饰品可以提升店铺属性，获得更多收益</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📦</span>
              <p>随机出现的外卖订单提供更高的小费奖励</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🏆</span>
              <p>完成成就和每日目标可以获得额外金币奖励</p>
            </div>
          </div>
        </div>

        <div className="cat-card">
          <button
            onClick={handleReturnToMain}
            className="w-full px-4 py-3 bg-gray-200 text-text rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
          >
            <Home size={18} />
            返回主菜单
          </button>
        </div>
      </main>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="cat-card w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center">
                <AlertTriangle size={24} className="text-danger" />
              </div>
              <div>
                <h3 className="font-semibold text-text">确认删除</h3>
                <p className="text-sm text-text-muted">此操作无法撤销</p>
              </div>
            </div>
            <p className="text-sm text-text-muted mb-4">
              确定要删除当前存档吗？所有游戏进度将会丢失。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-text rounded-full font-medium"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-danger text-white rounded-full font-medium"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
