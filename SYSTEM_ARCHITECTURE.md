# Cancer Aid Navigator AI - System Architecture

## 🏗️ **High-Level System Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                    CANCER AID NAVIGATOR AI                      │
│                     System Architecture                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PRESENTATION  │    │    BUSINESS     │    │      DATA       │
│      LAYER      │    │     LOGIC       │    │     LAYER       │
│                 │    │     LAYER       │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │ React UI  │  │◄──►│  │ ML Engine │  │◄──►│  │ Hospital  │  │
│  │ Components│  │    │  │ Prediction│  │    │  │ Database  │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│                 │    │                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │ PWA Shell│  │◄──►│  │ SHAP      │  │◄──►│  │ Doctor    │  │
│  │ Service   │  │    │  │ Explainer │  │    │  │ Service   │  │
│  │ Worker    │  │    │  └───────────┘  │    │  └───────────┘  │
│  └───────────┘  │    │                 │    │                 │
│                 │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  ┌───────────┐  │◄──►│  │ Location  │  │◄──►│  │ Location  │  │
│  │ Responsive│  │    │  │ Services  │  │    │  │ APIs      │  │
│  │ Design    │  │    │  └───────────┘  │    │  └───────────┘  │
│  └───────────┘  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🎯 **Frontend Architecture**

### **React Application Structure**
```
src/
├── components/           # Reusable UI Components
│   ├── ui/              # Shadcn/UI Components
│   ├── prediction/      # Prediction-specific Components
│   ├── hospital/        # Hospital Finder Components
│   └── common/          # Shared Components
├── pages/               # Main Application Pages
├── services/            # Business Logic Services
├── utils/               # Utility Functions & Algorithms
├── types/               # TypeScript Type Definitions
├── hooks/               # Custom React Hooks
└── data/                # Static Data & Configurations
```

### **Component Hierarchy**
```
App
├── Router
│   ├── HomePage
│   │   ├── HealthAssessmentForm
│   │   ├── PredictionResults
│   │   │   ├── PredictionCard
│   │   │   ├── SHAPExplanation
│   │   │   ├── MedicationRecommendations
│   │   │   └── NutritionRecommendations
│   │   └── HospitalRecommendations
│   │       ├── LocationInput
│   │       ├── HospitalCard
│   │       └── DoctorInformation
│   └── AppointmentScheduler
└── PWA Shell
    ├── ServiceWorker
    ├── Manifest
    └── Offline Fallback
```

---

## 🧠 **Machine Learning Architecture**

### **Prediction Engine Pipeline**
```
┌─────────────────────────────────────────────────────────────────┐
│                    ML PREDICTION PIPELINE                       │
└─────────────────────────────────────────────────────────────────┘

Input Data
    ↓
┌─────────────────┐
│ Data Validation │ ← Input Sanitization & Validation
│ & Preprocessing │
└─────────────────┘
    ↓
┌─────────────────┐
│ Feature         │ ← 19 Medical Features Extraction
│ Extraction      │   (Age, Symptoms, Biomarkers)
└─────────────────┘
    ↓
┌─────────────────┐
│ Healthy Patient │ ← Safety Check: Identify Healthy Patients
│ Detection       │
└─────────────────┘
    ↓
┌─────────────────┐
│ Ensemble ML     │ ← Random Forest + Gradient Boosting + Neural Network
│ Prediction      │   Weighted Voting (35% + 35% + 30%)
└─────────────────┘
    ↓
┌─────────────────┐
│ Medical         │ ← 75% Confidence Threshold
│ Validation      │   Age/Gender/Symptom Consistency
└─────────────────┘
    ↓
┌─────────────────┐
│ SHAP            │ ← Feature Attribution & Explanation
│ Explanation     │   TreeExplainer/LinearExplainer/KernelExplainer
└─────────────────┘
    ↓
Final Prediction + Explanation
```

### **Algorithm Integration**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Random Forest   │    │ Gradient        │    │ Neural Network  │
│ Classifier      │    │ Boosting        │    │ (Simulated)     │
│                 │    │ Classifier      │    │                 │
│ • 35% Weight    │    │ • 35% Weight    │    │ • 30% Weight    │
│ • Tree-based    │    │ • Sequential    │    │ • Multi-layer   │
│ • Robust        │    │ • Boosting      │    │ • Pattern       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ↓                       ↓                       ↓
         └───────────────────────┼───────────────────────┘
                                 ↓
                    ┌─────────────────┐
                    │ Ensemble Voting │
                    │ Algorithm       │
                    │                 │
                    │ Weighted Average│
                    │ Final Prediction│
                    └─────────────────┘
