import { create } from 'zustand';
import type { GameState, SaveFile, Order, OrderItem, Difficulty, MakingDish } from '@/types';
import { getInitialGameState, recipes, customers } from '@/data/gameData';

interface GameStore {
  currentSave: GameState | null;
  saves: SaveFile[];
  isPlaying: boolean;
  currentPage: string;
  makingDishes: MakingDish[];
  
  loadSaves: () => void;
  createSave: (name: string, playerName?: string) => void;
  loadSave: (saveId: string) => void;
  deleteSave: (saveId: string) => void;
  
  saveGame: () => void;
  autoSave: () => void;
  
  setCurrentPage: (page: string) => void;
  exitToMainMenu: () => void;
  
  addOrder: (customerId: string) => void;
  completeOrder: (orderId: string) => void;
  failOrder: (orderId: string) => void;
  
  addIngredientToStation: (ingredientId: string) => boolean;
  clearStation: () => void;
  startMaking: () => void;
  updateMakingProgress: () => void;
  addFinishedDish: (recipeId: string) => void;
  
  addToInventory: (itemId: string, quantity: number) => void;
  
  hireEmployee: (name: string) => void;
  assignWork: (employeeId: string) => void;
  restEmployee: (employeeId: string) => void;
  updateEmployees: () => void;
  
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
  
  stationIngredients: string[];
  setStationIngredients: (ingredients: string[]) => void;
  
  getNextSaveId: () => string;
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
  makingDishes: [],
  stationIngredients: [],
  
  loadSaves: () => {
    const saves = loadSavesFromStorage();
    set({ saves });
  },
  
