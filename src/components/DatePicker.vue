<template>
  <div>
    <MaDatePicker2 v-model="dateRange" label="Date Range" :range="true" />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
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

    watch(dateRange, (newRange) => {
      settingStore.setDateRange(newRange);
    });

    return {
      dateRange,
    };
  },
};
</script>

<style scoped>
</style>