```

---

## 🏥 **Hospital & Location Services Architecture**

### **Location Service Flow**
```
User Location Request
    ↓
┌─────────────────┐
│ GPS Coordinates │ ← navigator.geolocation API
│ Detection       │
└─────────────────┘
    ↓
┌─────────────────┐
│ Enhanced        │ ← External API (OpenStreetMap Nominatim)
│ Reverse         │   + Local Database (500+ cities)
│ Geocoding       │   + Coordinate-based Fallback
└─────────────────┘
    ↓
┌─────────────────┐
│ Hospital        │ ← State-based Filtering
│ Database Query  │   Cancer-specific Matching
└─────────────────┘
    ↓
┌─────────────────┐
│ Distance        │ ← Haversine Formula
│ Calculation     │   GPS Coordinate Precision
└─────────────────┘
    ↓
┌─────────────────┐
│ Doctor          │ ← Unique Generation per Hospital
│ Assignment      │   Seeded Random Algorithm
└─────────────────┘
    ↓
Sorted Hospital List + Doctors
```

### **Hospital Data Structure**
```
Hospital Database
├── State-wise Organization
│   ├── Delhi (3 hospitals)
│   ├── Maharashtra (3 hospitals)
│   ├── Karnataka (3 hospitals)
│   ├── Tamil Nadu (3 hospitals)
│   └── ... (10 states total)
├── Hospital Information
│   ├── Basic Details (Name, Address, Coordinates)
│   ├── Contact Information (Phone, Email, Website)
│   ├── Specializations (Cancer-specific)
│   └── Capacity & Ratings
└── Doctor Assignment
    ├── Unique per Hospital (3-5 doctors)
    ├── Cancer Specializations
    ├── Experience & Qualifications
    └── Availability & Fees
```

---

## 🔒 **Security & Validation Architecture**

### **Multi-Layer Security**
```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────┘

Frontend Security
├── Input Validation
│   ├── Type Checking
│   ├── Range Validation
│   ├── Sanitization
│   └── XSS Prevention
├── Content Security Policy
├── HTTPS Enforcement
└── Secure Headers

Backend Security
├── Medical Validation
│   ├── 75% Confidence Threshold
│   ├── Healthy Patient Detection
│   ├── Age-based Validation
│   └── Symptom Consistency
├── Data Privacy
│   ├── No Personal Data Storage
│   ├── Location Anonymization
│   └── Session-based Processing
└── Error Handling
    ├── Graceful Degradation
    ├── Fallback Mechanisms
    └── Comprehensive Logging
```

---

## 📊 **Data Flow Architecture**

### **End-to-End Data Flow**
```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA FLOW DIAGRAM                          │
└─────────────────────────────────────────────────────────────────┘

User Input
    ↓
┌─────────────────┐
│ Health          │ ← Form Validation & Sanitization
│ Assessment Form │
└─────────────────┘
    ↓
┌─────────────────┐
│ Feature         │ ← 19 Medical Features
│ Extraction      │   Normalization & Encoding
└─────────────────┘
    ↓
┌─────────────────┐
│ ML Prediction   │ ← Ensemble Algorithm
│ Engine          │   Medical Validation
└─────────────────┘
    ↓
┌─────────────────┐
│ SHAP            │ ← Feature Attribution
│ Explanation     │   Visualization Data
└─────────────────┘
    ↓
┌─────────────────┐
│ Hospital        │ ← Location Services
│ Finder          │   Distance Calculation
└─────────────────┘
    ↓
┌─────────────────┐
│ Results         │ ← Comprehensive Output
│ Presentation    │   Tabbed Interface
└─────────────────┘
```

---

## 🚀 **Deployment Architecture**

### **Firebase Hosting Setup**
```
┌─────────────────────────────────────────────────────────────────┐
│                   DEPLOYMENT ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────┘

Development
├── Local Development (Vite Dev Server)
├── Git Repository (Version Control)
└── Feature Branches

CI/CD Pipeline
├── GitHub Actions
│   ├── Automated Testing
│   ├── Build Process (npm run build)
│   ├── Firebase Deployment
│   └── Environment Management
└── Deployment Triggers
    ├── Push to Main Branch
    ├── Pull Request Merges
    └── Manual Deployment

