# 🌐 Harmony Frontend

A modern React-based dashboard application for managing business workflows, tasks, and geographic data visualization.

## 🌟 Features

### 🔐 Authentication System
- Email/Password login
- Google Sign-in integration
- Role-based access control

### 📋 Action Plans Management
- Create and manage workflows
- Task creation and assignment
- Progress tracking
- Department-specific views
- Real-time status updates

### 🗺️ Interactive Maps
- Geographic data visualization
- Route planning and management
- Distributor location mapping
- Zone-based analytics
- Filter by distributor types

### 🤖 AI-Powered Chat
- Workflow-specific conversations
- Intelligent responses
- Context-aware interactions

### 📊 Analytics Dashboard
- Performance metrics
- Sales statistics
- Department progress tracking
- Visual data representation

## 🚀 Technology Stack

| Category | Technology |
|----------|------------|
| Frontend Framework | React with Vite |
| Authentication | Firebase Auth |
| State Management | React Query |
| Styling | Tailwind CSS |
| UI Components | Custom shadcn/ui components |
| Maps | React Leaflet |
| Form Handling | React Hook Form + Zod |
| API Integration | REST API with fetch |

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or pnpm
- Firebase account
- API endpoint (default: `http://127.0.0.1:8080`)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/harmony-frontend.git
cd harmony-frontend
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_ENDPOINT=http://127.0.0.1:8080
```

### 4. Set up Firebase
Update `src/firebase.js` with your Firebase configuration:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... other configuration
};
```

### 5. Start Development Server
```bash
npm run dev
# or
pnpm dev
```

## 🏗️ Project Structure

```
src/
│
├── components/       # Reusable UI components
├── pages/            # Application pages
├── hooks/            # Custom React hooks
├── context/          # React context providers
├── utils/            # Utility functions
└── services/         # API and Firebase services
```

## 👥 User Roles

| Role | Access Level |
|------|--------------|
| Administrator | Full access to all features |
| Marketing Manager | Access to marketing and trade marketing departments |
| Sales Manager | Access to sales department features |

## 🔒 Security Features

- Firebase Authentication
- Role-based access control
- Secure API endpoints
- Environment variable protection