  createSave: (name, playerName = '店长') => {
    const id = generateId();
    const newSave = {
      ...getInitialGameState(id, playerName),
      finishedDishes: {},
      stats: {
        totalCustomersServed: 0,
        totalEarnings: 0,
        dishesMade: 0,
        tipsEarned: 0,
        daysPlayed: 1,
        deliveryOrdersCompleted: 0,
        deliveryEarnings: 0,
        dineInOrdersCompleted: 0,
        dineInEarnings: 0,
      },
      employees: [{
        id: 'emp1',
        name: '喵大厨',
        type: 'chef' as const,
        level: 1,
        energy: 100,
        maxEnergy: 100,
        isWorking: true,
        hourlyWage: 50,
        avatar: '👩🍳',
        efficiency: 1,
      }],
      makingQueue: [],
      dailyRecords: [],
      todayStats: {
        dineInOrders: 0,
        dineInEarnings: 0,
        deliveryOrders: 0,
        deliveryEarnings: 0,
        tips: 0,
        decorationsSpent: 0,
      },
    };
    
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
    localStorage.setItem(`cat-cafe-${id}`, JSON.stringify(newSave));
    
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
    
    if (saveIndex === -1) {
      const savedData = localStorage.getItem(`cat-cafe-${saveId}`);
      if (savedData) {
        try {
          const gameState = JSON.parse(savedData) as GameState;
          const existingSave = saves.find(s => s.id === saveId);
          if (existingSave) {
            set({
              currentSave: gameState,
              isPlaying: true,
              currentPage: 'shop',
            });
          }
        } catch {
          console.error('Failed to load save');
        }
      }
      return;
    }
    
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
      makingDishes: [],
      stationIngredients: [],
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
  
  exitToMainMenu: () => {
    get().saveGame();
    set({
      isPlaying: false,
      currentPage: 'main',
      makingDishes: [],
      stationIngredients: [],
    });
    get().loadSaves();
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
      isDelivery: false,
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
    
    const canServe = order.items.every(item => {
      const currentCount = currentSave.finishedDishes[item.itemId] || 0;
      return currentCount >= item.quantity;
    });
    
    if (!canServe) return;
    
    const finishedDishes = { ...currentSave.finishedDishes };
    order.items.forEach(item => {
      finishedDishes[item.itemId] = (finishedDishes[item.itemId] || 0) - item.quantity;
    });
    
    const orderTotal = order.items.reduce((sum, item) => {
      const recipe = recipes.find(r => r.id === item.itemId);
      return sum + (recipe?.price || 0) * item.quantity;
    }, 0);
    
    const totalEarnings = orderTotal + order.tip;
    
    const customer = customers.find(c => c.id === order.customerId);
    let unlockedCustomers = [...currentSave.unlockedCustomers];
    if (customer && !unlockedCustomers.includes(customer.id)) {
      unlockedCustomers.push(customer.id);
    }
    
    const isDelivery = order.isDelivery;
    
    const updatedTodayStats = { ...currentSave.todayStats };
    if (isDelivery) {
      updatedTodayStats.deliveryOrders++;
      updatedTodayStats.deliveryEarnings += orderTotal;
    } else {
      updatedTodayStats.dineInOrders++;
      updatedTodayStats.dineInEarnings += orderTotal;
    }
    updatedTodayStats.tips += order.tip;
    
    const updatedSave = {
      ...currentSave,
      gold: currentSave.gold + totalEarnings,
      orders: currentSave.orders.filter(o => o.id !== orderId),
      finishedDishes,
      todayStats: updatedTodayStats,
      stats: {
        ...currentSave.stats,
        totalCustomersServed: currentSave.stats.totalCustomersServed + 1,
        totalEarnings: currentSave.stats.totalEarnings + totalEarnings,
        tipsEarned: currentSave.stats.tipsEarned + order.tip,
        ...(isDelivery ? {
          deliveryOrdersCompleted: currentSave.stats.deliveryOrdersCompleted + 1,
          deliveryEarnings: currentSave.stats.deliveryEarnings + totalEarnings,
        } : {
          dineInOrdersCompleted: currentSave.stats.dineInOrdersCompleted + 1,
          dineInEarnings: currentSave.stats.dineInEarnings + totalEarnings,
        }),
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
    
    set({ currentSave: { ...currentSave, orders: currentSave.orders.filter(o => o.id !== orderId) } });
  },
  
  setStationIngredients: (ingredients) => {
    set({ stationIngredients: ingredients });
  },
  
  addIngredientToStation: (ingredientId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return false;
    
    if (currentSave.inventory[ingredientId] <= 0) return false;
    if (get().stationIngredients.length >= 6) return false;
    
    const inventory = { ...currentSave.inventory };
    inventory[ingredientId]--;
    
    const newStationIngredients = [...get().stationIngredients, ingredientId];
    
    set({
      currentSave: { ...currentSave, inventory },
      stationIngredients: newStationIngredients,
    });
    
    const matchedRecipe = recipes.find(r => {
      if (!currentSave.unlockedRecipes.includes(r.id)) return false;
      const sortedIngredients = [...newStationIngredients].sort();
      const sortedRecipeIngredients = [...r.ingredients].sort();
      return JSON.stringify(sortedIngredients) === JSON.stringify(sortedRecipeIngredients);
    });
    
    if (matchedRecipe) {
      const makingDish: MakingDish = {
        id: generateId(),
        recipeId: matchedRecipe.id,
        progress: 0,
        startTime: Date.now(),
        started: currentSave.makingQueue.length === 0,
      };
      
      set({
        currentSave: { ...currentSave, makingQueue: [...currentSave.makingQueue, makingDish] },
        stationIngredients: [],
      });
    }
    
    return true;
  },
  
  clearStation: () => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const inventory = { ...currentSave.inventory };
    get().stationIngredients.forEach(ing => {
      inventory[ing] = (inventory[ing] || 0) + 1;
    });
    
    set({
      currentSave: { ...currentSave, inventory },
      stationIngredients: [],
    });
  },
  
  startMaking: () => {
    const stationIngredients = get().stationIngredients;
    if (stationIngredients.length === 0) return;
    
    const matchedRecipe = recipes.find(r => {
      if (!get().currentSave?.unlockedRecipes.includes(r.id)) return false;
      const sortedIngredients = [...stationIngredients].sort();
      const sortedRecipeIngredients = [...r.ingredients].sort();
      return JSON.stringify(sortedIngredients) === JSON.stringify(sortedRecipeIngredients);
    });
    
    if (!matchedRecipe) return;
    
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const makingDish: MakingDish = {
      id: generateId(),
      recipeId: matchedRecipe.id,
      progress: 0,
      startTime: Date.now(),
      started: currentSave.makingQueue.length === 0,
    };
    
    set({
      currentSave: { ...currentSave, makingQueue: [...currentSave.makingQueue, makingDish] },
      stationIngredients: [],
    });
  },
  
  updateMakingProgress: () => {
    const now = Date.now();
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    let completedRecipes: string[] = [];
    let updatedQueue = [...currentSave.makingQueue];
    
    const firstStartedIndex = updatedQueue.findIndex(m => m.started);
    
    if (firstStartedIndex !== -1) {
      const making = updatedQueue[firstStartedIndex];
      const recipe = recipes.find(r => r.id === making.recipeId);
      
      if (recipe) {
        const speedBonus = (currentSave.stoveLevel - 1) * 0.2 + (currentSave.coffeeMachineLevel - 1) * 0.1;
        const chefBonus = currentSave.employees
          .filter(e => e.isWorking && e.type === 'chef')
          .reduce((sum, e) => sum + e.efficiency, 0) || 0;
        
        const adjustedTime = (recipe.makeTime * 1000) / (1 + speedBonus + chefBonus * 0.3);
        const elapsed = now - making.startTime;
        const progress = Math.min(100, (elapsed / adjustedTime) * 100);
        
        if (progress >= 100) {
          completedRecipes.push(making.recipeId);
          updatedQueue.splice(firstStartedIndex, 1);
          
          if (updatedQueue.length > 0) {
            updatedQueue[0] = { ...updatedQueue[0], started: true, startTime: Date.now() };
          }
        } else {
          updatedQueue[firstStartedIndex] = { ...making, progress };
        }
      }
    }
    
    set({ currentSave: { ...currentSave, makingQueue: updatedQueue } });
    
    completedRecipes.forEach(recipeId => {
      get().addFinishedDish(recipeId);
    });
  },
  
  addFinishedDish: (recipeId) => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const finishedDishes = { ...currentSave.finishedDishes };
    finishedDishes[recipeId] = (finishedDishes[recipeId] || 0) + 1;
    
    set({
      currentSave: {
        ...currentSave,
        finishedDishes,
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
      efficiency: 1,
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
  
  updateEmployees: () => {
    const currentSave = get().currentSave;
    if (!currentSave) return;
    
    const employees = currentSave.employees.map(e => {
      if (e.isWorking) {
        const energyLoss = e.type === 'chef' ? 0.5 : 0.3;
        const newEnergy = Math.max(0, e.energy - energyLoss);
        return { ...e, energy: newEnergy };
      } else {
        const energyGain = e.type === 'chef' ? 0.8 : 1;
        const newEnergy = Math.min(e.maxEnergy, e.energy + energyGain);
        return { ...e, energy: newEnergy };
      }
    });
    
    set({ currentSave: { ...currentSave, employees } });
    
    const workingCats = employees.filter(e => e.isWorking && e.type === 'cat' && e.energy > 20);
    if (workingCats.length > 0 && currentSave.orders.length > 0) {
      const pendingOrders = currentSave.orders.filter(o => o.status === 'pending' && !o.isDelivery);
      if (pendingOrders.length > 0 && Math.random() < workingCats.length * 0.1) {
        const randomOrder = pendingOrders[Math.floor(Math.random() * pendingOrders.length)];
        const canServe = randomOrder.items.every(item => {
          const currentCount = currentSave.finishedDishes[item.itemId] || 0;
          return currentCount >= item.quantity;
        });
        if (canServe) {
          get().completeOrder(randomOrder.id);
        }
      }
    }
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
        todayStats: {
          ...currentSave.todayStats,
          decorationsSpent: currentSave.todayStats.decorationsSpent + decoration.price,
        },
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
      if (order.isDelivery) {
        const newPatience = Math.max(0, order.patience - 1);
        return { ...order, patience: newPatience, status: newPatience <= 0 ? 'failed' as const : order.status };
      } else {
        const patienceDecrease = 1;
        const newPatience = Math.max(0, order.patience - (patienceDecrease * difficultyMultiplier) + patienceBonus / 20);
        return { ...order, patience: newPatience, status: newPatience <= 0 ? 'failed' as const : order.status };
      }
    });
    
    const remainingOrders = updatedOrders.filter(o => o.status !== 'failed');
    
    set({ currentSave: { ...currentSave, orders: remainingOrders } });
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
      energy: Math.min(e.maxEnergy, e.energy + 25),
    }));
    
    const dailyGoals = [
      { id: 'goal1', description: '服务5位顾客', target: 5, current: 0, reward: 100, completed: false },
      { id: 'goal2', description: '制作10份甜点', target: 10, current: 0, reward: 150, completed: false },
      { id: 'goal3', description: '获得50金币小费', target: 50, current: 0, reward: 200, completed: false },
    ];
    
    const todayIncome = currentSave.todayStats.dineInEarnings + currentSave.todayStats.deliveryEarnings + currentSave.todayStats.tips;
    const todayRecord = {
      day: currentSave.dayCount,
      dineInOrders: currentSave.todayStats.dineInOrders,
      dineInEarnings: currentSave.todayStats.dineInEarnings,
      deliveryOrders: currentSave.todayStats.deliveryOrders,
      deliveryEarnings: currentSave.todayStats.deliveryEarnings,
      tips: currentSave.todayStats.tips,
      decorationsSpent: currentSave.todayStats.decorationsSpent,
      netIncome: todayIncome - currentSave.todayStats.decorationsSpent,
      date: new Date().toISOString().split('T')[0],
    };
    
    set({
      currentSave: {
        ...currentSave,
        dayCount: currentSave.dayCount + 1,
        employees,
        dailyGoals,
        dailyRecords: [...currentSave.dailyRecords, todayRecord],
        todayStats: {
          dineInOrders: 0,
          dineInEarnings: 0,
          deliveryOrders: 0,
          deliveryEarnings: 0,
          tips: 0,
          decorationsSpent: 0,
        },
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
      patience: 180,
      maxPatience: 180,
      tip: Math.floor(Math.random() * 80) + 50,
      status: 'pending',
      createdAt: Date.now(),
      isDelivery: true,
    };
    
    set({ currentSave: { ...currentSave, orders: [...currentSave.orders, deliveryOrder] } });
  },
  
  getNextSaveId: () => {
    return generateId();
  },
}));
