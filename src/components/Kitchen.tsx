import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ingredients, recipes } from '@/data/gameData';
import { ChefHat, Flame, Coffee, Lock, Plus, Check } from 'lucide-react';

export default function Kitchen() {
  const { currentSave, makeDish, unlockRecipe, upgradeStove, upgradeCoffeeMachine } = useGameStore();
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [makingDish, setMakingDish] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState<string | null>(null);

  if (!currentSave) return null;

  const handleMakeDish = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    setSelectedRecipe(recipeId);
    setMakingDish(true);

    setTimeout(() => {
      const success = makeDish(recipeId);
      setMakingDish(false);
      if (success) {
        setSelectedRecipe(null);
      }
    }, recipe.makeTime * 200);
  };

  const handleUnlockRecipe = (recipeId: string) => {
    const success = unlockRecipe(recipeId);
    if (success) {
      setShowUnlockModal(null);
    }
  };

  const unlockedRecipes = recipes.filter(r => currentSave.unlockedRecipes.includes(r.id));
  const lockedRecipes = recipes.filter(r => !currentSave.unlockedRecipes.includes(r.id));

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-warning to-accent p-4">
        <h1 className="text-xl font-bold text-text flex items-center gap-2">
          <ChefHat size={24} />
          厨房
        </h1>
      </header>

      <main className="p-4">
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-text mb-3">升级炉具</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="cat-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                  <Flame size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="font-medium text-text">烤箱</h3>
                  <p className="text-sm text-text-muted">等级 {currentSave.stoveLevel}/5</p>
                </div>
              </div>
              {currentSave.stoveLevel >= 5 ? (
                <div className="text-center py-2 text-success font-medium">已满级</div>
              ) : (
                <button
                  onClick={upgradeStove}
                  disabled={currentSave.gold < currentSave.stoveLevel * 200}
                  className="w-full cat-button text-sm disabled:opacity-50"
                >
                  升级 ({currentSave.stoveLevel * 200} 💰)
                </button>
              )}
            </div>
            <div className="cat-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Coffee size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text">咖啡机</h3>
                  <p className="text-sm text-text-muted">等级 {currentSave.coffeeMachineLevel}/5</p>
                </div>
              </div>
              {currentSave.coffeeMachineLevel >= 5 ? (
                <div className="text-center py-2 text-success font-medium">已满级</div>
              ) : (
                <button
                  onClick={upgradeCoffeeMachine}
                  disabled={currentSave.gold < currentSave.coffeeMachineLevel * 150}
                  className="w-full cat-button text-sm disabled:opacity-50"
                >
                  升级 ({currentSave.coffeeMachineLevel * 150} 💰)
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-text mb-3">食材仓库</h2>
          <div className="grid grid-cols-4 gap-2">
            {ingredients.map(ingredient => (
              <div
                key={ingredient.id}
                className="cat-card text-center p-2"
              >
                <div className="text-2xl mb-1">{ingredient.emoji}</div>
                <div className="text-xs text-text-muted truncate">{ingredient.name}</div>
                <div className="text-sm font-medium text-text">
                  {currentSave.inventory[ingredient.id] || 0}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              Object.keys(currentSave.inventory).forEach(itemId => {
                const currentAmount = currentSave.inventory[itemId] || 0;
                if (currentAmount < 50) {
                  const amountToAdd = Math.min(10, 50 - currentAmount);
                  const cost = amountToAdd * 2;
                  if (currentSave.gold >= cost) {
                    currentSave.gold -= cost;
                    currentSave.inventory[itemId] = currentAmount + amountToAdd;
                  }
                }
              });
            }}
            disabled={currentSave.gold < 240}
            className="mt-3 w-full cat-button text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus size={16} />
            补充所有食材 (240 💰)
          </button>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-3">制作甜点</h2>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-text-muted mb-2">已解锁食谱</h3>
            <div className="space-y-2">
              {unlockedRecipes.map(recipe => {
                const isMaking = makingDish && selectedRecipe === recipe.id;
                const canMake = recipe.ingredients.every(
                  ing => currentSave.inventory[ing] && currentSave.inventory[ing] > 0
                );

                return (
                  <div
                    key={recipe.id}
                    className={`cat-card ${isMaking ? 'ring-2 ring-accent' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        isMaking ? 'bg-accent/20 animate-pulse' : 'bg-primary/20'
                      }`}>
                        {recipe.emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-text">{recipe.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recipe.ingredients.map(ing => {
                            const ingredient = ingredients.find(i => i.id === ing);
                            const hasIngredient = currentSave.inventory[ing] && currentSave.inventory[ing] > 0;
                            return (
                              <span
                                key={ing}
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  hasIngredient ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                                }`}
                              >
                                {ingredient?.emoji}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-accent">{recipe.price} 💰</div>
                        <button
                          onClick={() => handleMakeDish(recipe.id)}
                          disabled={!canMake || isMaking}
                          className={`mt-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            isMaking
                              ? 'bg-accent text-text'
                              : canMake
                              ? 'bg-primary text-white hover:bg-primary/90'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isMaking ? '制作中...' : '制作'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {lockedRecipes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-2">未解锁食谱</h3>
              <div className="space-y-2">
                {lockedRecipes.map(recipe => (
                  <div key={recipe.id} className="cat-card opacity-75">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Lock size={20} className="text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-text-muted">???</h4>
                        <p className="text-xs text-text-muted">解锁后可用</p>
                      </div>
                      <button
                        onClick={() => setShowUnlockModal(recipe.id)}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium hover:bg-primary/30"
                      >
                        解锁
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="cat-card w-full max-w-sm">
            <h3 className="text-lg font-semibold text-text mb-4">解锁食谱</h3>
            {(() => {
              const recipe = recipes.find(r => r.id === showUnlockModal);
              if (!recipe) return null;
              const cost = recipe.price * 10;
              return (
                <>
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{recipe.emoji}</div>
                    <h4 className="font-medium text-text">{recipe.name}</h4>
                    <p className="text-sm text-text-muted mt-1">制作时间: {recipe.makeTime}秒</p>
                    <p className="text-sm text-accent font-medium mt-1">解锁费用: {cost} 💰</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowUnlockModal(null)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-text rounded-full font-medium"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handleUnlockRecipe(recipe.id)}
                      disabled={currentSave.gold < cost}
                      className="flex-1 cat-button disabled:opacity-50"
                    >
                      <Check size={16} />
                      解锁
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
