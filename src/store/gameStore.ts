import { create } from 'zustand';
import type { GameState, SaveFile, Order, OrderItem, Difficulty } from '@/types';
import { getInitialGameState, recipes, customers } from '@/data/gameData';

interface GameStore {
  currentSave: GameState | null;
  saves: SaveFile[];
  isPlaying: boolean;
  currentPage: string;
  orders: Order[];
  
  loadSaves: () => void;
  createSave: (name: string, playerName?: string) => void;
  loadSave: (saveId: string) => void;
  deleteSave: (saveId: string) => void;
  
  saveGame: () => void;
  autoSave: () => void;
  
  setCurrentPage: (page: string) => void;
  
  addOrder: (customerId: string) => void;
  completeOrder: (orderId: string) => void;
  failOrder: (orderId: string) => void;
  
  makeDish: (recipeId: string) => boolean;
  addToInventory: (itemId: string, quantity: number) => void;
  
  hireEmployee: (name: string) => void;
  assignWork: (employeeId: string) => void;
  restEmployee: (employeeId: string) => void;
  
  buyDecoration: (decorationId: string) => boolean;
  equipDecoration: (decorationId: string) => void;
  
  unlockRecipe: (recipeId: string) => boolean;
  unlockCustomer: (customerId: string) => void;
  
  updatePatience: () => void;
  
  checkAchievements: () => void;
  checkDailyGoals: () => void;
  
  nextDay: () => void;
  
  setDifficulty: (difficulty: Difficulty) => void;
  
  upgradeStove: () => boolean;
  upgradeCoffeeMachine: () => boolean;
  
  triggerDeliveryOrder: () => void;
}

const STORAGE_KEY = 'cat-cafe-saves';

