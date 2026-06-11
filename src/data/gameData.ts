import type { Ingredient, Recipe, Customer, Employee, Decoration, Achievement, DailyGoal } from '@/types';

export const ingredients: Ingredient[] = [
  { id: 'flour', name: '面粉', emoji: '🌾', color: '#F5DEB3' },
  { id: 'sugar', name: '糖', emoji: '🍬', color: '#FFD700' },
  { id: 'milk', name: '牛奶', emoji: '🥛', color: '#FFFFFF' },
  { id: 'egg', name: '鸡蛋', emoji: '🥚', color: '#FFFACD' },
  { id: 'chocolate', name: '巧克力', emoji: '🍫', color: '#8B4513' },
  { id: 'strawberry', name: '草莓', emoji: '🍓', color: '#FF6B8A' },
  { id: 'matcha', name: '抹茶', emoji: '🍵', color: '#7CFC00' },
  { id: 'cream', name: '奶油', emoji: '🥛', color: '#FFFAF0' },
  { id: 'tea', name: '茶叶', emoji: '🫖', color: '#D2691E' },
  { id: 'pearl', name: '珍珠', emoji: '⚫', color: '#1a1a1a' },
  { id: 'coconut', name: '椰果', emoji: '🥥', color: '#FFE4C4' },
  { id: 'puddingMix', name: '布丁粉', emoji: '🍮', color: '#DEB887' },
];

export const recipes: Recipe[] = [
  { id: 'donut_original', name: '原味甜甜圈', type: 'donut', ingredients: ['flour', 'sugar', 'milk', 'egg'], makeTime: 5, price: 15, unlocked: true, emoji: '🍩' },
  { id: 'donut_chocolate', name: '巧克力甜甜圈', type: 'donut', ingredients: ['flour', 'sugar', 'milk', 'egg', 'chocolate'], makeTime: 6, price: 20, unlocked: true, emoji: '🍫' },
  { id: 'donut_strawberry', name: '草莓甜甜圈', type: 'donut', ingredients: ['flour', 'sugar', 'milk', 'egg', 'strawberry'], makeTime: 6, price: 22, unlocked: false, emoji: '🍓' },
  { id: 'donut_matcha', name: '抹茶甜甜圈', type: 'donut', ingredients: ['flour', 'sugar', 'milk', 'egg', 'matcha'], makeTime: 7, price: 25, unlocked: false, emoji: '🍵' },
  { id: 'bubble_tea_milk', name: '原味奶茶', type: 'bubbleTea', ingredients: ['tea', 'milk', 'sugar'], makeTime: 4, price: 12, unlocked: true, emoji: '🧋' },
  { id: 'bubble_tea_pearl', name: '珍珠奶茶', type: 'bubbleTea', ingredients: ['tea', 'milk', 'sugar', 'pearl'], makeTime: 5, price: 18, unlocked: true, emoji: '🧋' },
  { id: 'bubble_tea_coconut', name: '椰果奶茶', type: 'bubbleTea', ingredients: ['tea', 'milk', 'sugar', 'coconut'], makeTime: 5, price: 18, unlocked: false, emoji: '🥥' },
  { id: 'bubble_tea_chocolate', name: '巧克力奶茶', type: 'bubbleTea', ingredients: ['tea', 'milk', 'sugar', 'chocolate'], makeTime: 6, price: 20, unlocked: false, emoji: '🍫' },
  { id: 'pudding_original', name: '原味布丁', type: 'pudding', ingredients: ['puddingMix', 'milk', 'egg'], makeTime: 8, price: 18, unlocked: true, emoji: '🍮' },
  { id: 'pudding_chocolate', name: '巧克力布丁', type: 'pudding', ingredients: ['puddingMix', 'milk', 'egg', 'chocolate'], makeTime: 9, price: 25, unlocked: false, emoji: '🍫' },
  { id: 'pudding_strawberry', name: '草莓布丁', type: 'pudding', ingredients: ['puddingMix', 'milk', 'egg', 'strawberry'], makeTime: 9, price: 25, unlocked: false, emoji: '🍓' },
  { id: 'pudding_matcha', name: '抹茶布丁', type: 'pudding', ingredients: ['puddingMix', 'milk', 'egg', 'matcha'], makeTime: 10, price: 30, unlocked: false, emoji: '🍵' },
];

export const customers: Customer[] = [
  { id: 'cat1', name: '小橘', avatar: '🐱', favoriteItems: ['donut_original', 'bubble_tea_milk'], story: '一只爱吃甜食的橘猫，每天都会来店里报到。据说它的主人是一位退休的糕点师。', unlocked: true, visitCount: 0 },
  { id: 'cat2', name: '奶牛', avatar: '🐈', favoriteItems: ['bubble_tea_pearl', 'pudding_original'], story: '黑白相间的优雅猫咪，喜欢在午后时光来店里享用下午茶。', unlocked: true, visitCount: 0 },
  { id: 'cat3', name: '雪球', avatar: '😺', favoriteItems: ['donut_chocolate', 'pudding_chocolate'], story: '浑身雪白的猫咪，其实内心住着一只巧克力怪兽！', unlocked: false, visitCount: 0 },
  { id: 'cat4', name: '虎斑', avatar: '🐯', favoriteItems: ['donut_matcha', 'bubble_tea_coconut'], story: '威风凛凛的虎斑猫，其实是个抹茶控，每天都要喝一杯抹茶饮品。', unlocked: false, visitCount: 0 },
  { id: 'cat5', name: '暹罗', avatar: '😸', favoriteItems: ['pudding_strawberry', 'donut_strawberry'], story: '高贵的暹罗猫，只吃最新鲜的草莓甜点。', unlocked: false, visitCount: 0 },
  { id: 'cat6', name: '三花', avatar: '🐱', favoriteItems: ['bubble_tea_chocolate', 'pudding_matcha'], story: '三花猫总是带着神秘的微笑，似乎知道很多店里的小秘密。', unlocked: false, visitCount: 0 },
];

