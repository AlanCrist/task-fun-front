const STORAGE_KEY = 'tarefas_mock_db';
const TOKEN_KEY = 'tarefas_token';
const MOCK_TOKEN = 'mock-token-beta';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function now() {
  return new Date().toISOString();
}

// --- Seed data -----------------------------------------------------------

const SEED = {
  users: [
    { id: 'u1', name: 'Ana', email: 'ana@demo.com', password: 'demo', avatar: '👩', points: 120, totalPoints: 450, groupId: 'g1' },
    { id: 'u2', name: 'Bruno', email: 'bruno@demo.com', password: 'demo', avatar: '👨', points: 85, totalPoints: 320, groupId: 'g1' },
  ],
  groups: [
    { id: 'g1', name: 'Casa Silva', code: 'SILVA1', members: [] },
  ],
  tasks: [
    { id: 't1', title: 'Lavar a louça', description: 'Lavar e secar toda a louça', points: 10, icon: '🍽️', category: 'Cozinha', isRecurring: true, groupId: 'g1' },
    { id: 't2', title: 'Aspirar a sala', description: 'Aspirar toda a sala de estar', points: 15, icon: '🧹', category: 'Limpeza', isRecurring: true, groupId: 'g1' },
    { id: 't3', title: 'Levar o lixo', description: 'Levar o lixo para fora', points: 5, icon: '🗑️', category: 'Casa', isRecurring: true, groupId: 'g1' },
    { id: 't4', title: 'Limpar o banheiro', description: 'Limpeza completa do banheiro', points: 20, icon: '🚿', category: 'Limpeza', isRecurring: true, groupId: 'g1' },
    { id: 't5', title: 'Organizar o quarto', description: 'Arrumar a cama e organizar objetos', points: 10, icon: '🛏️', category: 'Quarto', isRecurring: true, groupId: 'g1' },
    { id: 't6', title: 'Cozinhar o jantar', description: 'Preparar o jantar para a família', points: 25, icon: '🍳', category: 'Cozinha', isRecurring: true, groupId: 'g1' },
  ],
  rewards: [
    { id: 'r1', title: 'Escolher o filme', description: 'Escolher o filme da noite', cost: 30, icon: '🎬', groupId: 'g1', stock: -1 },
    { id: 'r2', title: 'Dia sem tarefas', description: 'Um dia livre de tarefas', cost: 50, icon: '😴', groupId: 'g1', stock: -1 },
    { id: 'r3', title: 'Sobremesa especial', description: 'Ganhar uma sobremesa à escolha', cost: 20, icon: '🍰', groupId: 'g1', stock: 3 },
  ],
  completions: [],
  redemptions: [],
};

// --- DB helpers -----------------------------------------------------------

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }

  const db = JSON.parse(JSON.stringify(SEED));
  db.groups[0].members = db.users.map(u => ({ id: u.id, name: u.name, avatar: u.avatar, points: u.points, totalPoints: u.totalPoints }));
  saveDb(db);
  return db;
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function currentUserId() {
  return localStorage.getItem('tarefas_mock_uid') || 'u1';
}

function delay(ms = 100) {
  return new Promise(r => setTimeout(r, ms));
}

function userToPublic(u) {
  const { password: _, email: __, ...rest } = u;
  return rest;
}

// --- Token ----------------------------------------------------------------

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('tarefas_mock_uid');
}

// --- Auth -----------------------------------------------------------------

export async function login(email, password) {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Email ou senha inválidos');
  localStorage.setItem('tarefas_mock_uid', user.id);
  return { token: MOCK_TOKEN, user: userToPublic(user) };
}

export async function register(name, email, password, avatar) {
  await delay();
  const db = loadDb();
  if (db.users.find(u => u.email === email)) throw new Error('Email já cadastrado');
  const user = { id: uid(), name, email, password, avatar: avatar || '😊', points: 0, totalPoints: 0, groupId: null };
  db.users.push(user);
  saveDb(db);
  localStorage.setItem('tarefas_mock_uid', user.id);
  return { token: MOCK_TOKEN, user: userToPublic(user) };
}

// --- Users ----------------------------------------------------------------

export async function getMe() {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  if (!user) throw new Error('Usuário não encontrado');
  return userToPublic(user);
}

export async function updateProfile(name, avatar) {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  if (!user) throw new Error('Usuário não encontrado');
  user.name = name;
  user.avatar = avatar;
  const group = db.groups.find(g => g.id === user.groupId);
  if (group) {
    const member = group.members.find(m => m.id === user.id);
    if (member) { member.name = name; member.avatar = avatar; }
  }
  saveDb(db);
  return userToPublic(user);
}

// --- Groups ---------------------------------------------------------------

export async function getMyGroup() {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  const group = db.groups.find(g => g.id === user?.groupId);
  if (!group) throw new Error('Sem grupo');
  return { ...group, memberIds: group.members.map(m => m.id) };
}

