
# AI Cancer Prediction System

A comprehensive healthcare analytics platform that leverages artificial intelligence and machine learning algorithms to provide advanced cancer risk assessment and personalized healthcare recommendations.

## Features

### 🧠 AI-Powered Cancer Prediction
- Advanced machine learning models for cancer type prediction
- Confidence scoring and staging analysis (Stage I-IV)
- Multi-factor risk assessment with feature importance analysis

### 🏥 Intelligent Hospital Finder
- Geolocation-based hospital recommendations
- Automatic location detection and manual input
- State, district, and city-based filtering
- Integration with specialized oncology centers

### 📅 Automated Appointment Scheduling
- Seamless booking with specialized oncologists
- Automated email confirmations and reminders
- Cancellation management system

### 💊 Personalized Healthcare Recommendations
- Evidence-based medication suggestions
- Customized nutrition guidance
- Lifestyle modification recommendations
- Follow-up care planning

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **Authentication**: Supabase Auth
- **Email Services**: Resend API
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <https://github.com/CHAKRADHAR-2/cancer-aid-navigator-ai>
cd ai-cancer-prediction-system
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory and add:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # React components
├── pages/              # Page components
├── services/           # API services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── data/               # Static data files
└── integrations/       # Third-party integrations
```

## Key Components

- **PatientForm**: Comprehensive health data collection
- **PredictionResults**: AI prediction display with visualizations
- **HospitalFinder**: Location-based hospital recommendations
- **AppointmentScheduler**: Booking and management system

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This system is for educational and screening purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.

## Contact

For questions or support, please contact the Healthcare Analytics Team.
