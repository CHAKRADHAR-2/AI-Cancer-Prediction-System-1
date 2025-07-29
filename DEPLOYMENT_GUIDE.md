# Cancer Aid Navigator AI - Deployment Guide

## 🚀 **Deployment Options**

### **Option 1: Firebase Hosting (Recommended)**

#### **Prerequisites:**
1. **Node.js** (v18 or higher)
2. **Firebase CLI** installed globally
3. **Firebase project** created

#### **Step 1: Install Firebase CLI**
```bash
npm install -g firebase-tools
```

#### **Step 2: Login to Firebase**
```bash
firebase login
```

#### **Step 3: Build the Project**
```bash
npm install
npm run build
```

#### **Step 4: Deploy to Firebase**
```bash
firebase deploy
```

#### **Firebase Configuration:**
- **Project ID**: `cancer-aid-navigator-ai-2025`
- **Build Directory**: `dist`
- **Public Directory**: `dist`

---

### **Option 2: Vercel Deployment**

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Deploy**
```bash
vercel --prod
```

#### **Vercel Configuration:**
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

### **Option 3: Netlify Deployment**

#### **Step 1: Build the Project**
```bash
npm run build
```

#### **Step 2: Deploy to Netlify**
1. Go to [Netlify](https://netlify.com)
2. Drag and drop the `dist` folder
3. Or connect your GitHub repository

#### **Netlify Configuration:**
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

---

### **Option 4: GitHub Pages**

#### **Step 1: Install gh-pages**
```bash
npm install --save-dev gh-pages
```

#### **Step 2: Add Deploy Script to package.json**
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

#### **Step 3: Deploy**
```bash
npm run deploy
```

---

## 🔧 **Pre-Deployment Checklist**

### **1. Environment Variables**
Create `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **2. Build Optimization**
```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

### **3. Dependencies Check**
```bash
# Install all dependencies
npm install

# Check for vulnerabilities
npm audit fix
```

---

## 🌐 **Firebase Hosting Setup (Detailed)**

### **Step 1: Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: `cancer-aid-navigator-ai-2025`
3. Enable Hosting

### **Step 2: Initialize Firebase in Project**
```bash
firebase init hosting
```

**Configuration Options:**
- **Public directory**: `dist`
- **Single-page app**: `Yes`
- **Automatic builds**: `No` (we'll use GitHub Actions)

### **Step 3: Configure GitHub Actions**
The project already has GitHub Actions configured:
- **File**: `.github/workflows/firebase-hosting-merge.yml`
- **Triggers**: Push to `main` branch
- **Actions**: Build and deploy automatically

### **Step 4: Set GitHub Secrets**
In your GitHub repository settings, add:
- `FIREBASE_SERVICE_ACCOUNT_CANCER_AID_NAVIGATOR_AI_2025`

---

## 📱 **Mobile Optimization**

### **PWA Configuration**
The app is already configured as a PWA with:
- **Service Worker**: Automatic caching
- **Manifest**: App installation support
- **Responsive Design**: Mobile-first approach

### **Performance Optimization**
- **Code Splitting**: Automatic with Vite
- **Image Optimization**: Lazy loading implemented
- **Bundle Size**: Optimized with tree shaking

---

## 🔒 **Security Configuration**

### **Content Security Policy**
Add to your hosting provider:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;">
```

### **HTTPS Configuration**
- **Firebase**: Automatic HTTPS
- **Vercel**: Automatic HTTPS
- **Netlify**: Automatic HTTPS

---

## 🚀 **Quick Deploy Commands**

### **Firebase (Recommended)**
```bash
# One-time setup
npm install -g firebase-tools
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy
```

### **Vercel**
```bash
# One-time setup
npm install -g vercel

# Deploy
npm run build
vercel --prod
```

### **Netlify**
```bash
# Build and manual deploy
npm run build
# Then drag dist folder to netlify.com
```

---

## 📊 **Post-Deployment Verification**

### **1. Functionality Tests**
- ✅ Health assessment form works
- ✅ Prediction engine generates results
- ✅ Hospital finder shows locations
- ✅ Doctor information loads
- ✅ Appointment scheduling works
- ✅ SHAP explanations display

### **2. Performance Tests**
- ✅ Page load time < 3 seconds
- ✅ Mobile responsiveness
- ✅ Cross-browser compatibility
- ✅ PWA installation works

### **3. SEO Optimization**
- ✅ Meta tags configured
- ✅ Open Graph tags
- ✅ Sitemap generated
- ✅ Robots.txt configured

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **Routing Issues (SPA)**
Ensure your hosting provider redirects all routes to `index.html`:
```json
// firebase.json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### **Environment Variables**
Make sure environment variables are prefixed with `VITE_`:
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

## 🎯 **Deployment Status**

### **Current Configuration:**
- ✅ **Firebase Hosting**: Configured and ready
- ✅ **GitHub Actions**: Auto-deployment on push
- ✅ **Build System**: Vite with optimizations
- ✅ **PWA**: Service worker and manifest
- ✅ **Responsive**: Mobile-first design
- ✅ **Security**: HTTPS and CSP ready

### **Live URLs:**
- **Production**: `https://cancer-aid-navigator-ai-2025.web.app`
- **Preview**: Available via Firebase preview channels

---

## 📞 **Support**

### **Deployment Commands Summary:**
```bash
# Firebase (Recommended)
npm run build && firebase deploy

# Vercel
npm run build && vercel --prod

# Netlify
npm run build
# Then upload dist folder

# GitHub Pages
npm run deploy
```

**Your Cancer Aid Navigator AI project is ready for deployment! 🚀**