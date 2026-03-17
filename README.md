# 🎓 AI Exam App - جامعة المصطفى
## اختبار مادة تطبيقات الذكاء الاصطناعي

Built with **Vite** + **Firebase Realtime Database**

---

## 📁 Project Structure
```
ai-exam-app/
├── index.html          ← Exam page (students)
├── admin.html          ← Admin panel (view results/database)
├── vite.config.js      ← Vite configuration
├── package.json
├── src/
│   ├── main.js           ← Exam logic + Firebase integration
│   ├── admin.js          ← Admin panel logic
│   └── firebase-config.js ← 🔧 Firebase config (EDIT THIS)
└── dist/               ← Production build output
```

---

## 🚀 Setup Instructions / خطوات الإعداد

### Step 1: Setup Firebase (Database)

1. Go to **https://console.firebase.google.com/**
2. Click **"Add project"** → Enter name (e.g., `al-mustafa-exam`) → Create
3. Go to **Build** → **Realtime Database** → **Create Database**
4. Choose location → **Start in TEST mode** → Enable
5. Go to **Project Settings** (⚙️ gear icon) → **General** → scroll down → **"Add app"** → click **Web** (`</>` icon)
6. Register app → Copy the `firebaseConfig` object

### Step 2: Update Firebase Config

Edit `src/firebase-config.js` and replace the placeholders:

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSy...",              // ← paste your values
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 3: Test Locally

```bash
npm run dev
```

- **Exam**: http://localhost:5173/
- **Admin Panel**: http://localhost:5173/admin.html

### Step 4: Deploy Online (Free Hosting)

#### Option A: Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your project
# Set public directory to: dist
# Configure as SPA: No
npm run build
firebase deploy
```

#### Option B: Vercel (Easiest)
```bash
npm install -g vercel
npm run build
cd dist
vercel
```

#### Option C: Netlify
```bash
npm run build
# Drag & drop the 'dist' folder to https://app.netlify.com/drop
```

---

## 📊 Admin Panel

Access at: `https://your-domain/admin.html`

Features:
- ✅ Real-time exam results from Firebase database
- ✅ Search by student name
- ✅ Filter by department & stage
- ✅ Export results to CSV
- ✅ Statistics: total, passed, failed, average

---

## 🔧 Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (→ dist/) |
| `npm run preview` | Preview production build |

---

## 📌 Features
- 100 questions database (5 chapters × 20 questions)
- 25 random questions per exam (5 from each chapter)
- Randomized questions AND answer options
- 2-minute timer per question
- 5 attempts limit (localStorage)
- Three-part name validation
- Department & stage selection
- Real-time Firebase database storage
- Admin panel with search, filter, CSV export
- Perfect score celebration with confetti 🎉
- Bilingual (Arabic + English)
