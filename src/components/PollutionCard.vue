<script setup>
import { computed } from 'vue';
import { MaModal, MaTypography } from '@mobileaction/action-kit';
import { useSettingStore } from '../stores/settingStore';
import { 
  getPollutionLevelInfo, 
  getPollutionLevelByName
} from '../utils/pollutionLevels';

const settingStore = useSettingStore();

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  selectedDayData: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['update:visible']);

// Computed property for modal visibility
const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  }
});
</script>

<template>
  <!-- Modal for pollution data -->
  <MaModal
    closable
    v-model:visible="modalVisible"
    :bodyTitle="selectedDayData?.formattedDate || 'Pollution Data'"
  > 
    <template #content>
      <div v-if="selectedDayData" class="space-y-4">
        <div v-if="selectedDayData.dayData" class="space-y-4">
          <!-- Basic Information -->
          <div 
            class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative overflow-hidden"
            :style="selectedDayData.dayData ? {
              backgroundImage: `url(${settingStore.cityOptions.find(city => city.value === settingStore.selectedCity)?.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            } : {}"
          >
            <!-- Semi-transparent overlay -->
            <div class="absolute inset-0 bg-gray-50 bg-opacity-80 rounded-lg"></div>
            
            <div class="relative z-10">
              <MaTypography tag="div" type="body-2" weight="medium" class="text-gray-700">
                City:
              </MaTypography>
              <MaTypography tag="div" type="body-1" weight="semibold">
                {{ selectedDayData.dayData.cityName }}
              </MaTypography>
            </div>
            <div class="relative z-10">
              <MaTypography tag="div" type="body-2" weight="medium" class="text-gray-700">
                Date:
              </MaTypography>
              <MaTypography tag="div" type="body-1" weight="semibold">
                {{ selectedDayData.dateString }}
              </MaTypography>
            </div>
          </div>
          
          <!-- Pollution Level and Value -->
          <div 
            class="gap-4 p-4 bg-gray-50 rounded-lg relative overflow-hidden"
            :style="selectedDayData.dayData ? {
              backgroundImage: `url(${settingStore.cityOptions.find(city => city.value === settingStore.selectedCity)?.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            } : {}"
          >
            <!-- Color overlay based on pollution level -->
            <div 
              class="absolute inset-0 rounded-lg"
              :class="getPollutionLevelByName(selectedDayData.dayData.pollutionLevel)?.bgClass || 'bg-gray-500'"
              style="opacity: 0.7;"
            ></div>
            
            <div class="relative z-10">
              <MaTypography tag="div" type="body-2" weight="medium" class="text-white mb-2">
                Average Pollution Level:
              </MaTypography>
              <MaTypography 
                tag="div" 
                type="heading-5" 
                weight="bold"
                class="text-white drop-shadow-lg text-center"
              >
                {{ selectedDayData.dayData.pollutionLevel }}
              </MaTypography>
            </div>
          </div>
          
          <!-- Individual Pollutants -->
          <div v-if="selectedDayData.pollutants" class="space-y-3">
            <MaTypography tag="div" type="heading-6" weight="semibold" class="text-center">
              🌫️ Individual Pollutants
            </MaTypography>
            <div class="grid grid-cols-1 gap-3 p-4 bg-blue-50 rounded-lg">
              <div v-for="(value, pollutant) in selectedDayData.pollutants" :key="pollutant" 
                   class="flex flex-col p-3 bg-white rounded shadow-sm">
                <div class="flex justify-between items-center mb-2">
                  <MaTypography tag="span" type="body-2" weight="semibold" class="text-gray-800">
                    {{ pollutant.toUpperCase() }}
                  </MaTypography>
                  <MaTypography tag="span" type="body-2" weight="medium" :class="getPollutionLevelInfo(value).textClass">
                    {{ getPollutionLevelInfo(value).name }}
                  </MaTypography>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <MaTypography tag="div" type="body-2" class="text-yellow-800">
              💡 <strong>Tip:</strong> Pollution levels range from 1-6+: 
              <strong>1=Good</strong>, <strong>2=Satisfactory</strong>, <strong>3=Poor</strong>, 
              <strong>4=Moderate</strong>, <strong>5=Severe</strong>, <strong>6+=Hazardous</strong>. 
              Lower values indicate better air quality.
            </MaTypography>
          </div>
        </div>
        
        <!-- No Data Available -->
        <div v-else class="text-center py-8">
          <div class="text-6xl mb-4">🚫</div>
          <MaTypography tag="div" type="heading-6" weight="semibold" class="text-gray-500 mb-2">
            No Pollution Data Available
          </MaTypography>
          <MaTypography tag="div" type="body-2" class="text-gray-400">
            No pollution data found for {{ selectedDayData.dateString }}
          </MaTypography>
        </div>
      </div>
    </template> 
  </MaModal>
</template>
