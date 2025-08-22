<template>
  <MaRadioGroup v-model:value="selectedValue"
                class="w-full overflow-x-auto"
  >
    <MaRadioCard 
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :text="option.text"
        :hint="option.hint"
    >
      <template #suffix>
        <div class="w-40">
          <img
            :src="option.img"
            :alt="`${option.text} city map`"
            class="w-full h-full object-cover rounded"
          />
        </div>
      </template>
    </MaRadioCard>
  </MaRadioGroup>
</template>

<script>
import { ref, computed } from 'vue';
import { MaRadioCard, MaRadioGroup } from '@mobileaction/action-kit';
import { useSettingStore } from '../stores/settingStore';

export default {
  name: 'CitySelector',
  components: {
    MaRadioCard,
    MaRadioGroup
  },
  setup() {
    const settingStore = useSettingStore();
    const selectedValue = computed({
      get: () => settingStore.getSelectedCity,
      set: (value) => settingStore.setSelectedCity(value)
    });
    const options = settingStore.getCityOptions;

    return {
      selectedValue,
      options,
    };
  },
};
</script>

<style scoped>
</style>