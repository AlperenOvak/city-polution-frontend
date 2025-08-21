<template>
  <div class="w-full p-16">
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
            <div class="w-1/4 flex flex-col items-center space-y-4">
        <DatePicker />
        <MaButton 
          @click="handleCheck" 
          variant="primary"
          :loading="loading"
          :disabled="!settingStore.selectedCity || !settingStore.dateRange"
        >
          Check Pollution Data
        </MaButton>
        
        <!-- Error Display -->
        <div v-if="error" class="text-red-500 text-sm text-center max-w-xs p-3 bg-red-50 border border-red-200 rounded-md">
          <div class="font-medium mb-1">⚠️ Error</div>
          <div>{{ error }}</div>
        </div>
        
        <!-- Success Message -->
        <div v-if="pollutionData.length > 0 && !loading" class="text-green-600 text-sm text-center">
          ✅ Loaded {{ pollutionData.length }} days of data
        </div>
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
import {MaContentScroller, MaRadioCard, MaRadioGroup, MaButton, MaTypography} from "@mobileaction/action-kit";
import { useSettingStore } from './stores/settingStore';
import pollutionAPI from './services/pollutionAPI.js';
import { ref } from 'vue';

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
    HeatCalendar
  },
  setup() {
    const settingStore = useSettingStore();
    const loading = ref(false);
    const error = ref(null);
    const pollutionData = ref([]);
    
    const handleCheck = async () => {
      if (!settingStore.selectedCity || !settingStore.dateRange) {
        error.value = 'Please select a city and date range';
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        console.log('Fetching pollution data...');
        console.log('City ID:', settingStore.selectedCity);
        console.log('Date Range:', settingStore.dateRange);

        const data = await pollutionAPI.getHistoricData(
          settingStore.selectedCity,
          new Date(settingStore.dateRange[0]),
          new Date(settingStore.dateRange[1])
        );

        pollutionData.value = data;
        console.log('Pollution data fetched:', data);

        // Trigger HeatCalendar update
        window.dispatchEvent(new CustomEvent('pollutionDataUpdated', { 
          detail: data 
        }));

      } catch (err) {
        console.error('Failed to fetch pollution data:', err);
        
        // Check if it's a date range error and display it clearly
        error.value = `Failed to fetch data: ${err.message}`;
        
      } finally {
        loading.value = false;
      }
    };

    return {
      handleCheck,
      loading,
      error,
      pollutionData,
      settingStore
    };
  },
};
</script>

<style scoped>
</style>