const loadSavesFromStorage = (): SaveFile[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveSavesToStorage = (saves: SaveFile[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useGameStore = create<GameStore>((set, get) => ({
  currentSave: null,
  saves: [],
  isPlaying: false,
  currentPage: 'main',
  orders: [],
  
  loadSaves: () => {
    const saves = loadSavesFromStorage();
    set({ saves });
  },
  
  createSave: (name, playerName = '店长') => {
    const id = generateId();
    const newSave = getInitialGameState(id, playerName);
    const saveFile: SaveFile = {
      id,
      name,
      playerName,
      gold: newSave.gold,
      level: newSave.level,
      dayCount: newSave.dayCount,
      difficulty: newSave.difficulty,
      lastSave: Date.now(),
    };
    
    const saves = [...get().saves, saveFile];
    saveSavesToStorage(saves);
    
    set({
      saves,
      currentSave: newSave,
      isPlaying: true,
      currentPage: 'shop',
    });
  },
  
  loadSave: (saveId) => {
    const saves = get().saves;
    const saveIndex = saves.findIndex(s => s.id === saveId);
    
    if (saveIndex === -1) return;
    
    const saveData = localStorage.getItem(`cat-cafe-${saveId}`);
    if (!saveData) return;
    
    try {
      const gameState = JSON.parse(saveData) as GameState;
      set({
        currentSave: gameState,
        isPlaying: true,
        currentPage: 'shop',
      });
    } catch {
      console.error('Failed to load save');
    }
  },
  
  deleteSave: (saveId) => {
    const saves = get().saves.filter(s => s.id !== saveId);
    localStorage.removeItem(`cat-cafe-${saveId}`);
    saveSavesToStorage(saves);
    
    set({
      saves,
      currentSave: null,
      isPlaying: false,
      currentPage: 'main',
    });
  },
  
  saveGame: () => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const updatedSave = { ...currentSave, lastSave: Date.now() };
    localStorage.setItem(`cat-cafe-${currentSave.saveId}`, JSON.stringify(updatedSave));
    
    const saves = get().saves.map(s => 
      s.id === currentSave.saveId 
        ? { ...s, lastSave: Date.now(), gold: updatedSave.gold, level: updatedSave.level, dayCount: updatedSave.dayCount }
        : s
    );
    saveSavesToStorage(saves);
    
    set({ currentSave: updatedSave, saves });
  },
  
  autoSave: () => {
    get().saveGame();
  },
  
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
  
  addOrder: (customerId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const unlockedRecipes = currentSave.unlockedRecipes;
    const availableItems = customer.favoriteItems.filter(id => unlockedRecipes.includes(id));
    
    if (availableItems.length === 0) return;
    
    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    const quantity = Math.floor(Math.random() * 2) + 1;
    
    const order: Order = {
      id: generateId(),
      customerId,
      items: [{ itemId: randomItem, quantity }],
      patience: currentSave.difficulty === 'easy' ? 100 : 60,
      maxPatience: currentSave.difficulty === 'easy' ? 100 : 60,
      tip: Math.floor(Math.random() * 20) + 5,
      status: 'pending',
      createdAt: Date.now(),
    };
    
    const orders = [...currentSave.orders, order];
    set({ currentSave: { ...currentSave, orders } });
  },
  
  completeOrder: (orderId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const orderIndex = currentSave.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const order = currentSave.orders[orderIndex];
    const orderTotal = order.items.reduce((sum, item) => {
      const recipe = recipes.find(r => r.id === item.itemId);
      return sum + (recipe?.price || 0) * item.quantity;
    }, 0);
    
    const totalEarnings = orderTotal + order.tip;
    
    const updatedOrders = currentSave.orders.map(o =>
      o.id === orderId ? { ...o, status: 'completed' as const } : o
    );
    
    const customer = customers.find(c => c.id === order.customerId);
    let unlockedCustomers = [...currentSave.unlockedCustomers];
    if (customer && !unlockedCustomers.includes(customer.id)) {
      unlockedCustomers.push(customer.id);
    }
    
    const updatedSave = {
      ...currentSave,
      gold: currentSave.gold + totalEarnings,
      orders: updatedOrders.filter(o => o.id !== orderId),
      stats: {
        ...currentSave.stats,
        totalCustomersServed: currentSave.stats.totalCustomersServed + 1,
        totalEarnings: currentSave.stats.totalEarnings + totalEarnings,
        tipsEarned: currentSave.stats.tipsEarned + order.tip,
      },
      unlockedCustomers,
      dailyGoals: currentSave.dailyGoals.map(g => {
        if (g.id === 'goal1') {
          const newCurrent = Math.min(g.current + 1, g.target);
          return { ...g, current: newCurrent, completed: newCurrent >= g.target };
        }
        if (g.id === 'goal3') {
          const newCurrent = Math.min(g.current + order.tip, g.target);
          return { ...g, current: newCurrent, completed: newCurrent >= g.target };
        }
        return g;
      }),
    };
    
    set({ currentSave: updatedSave });
    get().checkAchievements();
    get().checkDailyGoals();
  },
  
  failOrder: (orderId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const updatedOrders = currentSave.orders.map(o =>
      o.id === orderId ? { ...o, status: 'failed' as const } : o
    );
    
    set({ currentSave: { ...currentSave, orders: updatedOrders.filter(o => o.id !== orderId) } });
  },
  
  makeDish: (recipeId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return false;
    
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe || !currentSave.unlockedRecipes.includes(recipeId)) return false;
    
    const inventory = { ...currentSave.inventory };
    for (const ingredientId of recipe.ingredients) {
      if (!inventory[ingredientId] || inventory[ingredientId] <= 0) {
        return false;
      }
      inventory[ingredientId]--;
    }
    
    set({
      currentSave: {
        ...currentSave,
        inventory,
        stats: { ...currentSave.stats, dishesMade: currentSave.stats.dishesMade + 1 },
        dailyGoals: currentSave.dailyGoals.map(g => {
          if (g.id === 'goal2') {
            const newCurrent = Math.min(g.current + 1, g.target);
            return { ...g, current: newCurrent, completed: newCurrent >= g.target };
          }
          return g;
        }),
      },
    });
    
    get().checkAchievements();
    get().checkDailyGoals();
    return true;
  },
  
  addToInventory: (itemId, quantity) => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const inventory = { ...currentSave.inventory };
    inventory[itemId] = (inventory[itemId] || 0) + quantity;
    
    set({ currentSave: { ...currentSave, inventory } });
  },
  
  hireEmployee: (name) => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const cost = 300;
    if (currentSave.gold < cost) return;
    
    const newEmployee = {
      id: generateId(),
      name,
      type: 'cat' as const,
      level: 1,
      energy: 100,
      maxEnergy: 100,
      isWorking: true,
      hourlyWage: 20,
      avatar: ['🐱', '😺', '😸', '😹', '😻'][Math.floor(Math.random() * 5)],
    };
    
    set({
      currentSave: {
        ...currentSave,
        gold: currentSave.gold - cost,
        employees: [...currentSave.employees, newEmployee],
      },
    });
  },
  
  assignWork: (employeeId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const employees = currentSave.employees.map(e =>
      e.id === employeeId ? { ...e, isWorking: true } : e
    );
    
    set({ currentSave: { ...currentSave, employees } });
  },
  
  restEmployee: (employeeId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const employees = currentSave.employees.map(e =>
      e.id === employeeId ? { ...e, isWorking: false } : e
    );
    
    set({ currentSave: { ...currentSave, employees } });
  },
  
  buyDecoration: (decorationId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return false;
    
    const decoration = currentSave.decorations.find(d => d.id === decorationId);
    if (!decoration || decoration.owned) return false;
    
    if (currentSave.gold < decoration.price) return false;
    
    const decorations = currentSave.decorations.map(d =>
      d.id === decorationId ? { ...d, owned: true, equipped: true } : d
    );
    
    set({
      currentSave: {
        ...currentSave,
        gold: currentSave.gold - decoration.price,
        decorations,
      },
    });
    
    get().checkAchievements();
    return true;
  },
  
  equipDecoration: (decorationId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const decoration = currentSave.decorations.find(d => d.id === decorationId);
    if (!decoration || !decoration.owned) return;
    
    const decorations = currentSave.decorations.map(d => {
      if (d.type === decoration.type) {
        return { ...d, equipped: d.id === decorationId };
      }
      return d;
    });
    
    set({ currentSave: { ...currentSave, decorations } });
  },
  
  unlockRecipe: (recipeId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return false;
    
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe || currentSave.unlockedRecipes.includes(recipeId)) return false;
    
    const cost = recipe.price * 10;
    if (currentSave.gold < cost) return false;
    
    set({
      currentSave: {
        ...currentSave,
        gold: currentSave.gold - cost,
        unlockedRecipes: [...currentSave.unlockedRecipes, recipeId],
      },
    });
    
    get().checkAchievements();
    return true;
  },
  
  unlockCustomer: (customerId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    if (currentSave.unlockedCustomers.includes(customerId)) return;
    
    set({
      currentSave: {
        ...currentSave,
        unlockedCustomers: [...currentSave.unlockedCustomers, customerId],
      },
    });
    
    get().checkAchievements();
  },
  
  updatePatience: () => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const difficultyMultiplier = currentSave.difficulty === 'easy' ? 0.5 : 1;
    const patienceBonus = currentSave.decorations
      .filter(d => d.equipped && d.bonus.type === 'patience')
      .reduce((sum, d) => sum + d.bonus.value, 0);
    
    const updatedOrders = currentSave.orders.map(order => {
      const newPatience = Math.max(0, order.patience - (1 * difficultyMultiplier) + patienceBonus / 10);
      return { ...order, patience: newPatience, status: newPatience <= 0 ? 'failed' as const : order.status };
    });
    
    const failedOrders = updatedOrders.filter(o => o.status === 'failed');
    const remainingOrders = updatedOrders.filter(o => o.status !== 'failed');
    
    set({ currentSave: { ...currentSave, orders: remainingOrders } });
    
    failedOrders.forEach(() => {
      get().failOrder(failedOrders[0]?.id || '');
    });
  },
  
  checkAchievements: () => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    let updatedGold = currentSave.gold;
    const updatedAchievements = currentSave.achievements.map(achievement => {
      if (achievement.completed) return achievement;
      
      let progress = achievement.progress;
      
      switch (achievement.id) {
        case 'ach1':
          progress = currentSave.stats.totalCustomersServed >= 1 ? 1 : 0;
          break;
        case 'ach2':
          progress = Math.min(currentSave.stats.totalCustomersServed, achievement.target);
          break;
        case 'ach3':
          progress = Math.min(currentSave.stats.tipsEarned, achievement.target);
          break;
        case 'ach4':
          progress = currentSave.unlockedRecipes.length;
          break;
        case 'ach5':
          progress = currentSave.unlockedCustomers.length;
          break;
        case 'ach6':
          progress = currentSave.decorations.filter(d => d.owned).length;
          break;
        case 'ach7':
          progress = currentSave.dayCount;
          break;
        case 'ach8':
          progress = Math.min(currentSave.stats.totalEarnings, achievement.target);
          break;
      }
      
      const completed = progress >= achievement.target;
      if (completed && !achievement.completed) {
        updatedGold += achievement.reward;
      }
      
      return { ...achievement, progress, completed };
    });
    
    set({ currentSave: { ...currentSave, achievements: updatedAchievements, gold: updatedGold } });
  },
  
  checkDailyGoals: () => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    let updatedGold = currentSave.gold;
    const updatedGoals = currentSave.dailyGoals.map(goal => {
      if (goal.completed) return goal;
      
      const completed = goal.current >= goal.target;
      if (completed) {
        updatedGold += goal.reward;
      }
      
      return { ...goal, completed };
    });
    
    set({ currentSave: { ...currentSave, dailyGoals: updatedGoals, gold: updatedGold } });
  },
  
  nextDay: () => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const employees = currentSave.employees.map(e => ({
      ...e,
      energy: Math.min(e.maxEnergy, e.energy + 20),
    }));
    
    const dailyGoals = [
      { id: 'goal1', description: '服务5位顾客', target: 5, current: 0, reward: 100, completed: false },
      { id: 'goal2', description: '制作10份甜点', target: 10, current: 0, reward: 150, completed: false },
      { id: 'goal3', description: '获得50金币小费', target: 50, current: 0, reward: 200, completed: false },
    ];
    
    set({
      currentSave: {
        ...currentSave,
        dayCount: currentSave.dayCount + 1,
        employees,
        dailyGoals,
        stats: { ...currentSave.stats, daysPlayed: currentSave.stats.daysPlayed + 1 },
      },
    });
    
    get().checkAchievements();
  },
  
  setDifficulty: (difficulty) => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    set({ currentSave: { ...currentSave, difficulty } });
  },
  
  upgradeStove: () => {
    const currentSave = get().currentSave;
    if (!currentSave) return false;
    
    const cost = currentSave.stoveLevel * 200;
    if (currentSave.gold < cost || currentSave.stoveLevel >= 5) return false;
    
    set({
      currentSave: {
        ...currentSave,
        gold: currentSave.gold - cost,
        stoveLevel: currentSave.stoveLevel + 1,
      },
    });
    
    return true;
  },
  
  upgradeCoffeeMachine: () => {
    const currentSave = get().currentSave;
    if (!currentSave) return false;
    
    const cost = currentSave.coffeeMachineLevel * 150;
    if (currentSave.gold < cost || currentSave.coffeeMachineLevel >= 5) return false;
    
    set({
      currentSave: {
        ...currentSave,
        gold: currentSave.gold - cost,
        coffeeMachineLevel: currentSave.coffeeMachineLevel + 1,
      },
    });
    
    return true;
  },
  
  triggerDeliveryOrder: () => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const unlockedRecipes = currentSave.unlockedRecipes;
    if (unlockedRecipes.length === 0) return;
    
    const numItems = Math.floor(Math.random() * 3) + 2;
    const items: OrderItem[] = [];
    
    for (let i = 0; i < numItems; i++) {
      const randomRecipe = unlockedRecipes[Math.floor(Math.random() * unlockedRecipes.length)];
      items.push({ itemId: randomRecipe, quantity: Math.floor(Math.random() * 3) + 1 });
    }
    
    const deliveryOrder: Order = {
      id: generateId(),
      customerId: 'delivery',
      items,
      patience: 120,
      maxPatience: 120,
      tip: Math.floor(Math.random() * 50) + 30,
      status: 'pending',
      createdAt: Date.now(),
    };
    
    set({ currentSave: { ...currentSave, orders: [...currentSave.orders, deliveryOrder] } });
  },
}));
