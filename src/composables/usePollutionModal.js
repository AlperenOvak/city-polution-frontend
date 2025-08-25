import { ref } from 'vue';

export function usePollutionModal(pollutionData) {
  // Modal state
  const modalVisible = ref(false);
  const selectedDayData = ref(null);

  const handleDayClick = (event, timestamp, value) => {
    const clickedDate = new Date(timestamp);
    const dateString = clickedDate.toISOString().split('T')[0];
    
    const dayData = pollutionData.value.find(item => item.calendarData.date === dateString);
    
    // Store the selected day data for the modal
    selectedDayData.value = {
      date: clickedDate,
      dateString: dateString,
      formattedDate: clickedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      dayData: dayData,
      pollutants: dayData?.pollutants || null
    };
    
    // Show the modal
    modalVisible.value = true;
  };

  const closeModal = () => {
    modalVisible.value = false;
  };

  return {
    modalVisible,
    selectedDayData,
    handleDayClick,
    closeModal
  };
}
