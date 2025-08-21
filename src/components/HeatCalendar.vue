<script setup>
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import { onMounted, onUnmounted, watch, ref, nextTick } from "vue";
import { useSettingStore } from '../stores/settingStore';
import { MaButton } from '@mobileaction/action-kit';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import Legend from 'cal-heatmap/plugins/Legend';
import Tooltip from 'cal-heatmap/plugins/Tooltip';

const settingStore = useSettingStore();
let cal = null;
const pollutionData = ref([]);
const showNavigation = ref(false);

// Navigation functions
const goToPrevious = () => {
  if (cal) {
    cal.previous();
  }
};

const goToNext = () => {
  if (cal) {
    cal.next();
  }
};

const initializeCalendar = async (useActualData = false) => {
  try {
    const dateRange = settingStore.dateRange;
    
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return; // Don't initialize if no date range selected
    }

    // Clear existing calendar if it exists
    if (cal) {
      try {
        cal.destroy();
      } catch (e) {
        console.warn('Error destroying calendar:', e);
      }
      cal = null;
    }

    // Wait for DOM to be ready
    await nextTick();

    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);
    
    // Calculate number of days and months between start and end date
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                       (endDate.getMonth() - startDate.getMonth());
    
    // Determine the view type and range
    let domainType, subDomainType, range;
    
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      // Same month - show single month view
      domainType = "month";
      subDomainType = "day";
      range = 1;
    } else if (monthsDiff <= 2) {
      // Less than or equal to 2 months - show month view
      domainType = "month";
      subDomainType = "day";
      range = monthsDiff + 1;
    } else {
      // More than 2 months - show year view
      domainType = "year";
      subDomainType = "day";
      range = 1;
    }

    // Show navigation for multi-year views or large date ranges
    showNavigation.value = range > 1 || monthsDiff > 2;

    // Use actual pollution data if available, otherwise use sample data
    let calendarData;
    if (useActualData && pollutionData.value.length > 0) {
      calendarData = pollutionData.value.map(item => item.calendarData);
      console.log('Using actual pollution data for calendar:', calendarData);
    } else {
      // Sample data
      calendarData = [
        { date: startDate.toISOString().split('T')[0], value: 1 }, 
        { date: new Date(startDate.getTime() + 86400000).toISOString().split('T')[0], value: 2 }, 
        { date: new Date(startDate.getTime() + 172800000).toISOString().split('T')[0], value: 5 }, 
        { date: new Date(startDate.getTime() + 259200000).toISOString().split('T')[0], value: 3 }
      ];
    }

    cal = new CalHeatmap();

        await cal.paint(
        {
          itemSelector: "#heatmap",
          data: {
            source: calendarData,
            x: "date",
            y: "value",
          },
          date: { start: startDate },
          range: range,
          domain: {
            type: domainType,
            gutter: 4,
          },
          subDomain: {
            type: subDomainType,
            width: domainType === "year" ? 15 : 25,
            height: domainType === "year" ? 15 : 25,
            radius: 2,
            label: domainType === "year" ? null : "DD",
          },
          scale: {
            color: {
              range: ["#e5e7eb", "#2ce771ff", "#83cb43ff", "#debc4aff", "#e97a25ff", "#ef4444"], // gray → green → yellow → red
              type: "threshold",
              domain: [0, 1, 2, 3, 4, 5], 
            },
          },
        },
        [
            [
              Tooltip,
              {
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
                },
              },
            ],
            [
                CalendarLabel,
                {
                width: 30,
                textAlign: 'start',
                text: () => dayjs.weekdaysShort().map((d, i) => (i % 2 == 0 ? '' : d)),
                },
            ]
        ]
    );
  } catch (error) {
    console.error('Error initializing calendar:', error);
  }
};

// Handle pollution data updates
const handlePollutionDataUpdate = (event) => {
  pollutionData.value = event.detail;
  console.log('Received pollution data update:', pollutionData.value);
  initializeCalendar(true); // Reinitialize with actual data
};

onMounted(() => {
  initializeCalendar();
  // Listen for pollution data updates
  window.addEventListener('pollutionDataUpdated', handlePollutionDataUpdate);
});

onUnmounted(() => {
  // Cleanup
  if (cal) {
    try {
      cal.destroy();
    } catch (e) {
      console.warn('Error destroying calendar on unmount:', e);
    }
  }
  window.removeEventListener('pollutionDataUpdated', handlePollutionDataUpdate);
});

// Watch for changes in date range and reinitialize calendar
watch(() => settingStore.dateRange, () => {
  setTimeout(() => {
    initializeCalendar();
  }, 100); // Small delay to avoid rapid updates
}, { deep: true });
</script>

<template>
  <div class="calendar-container">
    <div id="heatmap" class="mb-4"></div>
    
    <!-- Navigation buttons for multi-year or large date ranges -->
    <div v-if="showNavigation" class="flex justify-center space-x-2 mt-4">
      <MaButton 
        @click="goToPrevious"
        variant="primary"
        size="medium"
      >
        ←
      </MaButton>
      <MaButton 
        @click="goToNext"
        variant="primary"
        size="medium"
      >
        →
      </MaButton>
    </div>
  </div>
</template>
