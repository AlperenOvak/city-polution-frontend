<template>
  <div>
    <MaDatePicker2 
      v-model="dateRange" 
      label="Date Range" 
      range
      :minDate="minDate"
      :maxDate="maxDate"
      @update:value="handleDateChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MaDatePicker2 } from '@mobileaction/action-kit';
import { useSettingStore } from '../stores/settingStore';

const settingStore = useSettingStore();
const dateRange = ref(settingStore.dateRange);

// Date constraints: between 2020 and today
const minDate = new Date('2020-11-27');
const maxDate = new Date();

const handleDateChange = (newRange) => {
  settingStore.setDateRange(newRange);
};
</script>

<style scoped>
</style>
