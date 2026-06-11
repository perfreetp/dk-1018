import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ingredients, recipes } from '@/data/gameData';
import { ChefHat, Flame, Coffee, Lock, Plus, Check, Trash2, Play } from 'lucide-react';

export default function Kitchen() {
  const { 
    currentSave, 
    stationIngredients,
    makingDishes,
    addIngredientToStation, 
    clearStation, 
    startMaking,
    unlockRecipe,
    upgradeStove,
    upgradeCoffeeMachine,
    addToInventory,
  } = useGameStore();
  
  const [showUnlockModal, setShowUnlockModal] = useState<string | null>(null);

  if (!currentSave) return null;

  const handleDragStart = (e: React.DragEvent, ingredientId: string) => {
    e.dataTransfer.setData('ingredient', ingredientId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const ingredientId = e.dataTransfer.getData('ingredient');
    addIngredientToStation(ingredientId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUnlockRecipe = (recipeId: string) => {
    const success = unlockRecipe(recipeId);
    if (success) {
      setShowUnlockModal(null);
    }
  };

  const matchedRecipe = recipes.find(r => {
    if (!currentSave.unlockedRecipes.includes(r.id)) return false;
    const sortedIngredients = [...stationIngredients].sort();
    const sortedRecipeIngredients = [...r.ingredients].sort();
    return JSON.stringify(sortedIngredients) === JSON.stringify(sortedRecipeIngredients);
  });

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
          <h2 className="text-lg font-semibold text-text mb-3">制作台</h2>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`cat-card min-h-[180px] border-2 border-dashed transition-all duration-300 ${
              stationIngredients.length > 0 ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-muted">拖拽食材到这里</span>
              <div className="flex gap-2">
                <button
                  onClick={clearStation}
                  disabled={stationIngredients.length === 0}
                  className="p-2 text-danger opacity-50 hover:opacity-100 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 min-h-[100px]">
              {stationIngredients.map((ing, idx) => {
                const ingredient = ingredients.find(i => i.id === ing);
                return (
                  <div
                    key={idx}
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl shadow-md"
                  >
                    {ingredient?.emoji}
                  </div>
                );
              })}
              {stationIngredients.length === 0 && (
                <div className="w-full h-20 flex items-center justify-center text-text-muted">
                  <span>放置食材开始制作</span>
                </div>
              )}
            </div>
            
            {matchedRecipe && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{matchedRecipe.emoji}</span>
                    <div>
                      <h4 className="font-medium text-text">{matchedRecipe.name}</h4>
                      <p className="text-sm text-text-muted">制作时间: {matchedRecipe.makeTime}秒</p>
                    </div>
                  </div>
                  <button
                    onClick={startMaking}
                    className="cat-button flex items-center gap-2"
                  >
                    <Play size={16} />
                    开始制作
                  </button>
                </div>
              </div>
            )}
            
            {stationIngredients.length > 0 && !matchedRecipe && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-danger text-center">配方不匹配，请检查食材组合</p>
              </div>
            )}
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text">制作中</h2>
            <span className="text-sm text-text-muted">{makingDishes.length} 份制作中</span>
          </div>
          
          {makingDishes.length === 0 ? (
            <div className="cat-card text-center py-6">
              <div className="text-4xl mb-2">🍳</div>
              <p className="text-text-muted">暂无制作中的甜点</p>
            </div>
          ) : (
            <div className="space-y-3">
              {makingDishes.map((making, idx) => {
                const recipe = recipes.find(r => r.id === making.recipeId);
                return (
                  <div key={idx} className="cat-card">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl animate-pulse">
                        {recipe?.emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-text">{recipe?.name}</h4>
                        <div className="mt-1">
                          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                            <span>制作进度</span>
                            <span>{Math.round(making.progress)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent transition-all duration-300"
                              style={{ width: `${making.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text">成品库存</h2>
          </div>
          <div className="cat-card">
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(currentSave.finishedDishes).map(([recipeId, count]) => {
                const recipe = recipes.find(r => r.id === recipeId);
                return (
                  <div key={recipeId} className="text-center p-2 bg-secondary/50 rounded-xl">
                    <div className="text-2xl mb-1">{recipe?.emoji}</div>
                    <div className="text-xs text-text-muted">{recipe?.name}</div>
                    <div className="text-lg font-bold text-primary">{count}</div>
                  </div>
                );
              })}
              {Object.keys(currentSave.finishedDishes).length === 0 && (
                <div className="col-span-4 text-center py-4 text-text-muted">
                  暂无成品
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text">食材仓库</h2>
            <button
              onClick={() => {
                Object.keys(currentSave.inventory).forEach(itemId => {
                  const currentAmount = currentSave.inventory[itemId] || 0;
                  if (currentAmount < 50) {
                    const amountToAdd = Math.min(10, 50 - currentAmount);
                    const cost = amountToAdd * 2;
                    if (currentSave.gold >= cost) {
                      currentSave.gold -= cost;
                      addToInventory(itemId, amountToAdd);
                    }
                  }
                });
              }}
              disabled={currentSave.gold < 240}
              className="cat-button text-sm flex items-center gap-1 disabled:opacity-50"
            >
              <Plus size={14} />
              补充食材 (240 💰)
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ingredients.map(ingredient => {
              const count = currentSave.inventory[ingredient.id] || 0;
              return (
                <div
                  key={ingredient.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, ingredient.id)}
                  className={`cat-card text-center p-2 cursor-grab active:cursor-grabbing transition-all ${
                    count <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                >
                  <div className="text-2xl mb-1">{ingredient.emoji}</div>
                  <div className="text-xs text-text-muted truncate">{ingredient.name}</div>
                  <div className={`text-sm font-medium ${count > 0 ? 'text-text' : 'text-danger'}`}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-3">食谱图鉴</h2>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-text-muted mb-2">已解锁食谱</h3>
            <div className="space-y-2">
              {unlockedRecipes.map(recipe => (
                <div key={recipe.id} className="cat-card">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                      {recipe.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text">{recipe.name}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {recipe.ingredients.map(ing => {
                          const ingredient = ingredients.find(i => i.id === ing);
                          return (
                            <span
                              key={ing}
                              className="text-xs px-2 py-0.5 bg-secondary rounded-full"
                            >
                              {ingredient?.emoji} {ingredient?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-accent">{recipe.price} 💰</div>
                      <div className="text-xs text-text-muted">{recipe.makeTime}秒</div>
                    </div>
                  </div>
                </div>
              ))}
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
