<script setup>
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import { onMounted, watch, ref, nextTick } from "vue";
import { useSettingStore } from '../stores/settingStore';

const settingStore = useSettingStore();
let cal = null;

const initializeCalendar = async () => {
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
    
    // Calculate number of days between start and end date
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const monthsToShow = Math.max(1, Math.ceil(daysDiff / 30));

    cal = new CalHeatmap();
    
    await cal.paint({
      itemSelector: "#heatmap",
      data: {
        source: [
          { date: startDate.toISOString().split('T')[0], value: 1 }, 
          { date: new Date(startDate.getTime() + 86400000).toISOString().split('T')[0], value: 2 }, 
          { date: new Date(startDate.getTime() + 172800000).toISOString().split('T')[0], value: 5 }, 
          { date: new Date(startDate.getTime() + 259200000).toISOString().split('T')[0], value: 3 }
        ],
        x: "date",
        y: "value",
      },
      date: { start: startDate },
      range: monthsToShow,
      domain: {
        type: "month",
        gutter: 4,
      },
      subDomain: {
        type: "day",
        width: 15,
        height: 15,
        radius: 2,
        label: "DD",
      },
      scale: {
        color: {
          range: ["#e5e7eb", "#2ce771ff", "#83cb43ff", "#debc4aff", "#e97a25ff", "#ef4444"], // gray → green → yellow → red
          type: "threshold",
          domain: [0, 1, 2, 3, 4, 5], 
        },
      },
    });
  } catch (error) {
    console.error('Error initializing calendar:', error);
  }
};

onMounted(() => {
  initializeCalendar();
});

// Watch for changes in date range and reinitialize calendar
watch(() => settingStore.dateRange, () => {
  setTimeout(() => {
    initializeCalendar();
  }, 100); // Small delay to avoid rapid updates
}, { deep: true });
</script>

<template>
  <div id="heatmap"></div>
</template>