export const initialEmployees: Employee[] = [
  { id: 'emp1', name: '喵大厨', type: 'chef', level: 1, energy: 100, maxEnergy: 100, isWorking: true, hourlyWage: 50, avatar: '👩🍳' },
];

export const decorations: Decoration[] = [
  { id: 'table1', type: 'table', name: '木质小桌', price: 100, owned: true, equipped: true, bonus: { type: 'tip', value: 5 }, emoji: '🪑' },
  { id: 'table2', type: 'table', name: '粉色圆桌', price: 300, owned: false, equipped: false, bonus: { type: 'tip', value: 10 }, emoji: '🪑' },
  { id: 'table3', type: 'table', name: '猫咪造型桌', price: 800, owned: false, equipped: false, bonus: { type: 'tip', value: 20 }, emoji: '🐱' },
  { id: 'wall1', type: 'wallpaper', name: '简约白墙', price: 50, owned: true, equipped: true, bonus: { type: 'patience', value: 5 }, emoji: '🧱' },
  { id: 'wall2', type: 'wallpaper', name: '粉色碎花', price: 200, owned: false, equipped: false, bonus: { type: 'patience', value: 10 }, emoji: '🌸' },
  { id: 'wall3', type: 'wallpaper', name: '猫咪壁纸', price: 500, owned: false, equipped: false, bonus: { type: 'patience', value: 20 }, emoji: '🐾' },
  { id: 'floor1', type: 'floor', name: '木地板', price: 80, owned: true, equipped: true, bonus: { type: 'speed', value: 5 }, emoji: '🪵' },
  { id: 'floor2', type: 'floor', name: '瓷砖地面', price: 250, owned: false, equipped: false, bonus: { type: 'speed', value: 10 }, emoji: '🧱' },
  { id: 'floor3', type: 'floor', name: '猫咪地毯', price: 600, owned: false, equipped: false, bonus: { type: 'speed', value: 20 }, emoji: '🐈' },
  { id: 'deco1', type: 'decoration', name: '小花盆', price: 50, owned: true, equipped: true, bonus: { type: 'attract', value: 5 }, emoji: '🌱' },
  { id: 'deco2', type: 'decoration', name: '猫咪摆件', price: 150, owned: false, equipped: false, bonus: { type: 'attract', value: 10 }, emoji: '🐱' },
  { id: 'deco3', type: 'decoration', name: '甜品展示架', price: 400, owned: false, equipped: false, bonus: { type: 'attract', value: 20 }, emoji: '🍰' },
];

export const achievements: Achievement[] = [
  { id: 'ach1', name: '开业大吉', description: '完成第一笔订单', icon: '🎉', completed: false, progress: 0, target: 1, reward: 100 },
  { id: 'ach2', name: '忙碌的一天', description: '一天内服务10位顾客', icon: '🔥', completed: false, progress: 0, target: 10, reward: 200 },
  { id: 'ach3', name: '小费达人', description: '累计获得500金币小费', icon: '💰', completed: false, progress: 0, target: 500, reward: 300 },
  { id: 'ach4', name: '甜品大师', description: '解锁所有食谱', icon: '👩🍳', completed: false, progress: 0, target: 12, reward: 500 },
  { id: 'ach5', name: '猫奴之王', description: '收集所有顾客故事', icon: '🐱', completed: false, progress: 0, target: 6, reward: 500 },
  { id: 'ach6', name: '装修达人', description: '购买所有装饰品', icon: '🏠', completed: false, progress: 0, target: 12, reward: 800 },
  { id: 'ach7', name: '坚持不懈', description: '连续游玩7天', icon: '📅', completed: false, progress: 0, target: 7, reward: 400 },
  { id: 'ach8', name: '百万富翁', description: '累计获得10000金币', icon: '👑', completed: false, progress: 0, target: 10000, reward: 1000 },
];

export const dailyGoals: DailyGoal[] = [
  { id: 'goal1', description: '服务5位顾客', target: 5, current: 0, reward: 100, completed: false },
  { id: 'goal2', description: '制作10份甜点', target: 10, current: 0, reward: 150, completed: false },
  { id: 'goal3', description: '获得50金币小费', target: 50, current: 0, reward: 200, completed: false },
];

export const getInitialGameState = (saveId: string, playerName: string = '店长') => ({
  saveId,
  playerName,
  gold: 500,
  level: 1,
  dayCount: 1,
  difficulty: 'easy' as const,
  lastSave: Date.now(),
  stats: {
    totalCustomersServed: 0,
    totalEarnings: 0,
    dishesMade: 0,
    tipsEarned: 0,
    daysPlayed: 1,
  },
  orders: [],
  employees: [...initialEmployees],
  decorations: decorations.map(d => ({ ...d })),
  achievements: achievements.map(a => ({ ...a })),
  unlockedRecipes: ['donut_original', 'donut_chocolate', 'bubble_tea_milk', 'bubble_tea_pearl', 'pudding_original'],
  unlockedCustomers: ['cat1', 'cat2'],
  dailyGoals: dailyGoals.map(g => ({ ...g })),
  inventory: {
    flour: 50,
    sugar: 50,
    milk: 50,
    egg: 50,
    chocolate: 20,
    strawberry: 20,
    matcha: 10,
    cream: 30,
    tea: 30,
    pearl: 20,
    coconut: 20,
    puddingMix: 30,
  },
  stoveLevel: 1,
  coffeeMachineLevel: 1,
});
