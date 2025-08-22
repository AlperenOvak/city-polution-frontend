/**
 * API service for pollution data
 */

import { POLLUTION_LEVELS, getPollutionLevelInfo } from '../utils/pollutionLevels';
import { useSettingStore } from '../stores/settingStore';

const API_BASE_URL = '/api';

class PollutionAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Format date to DD-MM-YYYY format for your API
   * @param {Date} date 
   * @returns {string} Formatted date
   */
  formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Parse DD-MM-YYYY date to Date object
   * @param {string} dateString 
   * @returns {Date}
   */
  parseDate(dateString) {
    const [day, month, year] = dateString.split('-');
    return new Date(year, month - 1, day);
  }

  /**
   * Get city name by ID
   * @param {number} cityId 
   * @returns {string}
   */
  getCityName(cityId) {
    const settingStore = useSettingStore();
    const city = settingStore.cityOptions.find(option => option.value === cityId);
    return city ? city.text : 'Ankara'; // Default fallback
  }

  /**
   * Calculate overall pollution level from categories
   * @param {Array} categories 
   * @returns {Object}
   */
    analyzePollution(categories) {
        const pollutants = { ...categories }; // clone object
        const pollutantValues = {};

        // Create level map from centralized POLLUTION_LEVELS
        const levelMap = {};
        Object.values(POLLUTION_LEVELS).forEach(level => {
          levelMap[level.name] = level.value;
        });
    
        // Assign numeric values to each pollutant
        Object.keys(pollutants).forEach(pollutant => {
          pollutantValues[pollutant] = levelMap[pollutants[pollutant]] || 0;
        });
    
        // Calculate average value
        const values = Object.values(pollutantValues);
        const averageValue = Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);

        // Get overall level using centralized function
        const overallLevel = getPollutionLevelInfo(averageValue).name;

    return { overallLevel, averageValue, pollutants: pollutantValues };
    }

  /**
   * Fetch historic pollution data
   * @param {number} cityId 
   * @param {Date} startDate 
   * @param {Date} endDate 
   * @returns {Promise<Array>}
   */
  async getHistoricData(cityId, startDate, endDate) {
    const city = this.getCityName(cityId);
    const start = this.formatDate(startDate);
    const end = this.formatDate(endDate);

    const url = `${this.baseURL}/pollution?city=${city}&startDate=${start}&endDate=${end}`;
    
    try {
      console.log('Making request to:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        // Try to extract error message from response body
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // If we can't parse the error response, use the default message
          console.warn('Could not parse error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Transform your API response format
      const transformedData = data.results?.map(dayData => {
        const date = this.parseDate(dayData.date);
        const analysis = this.analyzePollution(dayData.categories);
        console.log('Transformed data for date:', date, analysis.overallLevel, analysis.averageValue);
        return {
          date: date,
          dateString: dayData.date,
          cityName: data.city,
          pollutionLevel: analysis.overallLevel,
          value: analysis.averageValue, // For heat calendar
          pollutants: analysis.pollutants,
          // For cal-heatmap format
          calendarData: {
            date: date.toISOString().split('T')[0], // YYYY-MM-DD format
            value: analysis.averageValue
          }
        };
      }) || [];

      return transformedData;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const pollutionAPI = new PollutionAPI();
export default pollutionAPI;
