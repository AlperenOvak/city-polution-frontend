<template>
  <div>
    <MaDatePicker2 
      v-model="dateRange" 
      label="Date Range" 
      :range="true" 
      :minDate="minDate"
      :maxDate="maxDate"
    />
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';
import { MaDatePicker2 } from '@mobileaction/action-kit';
import { useSettingStore } from '../stores/settingStore';

export default {
  name: 'DatePicker',
  components: {
    MaDatePicker2,
  },
  setup() {
    const settingStore = useSettingStore();
    const dateRange = ref(settingStore.dateRange);

    // Date constraints: between 2020 and today
    const minDate = computed(() => new Date('2020-11-27'));
    const maxDate = computed(() => new Date());

    watch(dateRange, (newRange) => {
      settingStore.setDateRange(newRange);
    });

    return {
      dateRange,
      minDate,
      maxDate,
    };
  },
};
</script>

<style scoped>
</style>