Production
├── Firebase Hosting
│   ├── Global CDN
│   ├── HTTPS Certificates
│   ├── Custom Domain Support
│   └── Performance Optimization
├── PWA Features
│   ├── Service Worker
│   ├── Offline Caching
│   ├── App Installation
│   └── Push Notifications
└── Monitoring
    ├── Performance Metrics
    ├── Error Tracking
    ├── User Analytics
    └── Uptime Monitoring
```

---

## 🔧 **Technology Stack**

### **Frontend Technologies**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    FRAMEWORK    │  │   UI LIBRARY    │  │   BUILD TOOL    │
│                 │  │                 │  │                 │
│ React 18.3.1    │  │ Shadcn/UI       │  │ Vite 5.4.1      │
│ TypeScript 5.5  │  │ Radix UI        │  │ SWC Compiler    │
│ React Router    │  │ Tailwind CSS    │  │ ESLint          │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### **Backend Services**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   ML/AI STACK   │  │   DATA LAYER    │  │   DEPLOYMENT    │
│                 │  │                 │  │                 │
│ SHAP Library    │  │ Local Storage   │  │ Firebase        │
│ Custom ML       │  │ Static Data     │  │ GitHub Actions  │
│ Algorithms      │  │ External APIs   │  │ PWA Support     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 📈 **Performance Architecture**

### **Optimization Strategies**
```
┌─────────────────────────────────────────────────────────────────┐
│                  PERFORMANCE OPTIMIZATION                       │
└─────────────────────────────────────────────────────────────────┘

Frontend Optimization
├── Code Splitting (Automatic with Vite)
├── Lazy Loading (Components & Images)
├── Bundle Optimization (Tree Shaking)
├── Caching Strategy (Service Worker)
└── Responsive Images (WebP Format)

Algorithm Optimization
├── Feature Selection (19 key features)
├── Model Ensemble (Weighted Voting)
├── Caching (Hospital & Doctor Data)
├── Fallback Systems (Error Recovery)
└── Parallel Processing (Where Applicable)

Network Optimization
├── CDN Distribution (Firebase)
├── GZIP Compression
├── HTTP/2 Support
├── Resource Preloading
└── API Response Caching
```

---

## 🎯 **System Metrics & KPIs**

### **Performance Indicators**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ MEDICAL SAFETY  │  │ SYSTEM PERFORMANCE │  │ USER EXPERIENCE │
│                 │  │                    │  │                 │
│ False Positive  │  │ Page Load Time     │  │ Mobile          │
│ Rate: <5%       │  │ <3 seconds         │  │ Responsive: 100%│
│                 │  │                    │  │                 │
│ Accuracy: 95%+  │  │ Uptime: 99.9%+     │  │ Accessibility   │
│                 │  │                    │  │ WCAG Compliant  │
│                 │  │                    │  │                 │
│ Healthy Patient │  │ API Response       │  │ PWA Score       │
│ Detection: 90%+ │  │ <500ms             │  │ 95+ Lighthouse  │
└─────────────────┘  └─────────────────────┘  └─────────────────┘
```

---

## 🔄 **System Integration Points**

### **External Integrations**
```
Cancer Aid Navigator AI
├── Location Services
│   ├── Browser Geolocation API
│   ├── OpenStreetMap Nominatim API
│   └── Google Maps (for directions)
├── Communication
│   ├── Email Services (Supabase)
│   ├── Phone Integration (tel: links)
│   └── Website Links (hospital websites)
└── Deployment
    ├── Firebase Hosting
    ├── GitHub Actions
    └── Domain Management
```

---

## 📋 **Architecture Summary**

### **Key Architectural Principles**
- **🏗️ Modular Design**: Separation of concerns with clear layer boundaries
- **🔒 Security First**: Multi-layer validation and privacy protection
- **📱 Mobile First**: Responsive design with PWA capabilities
- **🚀 Performance**: Optimized for speed and scalability
- **🧠 AI Transparency**: Explainable AI with SHAP integration
- **🏥 Medical Safety**: Strict validation to prevent false positives
- **🌐 Accessibility**: WCAG compliant for all users
- **🔄 Reliability**: Comprehensive error handling and fallbacks

### **System Characteristics**
- **Frontend**: React + TypeScript + Tailwind CSS
- **ML Engine**: Custom ensemble algorithms with SHAP
- **Data Layer**: Static data with external API integration
- **Deployment**: Firebase with automated CI/CD
- **Performance**: <3s load time, 99.9% uptime
- **Security**: HTTPS, CSP, input validation
- **Scalability**: Designed for high user load

**This architecture ensures a robust, secure, and scalable cancer risk assessment and healthcare navigation system.** 🎯