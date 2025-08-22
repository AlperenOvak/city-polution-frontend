/**
 * Pollution Level Enum and Utilities
 * Centralized pollution level definitions with consistent colors and classifications
 */

export const POLLUTION_LEVELS = {
  GOOD: {
    value: 1,
    name: 'Good',
    color: '#3be72cff',
    textClass: 'text-green-500',
    bgClass: 'bg-green-500',
    description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.'
  },
  SATISFACTORY: {
    value: 2,
    name: 'Satisfactory',
    color: '#83cb43ff',
    textClass: 'text-green-400',
    bgClass: 'bg-green-400',
    description: 'Air quality is acceptable for most people. However, sensitive people may experience minor respiratory symptoms.'
  },
  POOR: {
    value: 3,
    name: 'Poor',
    color: '#debc4aff',
    textClass: 'text-yellow-500',
    bgClass: 'bg-yellow-500',
    description: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.'
  },
  MODERATE: {
    value: 4,
    name: 'Moderate',
    color: '#e97a25ff',
    textClass: 'text-orange-500',
    bgClass: 'bg-orange-500',
    description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.'
  },
  SEVERE: {
    value: 5,
    name: 'Severe',
    color: '#cf1b1b',
    textClass: 'text-red-500',
    bgClass: 'bg-red-500',
    description: 'Health warnings of emergency conditions. The entire population is more likely to be affected.'
  },
  HAZARDOUS: {
    value: 6,
    name: 'Hazardous',
    color: '#880000',
    textClass: 'text-red-800',
    bgClass: 'bg-red-800',
    description: 'Health alert: everyone may experience more serious health effects.'
  }
};

/**
 * Get pollution level info based on numeric value
 * @param {number|string} value - The pollution value
 * @returns {Object} Pollution level info with name, color, classes, etc.
 */
export const getPollutionLevelInfo = (value) => {
  const numValue = parseFloat(value);
  
  if (numValue <= 1) return POLLUTION_LEVELS.GOOD;
  if (numValue <= 2) return POLLUTION_LEVELS.SATISFACTORY;
  if (numValue <= 3) return POLLUTION_LEVELS.POOR;
  if (numValue <= 4) return POLLUTION_LEVELS.MODERATE;
  if (numValue <= 5) return POLLUTION_LEVELS.SEVERE;
  return POLLUTION_LEVELS.HAZARDOUS;
};

/**
 * Get pollution level info based on level name
 * @param {string} levelName - The pollution level name
 * @returns {Object|null} Pollution level info or null if not found
 */
export const getPollutionLevelByName = (levelName) => {
  return Object.values(POLLUTION_LEVELS).find(level => 
    level.name.toLowerCase() === levelName.toLowerCase()
  ) || null;
};

/**
 * Get all pollution level colors for calendar heat map
 * @returns {Array<string>} Array of color hex values
 */
export const getPollutionColorRange = () => {
  return [
    '#e5e7eb', // Gray for no data
    POLLUTION_LEVELS.GOOD.color,
    POLLUTION_LEVELS.SATISFACTORY.color,
    POLLUTION_LEVELS.POOR.color,
    POLLUTION_LEVELS.MODERATE.color,
    POLLUTION_LEVELS.SEVERE.color,
    POLLUTION_LEVELS.HAZARDOUS.color,
  ];
};

/**
 * Get pollution level thresholds for calendar scale
 * @returns {Array<number>} Array of threshold values
 */
export const getPollutionThresholds = () => {
  return [1, 2, 3, 4, 5, 6, 7];
};

/**
 * Get pollution level class for backward compatibility
 * @param {number|string} value - The pollution value
 * @returns {string} CSS class for text color
 */
export const getPollutionLevelClass = (value) => {
  return getPollutionLevelInfo(value).textClass;
};