export async function createGroup(name) {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  const members = [{ id: user.id, name: user.name, avatar: user.avatar, points: user.points, totalPoints: user.totalPoints }];
  const group = { id: uid(), name, code: uid().toUpperCase().slice(0, 6), members };
  db.groups.push(group);
  user.groupId = group.id;
  saveDb(db);
  return { ...group, memberIds: members.map(m => m.id) };
}

export async function joinGroup(code) {
  await delay();
  const db = loadDb();
  const group = db.groups.find(g => g.code === code);
  if (!group) throw new Error('Grupo não encontrado');
  const user = db.users.find(u => u.id === currentUserId());
  user.groupId = group.id;
  if (!group.members.find(m => m.id === user.id)) {
    group.members.push({ id: user.id, name: user.name, avatar: user.avatar, points: user.points, totalPoints: user.totalPoints });
  }
  saveDb(db);
  return { ...group, memberIds: group.members.map(m => m.id) };
}

export async function updateGroupName(name) {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  const group = db.groups.find(g => g.id === user?.groupId);
  if (!group) throw new Error('Sem grupo');
  group.name = name;
  saveDb(db);
  return { name: group.name };
}

export async function leaveGroup() {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  const group = db.groups.find(g => g.id === user?.groupId);
  if (group) {
    group.members = group.members.filter(m => m.id !== user.id);
  }
  user.groupId = null;
  saveDb(db);
}

export async function getRanking(groupId) {
  await delay();
  const db = loadDb();
  const group = db.groups.find(g => g.id === groupId);
  if (!group) return [];
  return [...group.members].sort((a, b) => b.totalPoints - a.totalPoints);
}

// --- Tasks ----------------------------------------------------------------

export async function getTasks() {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  return db.tasks.filter(t => t.groupId === user?.groupId || !t.groupId);
}

export async function createTask(data) {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  const task = { id: uid(), ...data, groupId: user?.groupId };
  db.tasks.push(task);
  saveDb(db);
  return task;
}

export async function deleteTask(id) {
  await delay();
  const db = loadDb();
  db.tasks = db.tasks.filter(t => t.id !== id);
  saveDb(db);
}

// --- Rewards --------------------------------------------------------------

export async function getRewards() {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  return db.rewards.filter(r => r.groupId === user?.groupId);
}

export async function createReward(data) {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  const reward = { id: uid(), ...data, groupId: user?.groupId };
  db.rewards.push(reward);
  saveDb(db);
  return reward;
}

export async function deleteReward(id) {
  await delay();
  const db = loadDb();
  db.rewards = db.rewards.filter(r => r.id !== id);
  saveDb(db);
}

// --- Completions ----------------------------------------------------------

export async function completeTask(taskId) {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  const task = db.tasks.find(t => t.id === taskId);
  if (!task) throw new Error('Tarefa não encontrada');

  user.points += task.points;
  user.totalPoints += task.points;

  const completion = { id: uid(), taskId, userId: user.id, groupId: user.groupId, completedAt: now(), pointsEarned: task.points };
  db.completions.unshift(completion);

  const group = db.groups.find(g => g.id === user.groupId);
  if (group) {
    const member = group.members.find(m => m.id === user.id);
    if (member) { member.points = user.points; member.totalPoints = user.totalPoints; }
  }

  saveDb(db);
  return { completion, user: userToPublic(user) };
}

export async function getGroupCompletions(limit = 50) {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  return db.completions
    .filter(c => c.groupId === user?.groupId)
    .slice(0, limit)
    .map(c => {
      const task = db.tasks.find(t => t.id === c.taskId);
      const u = db.users.find(u2 => u2.id === c.userId);
      return { ...c, task, user: u ? userToPublic(u) : null };
    });
}

export async function getMyCompletions(limit = 50) {
  await delay();
  const db = loadDb();
  return db.completions
    .filter(c => c.userId === currentUserId())
    .slice(0, limit);
}

// --- Redemptions ----------------------------------------------------------

export async function redeemReward(rewardId) {
  await delay();
  const db = loadDb();
  const user = db.users.find(u => u.id === currentUserId());
  const reward = db.rewards.find(r => r.id === rewardId);
  if (!reward) throw new Error('Recompensa não encontrada');
  if (user.points < reward.cost) throw new Error('Pontos insuficientes');
  if (reward.stock === 0) throw new Error('Recompensa esgotada');

  user.points -= reward.cost;
  if (reward.stock > 0) reward.stock--;

  const redemption = { id: uid(), rewardId, userId: user.id, redeemedAt: now() };
  db.redemptions.unshift(redemption);

  const group = db.groups.find(g => g.id === user.groupId);
  if (group) {
    const member = group.members.find(m => m.id === user.id);
    if (member) { member.points = user.points; }
  }

  saveDb(db);
  return { redemption, user: userToPublic(user) };
}

export async function getRedemptions(limit = 50) {
  await delay();
  const db = loadDb();
  return db.redemptions
    .filter(r => r.userId === currentUserId())
    .slice(0, limit)
    .map(r => {
      const reward = db.rewards.find(rw => rw.id === r.rewardId);
      return { ...r, reward };
    });
}
