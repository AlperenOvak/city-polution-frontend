import { defineStore } from 'pinia';

export const useSettingStore = defineStore('settingStore', {
  state: () => ({
    dateRange: (() => {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      return [lastWeek, today];
    })(),
    selectedCity: 1,
    cityOptions: [
      { value: 1, text: 'Tokyo', hint: 'Japan', img: 'https://cdn.vectorstock.com/i/2000v/92/20/tokyo-city-map-detailed-print-vector-34009220.avif' },
      { value: 2, text: 'Barcelona', hint: 'Spain' ,img: 'https://cdn.vectorstock.com/i/2000v/33/01/barcelona-city-map-detailed-plan-vector-22493301.avif' },
      { value: 3, text: 'London', hint: 'United Kingdom', img: 'https://thumbs.dreamstime.com/b/vintage-london-vector-map-modern-city-center-street-style-140464753.jpg' },
      { value: 4, text: 'Ankara', hint: 'Turkey', img: 'https://cdn.vectorstock.com/i/2000v/61/38/ankara-city-map-turkey-vector-37156138.avif' },
      { value: 5, text: 'Mumbai', hint: 'India', img: 'https://as2.ftcdn.net/jpg/03/04/72/71/1000_F_304727106_UoGEw9m8o0AqPwZrdCkbtAcN8CukhDy2.jpg' },
      { value: 6, text: 'Madrid', hint: 'Spain', img: 'https://cdn.vectorstock.com/i/2000v/92/20/tokyo-city-map-detailed-print-vector-34009220.avif' },
    ],
  }),
  getters: {
    getDateRange: (state) => state.dateRange,
    getSelectedCity: (state) => state.selectedCity,
    getCityOptions: (state) => state.cityOptions
  },
  actions: {
    setDateRange(range) {
      this.dateRange = range;
    },
    setSelectedCity(city) {
      this.selectedCity = city;
    },
  },
});
