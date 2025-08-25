import { computed, nextTick } from 'vue';
import CalHeatmap from 'cal-heatmap';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import dayjs from 'dayjs';
import { 
  getPollutionColorRange,
  getPollutionThresholds 
} from '../utils/pollutionLevels';

export function useHeatCalendar(settingStore, pollutionData) {
  // Calendar instance
  let calendar = null;

  // Computed Properties
  const dateRange = computed(() => settingStore.dateRange);

  const calendarConfig = computed(() => {
    if (!dateRange.value?.[0] || !dateRange.value?.[1]) return null;

    const startDate = new Date(dateRange.value[0]);
    const endDate = new Date(dateRange.value[1]);
    const monthsDiff = calculateMonthsDiff(startDate, endDate);
    const viewConfig = getCalendarViewConfig(startDate, endDate, monthsDiff);
    
    return {
      startDate,
      endDate,
      monthsDiff,
      ...viewConfig
    };
  });

  const showNavigation = computed(() => {
    if (!calendarConfig.value) return false;
    return calendarConfig.value.range > 1 || calendarConfig.value.monthsDiff > 2;
  });

  const calendarData = computed(() => {
    if (!calendarConfig.value) return [];
    
    return (pollutionData.value.length > 0) 
      ? pollutionData.value.map(item => item.calendarData)
      : generateSampleData(calendarConfig.value.startDate);
  });

  // Utility Functions
  const calculateMonthsDiff = (startDate, endDate) => {
    return (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
           (endDate.getMonth() - startDate.getMonth());
  };

  const getCalendarViewConfig = (startDate, endDate, monthsDiff) => {
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      // Same month - show single month view
      return { domainType: "month", subDomainType: "day", range: 1 };
    } else if (monthsDiff <= 4) {
      // Less than or equal to 4 months - show month view
      return { domainType: "month", subDomainType: "day", range: monthsDiff + 1 };
    } else {
      // More than 4 months - show year view
      return { domainType: "year", subDomainType: "day", range: 1 };
    }
  };

  const generateSampleData = (startDate) => {
    const sampleValues = [1, 1, 2, 3, 4, 5];
    return sampleValues.map((value, index) => ({
      date: new Date(startDate.getTime() + (index * 86400000)).toISOString().split('T')[0],
      value
    }));
  };

  const createTooltipConfig = () => ({
    text: function (date, value, dayjsDate) {
      const dateString = dayjsDate.format('YYYY-MM-DD');
      const dayInfo = pollutionData.value.find(item => item.calendarData.date === dateString);
      
      if (dayInfo) {
        let tooltipText = `📅 ${dayInfo.dateString}\n🏙️ ${dayInfo.cityName}\n🌍`;
        
        if (dayInfo.pollutants) {
          Object.entries(dayInfo.pollutants).forEach(([pollutant, pollutantValue]) => {
            tooltipText += `\n• ${pollutant.toUpperCase()}: ${pollutantValue}`;
          });
        }
        
        return tooltipText;
      }
      
      return `📅 ${dayjsDate.format('MMM DD, YYYY')}\n📊 Value: ${value || 'No data'}`;
    }
  });

  const createCalendarLabelConfig = () => ({
    width: 30,
    textAlign: 'start',
    text: () => dayjs.weekdaysShort().map((d, i) => (i % 2 == 0 ? '' : d))
  });

  // Calendar Management
  const initializeCalendar = async (onDayClick) => {
    try {
      if (!calendarConfig.value) return;

      // Clear existing calendar if it exists
      if (calendar) {
        try {
          calendar.destroy();
        } catch (e) {
          console.warn('Error destroying calendar:', e);
        }
        calendar = null;
      }

      // Wait for DOM to be ready
      await nextTick();

      const config = calendarConfig.value;
      calendar = new CalHeatmap();

      await calendar.paint(
          {
            itemSelector: "#heatmap",
            data: {
              source: calendarData.value,
              x: "date",
              y: "value",
            },
            date: { start: config.startDate },
            range: config.range,
            domain: {
              type: config.domainType,
              gutter: 4,
            },
            subDomain: {
              type: config.subDomainType,
              width: config.domainType === "year" ? 15 : 25,
              height: config.domainType === "year" ? 15 : 25,
              radius: 2,
              label: config.domainType === "year" ? null : "DD",
            },
            scale: {
              color: {
                range: getPollutionColorRange(),
                type: "threshold",
                domain: getPollutionThresholds(),
              },
            },
          },
          [
            [Tooltip, createTooltipConfig()],
            [CalendarLabel, createCalendarLabelConfig()]
          ]
      );
      
      // Add click event handler after calendar is created
      if (onDayClick) {
        calendar.on('click', onDayClick);
      }

    } catch (error) {
      console.error('Error initializing calendar:', error);
    }
  };

  // Navigation functions
  const goToPrevious = () => {
    if (calendar) {
      calendar.previous();
    }
  };

  const goToNext = () => {
    if (calendar) {
      calendar.next();
    }
  };

  const destroyCalendar = () => {
    if (calendar) {
      try {
        calendar.destroy();
      } catch (e) {
        console.warn('Error destroying calendar:', e);
      }
      calendar = null;
    }
  };

  return {
    // Computed properties
    calendarConfig,
    showNavigation,
    calendarData,
    
    // Functions
    initializeCalendar,
    destroyCalendar,
    goToPrevious,
    goToNext,
    
    // Calendar instance (for advanced usage)
    getCalendar: () => calendar
  };
}
