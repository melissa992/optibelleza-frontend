# OptiBelleza Frontend

Modern e-commerce frontend for OptiBelleza eyewear store built with Vite + React and Material UI.

## Features

- 🔐 User authentication (Login/Register)
- 🛍️ Product catalog with filtering
- 🔍 Product detail pages
- 🛒 Shopping cart management
- 💳 Checkout process
- 📦 Order history
- 📱 Fully responsive design
- 🎨 Modern UI with yellow/black/white theme

## Tech Stack

- **Framework**: Vite + React 18
- **UI Library**: Material UI (MUI) v6
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # API client and endpoints
├── assets/           # Images and static files
├── components/       # Reusable components
│   ├── common/       # Common components
│   ├── layout/       # Layout components
│   └── product/      # Product-specific components
├── contexts/         # React contexts
├── pages/            # Page components
├── theme.js          # MUI theme configuration
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Backend Connection

Make sure the backend API is running at `http://127.0.0.1:8000` before starting the frontend.

## Color Scheme

- **Primary**: Gold (#c4a043)
- **Secondary**: Black (#000000)
- **Background**: White (#FFFFFF)
