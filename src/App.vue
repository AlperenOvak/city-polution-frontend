<template>
  <div class="w-full p-16">
    <!-- Header Section -->
      <div class="flex items-center justify-center space-x-4 mb-8">
        <!-- Animated Rocket -->
        <MaAnimation
          type="bounce"
          :duration="2000"
          :infinite="true"
          class="h-36"
        >
        </MaAnimation>
        
        <!-- App Title -->
        <MaTypography 
          type="heading-3" 
          weight="bold"
        >
          City Pollution
        </MaTypography>
        
        <!-- Another Animated Rocket -->
        <MaAnimation
          type="bounce"
          :duration="2000"
          :delay="500"
          :infinite="true"
          class="h-36"
        >
        </MaAnimation>
      </div>

    <!-- Title Row -->
    <div class="flex items-center space-x-4 mb-6">
      <div class="w-1/4 flex justify-center">
        <MaTypography tag="div" type="heading-6" weight="semibold">
          Select Date Range
        </MaTypography>
      </div>
      <div class="w-3/4 flex justify-center">
        <MaTypography tag="div" type="heading-6" weight="semibold">
          Choose City
        </MaTypography>
      </div>
    </div>

    <!-- Components Row -->
    <div class="w-full flex items-center space-x-4">
      <div class="w-1/4 flex flex-col items-center">
        <DatePicker />
      </div>
      <div class="w-3/4 flex items-center">
        <CitySelector />
      </div>
    </div>
    <!-- Heat Calendar -->
    <div class="w-full flex justify-center mt-8">
      <HeatCalendar />
    </div>
  </div>
</template>

<script>
import DatePicker from './components/DatePicker.vue';
import CitySelector from './components/CitySelector.vue';
import HeatCalendar from './components/HeatCalendar.vue';
import {
  MaContentScroller,
  MaRadioCard,
  MaRadioGroup,
  MaButton,
  MaTypography,
  MaNotification,
  MaAnimation
} from "@mobileaction/action-kit";
import { useSettingStore } from './stores/settingStore';
import pollutionAPI from './services/pollutionAPI.js';
import { ref, watch, onMounted } from 'vue';

export default {
  name: 'App',
  components: {
    DatePicker,
    MaContentScroller,
    MaRadioCard,
    MaRadioGroup,
    MaButton,
    MaTypography,
    CitySelector,
    MaNotification,
    MaAnimation,
    HeatCalendar
  },
  setup() {
    const settingStore = useSettingStore();
    const loading = ref(false);
    const pollutionData = ref([]);
    
    const handleCheck = async () => {
      if (!settingStore.selectedCity || !settingStore.dateRange) {
        return; // Silently return if data is not ready
      }

      loading.value = true;

      try {
        const data = await pollutionAPI.getHistoricData(
          settingStore.selectedCity,
          new Date(settingStore.dateRange[0]),
          new Date(settingStore.dateRange[1])
        );

        pollutionData.value = data;

        // Trigger HeatCalendar update
        window.dispatchEvent(new CustomEvent('pollutionDataUpdated', { 
          detail: data 
        }));

      } catch (err) {
        MaNotification.error(
            {"size":"large",
              "variant":"filled",
              "title":"Failed to fetch data",
              "description":err.message
            }
        )
        
      } finally {
        loading.value = false;
      }
    };

    // Watch for changes in selectedCity and dateRange
    watch(
      () => settingStore.selectedCity,
      () => {
        handleCheck();
      }
    );

    watch(
      () => settingStore.dateRange,
      () => {
        handleCheck();
      },
      { deep: true }
    );

    // Initial data load
    onMounted(() => {
      handleCheck();
    });

    return {
      loading,
      pollutionData,
      settingStore
    };
  },
};
</script>

<style scoped>
</style>