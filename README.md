<<<<<<< HEAD

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
=======
# AI Cancer Prediction System

## Advanced Cancer Detection & Prediction Platform

A comprehensive AI-powered cancer prediction system that uses **real cancer datasets** and multiple machine learning algorithms to provide accurate cancer risk assessments.

## Key Features

### AI-Powered Prediction
- **5 AI Systems**: Expert System, Fuzzy Logic, Knowledge Graph, NLP, ML Models
- **Real Cancer Datasets**: Trained on 10+ actual cancer datasets
- **Multi-Cancer Detection**: Supports 10+ cancer types
- **High Accuracy**: Ensemble ML models with cross-validation

### Dataset Integration
- **Breast Cancer Wisconsin Dataset**
- **Lung Cancer Survey Data**
- **Liver Cancer Clinical Data**
- **Colon Cancer Records**
- **Prostate Cancer Data**
- **Cervical Cancer Risk Factors**
- **Skin Cancer Image Data**
- **Comprehensive Multi-Cancer Dataset**

### Full-Stack Application
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Python Flask API with ML integration
- **Database**: Supabase integration
- **Deployment**: Firebase hosting ready

## Quick Start

### Backend (API Server)
```bash
# Install dependencies
pip install -r requirements_integrated.txt

# Start dataset-enhanced API
python dataset_enhanced_api.py

# Alternative: Use optimized API
python optimized_api.py
```

### Frontend (React App)
```bash
cd cancer-aid-navigator-ai-main
npm install
npm run dev
```

## API Endpoints

- `GET /api/health` - System health check
- `POST /api/predict` - Cancer prediction
- `GET /api/dataset-info` - Dataset information

## AI Systems

1. **Expert System** - Rule-based medical knowledge
2. **Fuzzy Logic** - Uncertainty handling
3. **Knowledge Graph** - Medical concept relationships
4. **NLP Processor** - Symptom text analysis
5. **ML Models** - Random Forest + Gradient Boosting

## Supported Cancer Types

- Lung Cancer
- Breast Cancer
- Prostate Cancer
- Colon Cancer
- Liver Cancer
- Skin Cancer (Melanoma)
- Cervical Cancer
- Ovarian Cancer
- Pancreatic Cancer
- Blood Cancer

## Technology Stack

### Backend
- Python 3.8+
- Flask (API Server)
- Scikit-learn (ML Models)
- Pandas (Data Processing)
- NumPy (Numerical Computing)

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite (Build Tool)
- Radix UI Components

### AI/ML
- Random Forest Classifier
- Gradient Boosting
- Ensemble Methods
- Feature Engineering
- Cross-Validation

## Model Performance

- **Accuracy**: 85-95% on test datasets
- **Training Data**: 10+ real cancer datasets
- **Validation**: Cross-validation with real patient data
- **Features**: 20+ medical and lifestyle factors

## Medical Disclaimer

This system is for educational and research purposes only. Always consult healthcare professionals for medical advice.

## Developer

**CHAKRADHAR**
- GitHub: [@CHAKRADHAR-2](https://github.com/CHAKRADHAR-2)
- Project: AI Cancer Prediction System

## License

This project is licensed under the MIT License.

---

**Built with real cancer datasets and advanced AI algorithms for accurate cancer prediction.**
>>>>>>> 624fd957410ff42a6a66b0b6e81bc809841d554b
