<script setup>
import "cal-heatmap/cal-heatmap.css";
import { onMounted, onUnmounted, ref } from "vue";
import { useSettingStore } from '../stores/settingStore';
import { MaButton } from '@mobileaction/action-kit';
import PollutionCard from './PollutionCard.vue';
import { useHeatCalendar } from '../composables/useHeatCalendar';
import { usePollutionModal } from '../composables/usePollutionModal';

const settingStore = useSettingStore();
const pollutionData = ref([]);

// Use composables
const {
  showNavigation,
  initializeCalendar,
  destroyCalendar,
  goToPrevious,
  goToNext
} = useHeatCalendar(settingStore, pollutionData);

const {
  modalVisible,
  selectedDayData,
  handleDayClick
} = usePollutionModal(pollutionData);

// Handle pollution data updates
const handlePollutionDataUpdate = (event) => {
  pollutionData.value = event.detail;
  initializeCalendar(handleDayClick); // Reinitialize with updated data
};

onMounted(() => {
  initializeCalendar(handleDayClick);
  // Listen for pollution data updates
  window.addEventListener('pollutionDataUpdated', handlePollutionDataUpdate);
});

onUnmounted(() => {
  // Cleanup
  destroyCalendar();
  window.removeEventListener('pollutionDataUpdated', handlePollutionDataUpdate);
});

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
    
    <!-- Pollution Card Modal -->
    <PollutionCard 
      v-model:visible="modalVisible"
      :selectedDayData="selectedDayData"
    />
  </div>
</template>
