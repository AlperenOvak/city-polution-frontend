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
        <MaButton @click="handleCheck" icon="check">
          <MaTypography tag="div" type="body-4" weight="semibold">
            Check Pollution
          </MaTypography>
        </MaButton>
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
    
    const handleCheck = () => {
      console.log('Check button clicked!');
      console.log('Selected date range:', settingStore.dateRange);
      console.log('Selected city:', settingStore.selectedCity);
      
      // Add your evaluation logic here
      // You can call APIs, validate inputs, etc.
    };

    return {
      handleCheck
    };
  },
};
</script>

<style scoped>
</style>