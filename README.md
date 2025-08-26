# City Pollution Frontend

A modern Vue 3 application for visualizing and analyzing air pollution data across different cities. This interactive dashboard allows users to explore historical pollution levels through an intuitive heat calendar interface.

## ✨ Features

- **📊 Interactive Heat Calendar**: Visualize pollution data over time using cal-heatmap
- **🏙️ Multi-City Support**: Select from multiple cities (Tokyo, Barcelona, London, Ankara, Mumbai, Madrid)
- **📅 Date Range Selection**: Choose custom date ranges between 2020 and today
- **🎨 Color-Coded Pollution Levels**: Six-level pollution classification system (Good to Hazardous)
- **📱 Responsive Design**: Optimized for both desktop and mobile devices
- **🔍 Detailed Pollution Data**: View individual pollutant information in modal dialogs
- **⚡ Real-Time Updates**: Automatic data fetching when selections change

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API (`<script setup>`)
- **Build Tool**: Vite
- **State Management**: Pinia
- **UI Components**: MobileAction Action-Kit
- **Styling**: Tailwind CSS
- **Data Visualization**: Cal-Heatmap with plugins
- **Date Handling**: Day.js
- **HTTP Client**: Fetch API

## 🏗️ Project Structure

```
src/
├── components/          # Vue components
│   ├── CitySelector.vue    # City selection interface
│   ├── DatePicker.vue      # Date range picker
│   ├── HeatCalendar.vue    # Main heat calendar visualization
│   └── PollutionCard.vue   # Modal for detailed pollution data
├── composables/         # Reusable composition functions
│   ├── useHeatCalendar.js  # Calendar logic and configuration
│   └── usePollutionModal.js # Modal state management
├── services/           # API services
│   └── pollutionAPI.js    # Pollution data API client
├── stores/             # Pinia stores
│   └── settingStore.js    # Application settings and state
├── utils/              # Utility functions
│   └── pollutionLevels.js # Pollution level definitions and helpers
└── style/              # Global styles
    └── main.css           # Main stylesheet with Tailwind imports
```

## 🚀 Getting Started

### Prerequisites

- Node.js (^20.19.0 || >=22.12.0)
- Yarn package manager

### Installation

1. Clone the repository:
```sh
git clone https://github.com/AlperenOvak/city-polution-frontend.git
cd city-polution-frontend
```

2. Install dependencies:
```sh
yarn install
```

3. Set up environment variables:
```sh
cp .env.example .env.local
# Edit .env.local with your API configuration
```

4. Start the development server:
```sh
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📋 Available Scripts

### Development
```sh
yarn dev          # Start development server with hot-reload
```

### Production
```sh
yarn build        # Build for production
yarn preview      # Preview production build locally
```

### Code Quality
```sh
yarn lint         # Run ESLint (when configured)
```

## 🎯 Usage

1. **Select Date Range**: Use the date picker to choose a time period between 2020 and today
2. **Choose City**: Select a city from the available options using the radio cards
3. **View Data**: The heat calendar automatically updates with pollution data
4. **Explore Details**: Click on any date in the calendar to view detailed pollution information
5. **Navigate**: Use navigation buttons for large date ranges to explore different time periods

## 🌈 Pollution Level Classification

The application uses a six-level pollution classification system:

| Level | Value | Color | Description |
|-------|-------|-------|-------------|
| Good | 1 | 🟢 Green | Air quality is satisfactory |
| Satisfactory | 2 | 🟡 Light Green | Acceptable for most people |
| Poor | 3 | 🟡 Yellow | Sensitive groups may experience effects |
| Moderate | 4 | 🟠 Orange | Everyone may begin to experience effects |
| Severe | 5 | 🔴 Red | Health warnings of emergency conditions |
| Hazardous | 6+ | 🔴 Dark Red | Health alert for everyone |

## 🔧 Configuration

### API Configuration

Update your `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Date Constraints

The application limits date selection between November 27, 2020, and today. This can be configured in `src/components/DatePicker.vue`.

## 🏛️ Architecture

The application follows modern Vue 3 best practices:

- **Composition API**: All components use `<script setup>` for consistency
- **Composables**: Logic is extracted into reusable composable functions
- **Centralized State**: Pinia store manages application state
- **Type Safety**: Comprehensive JSDoc documentation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Separation**: Clear separation of concerns

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
