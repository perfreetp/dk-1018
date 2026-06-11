export type Difficulty = 'easy' | 'challenge';

export type ItemType = 'donut' | 'bubbleTea' | 'pudding';

export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface Recipe {
  id: string;
  name: string;
  type: ItemType;
  ingredients: string[];
  makeTime: number;
  price: number;
  unlocked: boolean;
  emoji: string;
}

export interface OrderItem {
  itemId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  patience: number;
  maxPatience: number;
  tip: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
  isDelivery: boolean;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  favoriteItems: string[];
  story: string;
  unlocked: boolean;
  visitCount: number;
}

export interface Employee {
  id: string;
  name: string;
  type: 'cat' | 'chef';
  level: number;
  energy: number;
  maxEnergy: number;
  isWorking: boolean;
  hourlyWage: number;
  avatar: string;
  efficiency: number;
}

export interface Decoration {
  id: string;
  type: 'table' | 'wallpaper' | 'floor' | 'decoration';
  name: string;
  price: number;
  owned: boolean;
  equipped: boolean;
  bonus: { type: string; value: number };
  emoji: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  completed: boolean;
  progress: number;
  target: number;
  reward: number;
}

export interface GameStats {
  totalCustomersServed: number;
  totalEarnings: number;
  dishesMade: number;
  tipsEarned: number;
  daysPlayed: number;
  deliveryOrdersCompleted: number;
  deliveryEarnings: number;
  dineInOrdersCompleted: number;
  dineInEarnings: number;
}

export interface DailyGoal {
  id: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
}

export interface GameState {
  saveId: string;
  playerName: string;
  gold: number;
  level: number;
  dayCount: number;
  difficulty: Difficulty;
  lastSave: number;
  stats: GameStats;
  orders: Order[];
  employees: Employee[];
  decorations: Decoration[];
  achievements: Achievement[];
  unlockedRecipes: string[];
  unlockedCustomers: string[];
  dailyGoals: DailyGoal[];
  inventory: Record<string, number>;
  finishedDishes: Record<string, number>;
  stoveLevel: number;
  coffeeMachineLevel: number;
  makingQueue: MakingDish[];
  dailyRecords: DailyRecord[];
  todayStats: {
    dineInOrders: number;
    dineInEarnings: number;
    deliveryOrders: number;
    deliveryEarnings: number;
    tips: number;
    decorationsSpent: number;
  };
}

export interface SaveFile {
  id: string;
  name: string;
  playerName: string;
  gold: number;
  level: number;
  dayCount: number;
  difficulty: Difficulty;
  lastSave: number;
}

export interface MakingDish {
  id: string;
  recipeId: string;
  progress: number;
  startTime: number;
}

export interface DailyRecord {
  day: number;
  dineInOrders: number;
  dineInEarnings: number;
  deliveryOrders: number;
  deliveryEarnings: number;
  tips: number;
  decorationsSpent: number;
  netIncome: number;
  date: string;
}
