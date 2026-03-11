export const DEFAULT_TASKS = [
  { id: 't1', title: 'Lavar a louça', description: 'Lavar e secar toda a louça', points: 10, icon: '🍽️', category: 'Cozinha', isRecurring: true },
  { id: 't2', title: 'Varrer a sala', description: 'Varrer e deixar a sala limpa', points: 15, icon: '🧹', category: 'Limpeza', isRecurring: true },
  { id: 't3', title: 'Limpar o banheiro', description: 'Limpar pia, vaso e chão', points: 25, icon: '🚿', category: 'Limpeza', isRecurring: true },
  { id: 't4', title: 'Passar pano no chão', description: 'Passar pano em todos os cômodos', points: 20, icon: '🪣', category: 'Limpeza', isRecurring: true },
  { id: 't5', title: 'Lavar roupas', description: 'Colocar roupa na máquina e estender', points: 20, icon: '👕', category: 'Lavanderia', isRecurring: true },
  { id: 't6', title: 'Dobrar roupas', description: 'Dobrar e guardar as roupas secas', points: 15, icon: '🧺', category: 'Lavanderia', isRecurring: true },
  { id: 't7', title: 'Fazer as compras', description: 'Ir ao mercado com a lista', points: 30, icon: '🛒', category: 'Compras', isRecurring: true },
  { id: 't8', title: 'Cozinhar o almoço', description: 'Preparar o almoço para a família', points: 35, icon: '🍳', category: 'Cozinha', isRecurring: true },
  { id: 't9', title: 'Cozinhar o jantar', description: 'Preparar o jantar para a família', points: 35, icon: '🍲', category: 'Cozinha', isRecurring: true },
  { id: 't10', title: 'Tirar o lixo', description: 'Recolher e levar o lixo para fora', points: 10, icon: '🗑️', category: 'Limpeza', isRecurring: true },
  { id: 't11', title: 'Organizar a geladeira', description: 'Limpar e organizar a geladeira', points: 20, icon: '❄️', category: 'Cozinha', isRecurring: false },
  { id: 't12', title: 'Limpar janelas', description: 'Limpar os vidros das janelas', points: 25, icon: '🪟', category: 'Limpeza', isRecurring: false },
  { id: 't13', title: 'Regar as plantas', description: 'Regar todas as plantas da casa', points: 10, icon: '🌿', category: 'Jardim', isRecurring: true },
  { id: 't14', title: 'Passear com o pet', description: 'Levar o bichinho para passear', points: 15, icon: '🐕', category: 'Pets', isRecurring: true },
  { id: 't15', title: 'Organizar quarto', description: 'Arrumar cama e organizar o quarto', points: 15, icon: '🛏️', category: 'Organização', isRecurring: true },
];

export const DEFAULT_REWARDS = [
  { id: 'r1', title: 'Escolher o filme da noite', description: 'Você escolhe o que a família vai assistir', cost: 50, icon: '🎬', groupId: 'g1', stock: -1 },
  { id: 'r2', title: 'Dia sem tarefas', description: 'Fique um dia inteiro sem fazer nenhuma tarefa', cost: 100, icon: '😴', groupId: 'g1', stock: -1 },
  { id: 'r3', title: 'Pedir pizza', description: 'A família pede pizza no jantar', cost: 150, icon: '🍕', groupId: 'g1', stock: -1 },
  { id: 'r4', title: 'Sobremesa especial', description: 'Ganhe uma sobremesa de sua escolha', cost: 80, icon: '🍰', groupId: 'g1', stock: -1 },
  { id: 'r5', title: 'Tempo extra de tela', description: '1 hora a mais de tela hoje', cost: 60, icon: '📱', groupId: 'g1', stock: -1 },
];

export const INITIAL_USERS = [
  { id: 'u1', name: 'Você', avatar: '🧑', points: 0, totalPoints: 0, groupId: 'g1', completedTaskIds: [], redeemedRewardIds: [] },
  { id: 'u2', name: 'Mãe', avatar: '👩', points: 340, totalPoints: 340, groupId: 'g1', completedTaskIds: [], redeemedRewardIds: [] },
  { id: 'u3', name: 'Pai', avatar: '👨', points: 210, totalPoints: 210, groupId: 'g1', completedTaskIds: [], redeemedRewardIds: [] },
  { id: 'u4', name: 'Irmã', avatar: '👧', points: 180, totalPoints: 180, groupId: 'g1', completedTaskIds: [], redeemedRewardIds: [] },
];

export const INITIAL_GROUP = {
  id: 'g1',
  name: 'Família Silva',
  code: 'FAM123',
  memberIds: ['u1', 'u2', 'u3', 'u4'],
};

export const AVATARS = ['🧑', '👩', '👨', '👧', '👦', '🧓', '👴', '👵', '🧒', '🦸', '🧙', '🧝', '🐱', '🐶', '🦊', '🐼', '🐨', '🦁'];
