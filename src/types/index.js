// Types documentados como JSDoc para referência

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} avatar - emoji avatar
 * @property {number} points - pontos disponíveis
 * @property {number} totalPoints - total histórico de pontos
 * @property {string} groupId
 * @property {string[]} completedTaskIds
 * @property {string[]} redeemedRewardIds
 */

/**
 * @typedef {Object} Group
 * @property {string} id
 * @property {string} name
 * @property {string} code - código para entrar no grupo
 * @property {string[]} memberIds
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} points
 * @property {string} icon - emoji
 * @property {string} category
 * @property {boolean} isRecurring - se a tarefa pode ser feita várias vezes
 */

/**
 * @typedef {Object} TaskCompletion
 * @property {string} id
 * @property {string} taskId
 * @property {string} userId
 * @property {string} groupId
 * @property {Date} completedAt
 * @property {number} pointsEarned
 */

/**
 * @typedef {Object} Reward
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} cost
 * @property {string} icon - emoji
 * @property {string} groupId
 * @property {number} stock - -1 = ilimitado
 */

/**
 * @typedef {Object} Redemption
 * @property {string} id
 * @property {string} rewardId
 * @property {string} userId
 * @property {Date} redeemedAt
 */
