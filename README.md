# Bank Chat Demo - Client Frontend

A React + Vite chat application with simulated login functionality.

## Features

- **Simulated Login**: Enter any username and password to login (demo mode)
- **Chat Interface**: Clean and modern chat UI
- **API Integration**: Connects to a chat API endpoint to send and receive messages
- **Real-time Messaging**: Send text messages and receive responses from the API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
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

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Configuration

### Chat API Endpoint

The chat API endpoint is configured in `src/components/Chat.jsx`. By default, it's set to:

```javascript
const CHAT_API_URL = 'http://localhost:3000/api/chat'
```

Update this constant to point to your actual chat API endpoint.

### API Request Format

The app sends POST requests to the chat API with the following format:

```json
{
  "message": "user message text",
  "username": "logged in username"
}
```

### Expected API Response Format

The app expects the API to return JSON with either:
- `{ "message": "response text" }` or
- `{ "text": "response text" }`

## Project Structure

```
clientBankChatDemo/
├── src/
│   ├── components/
│   │   ├── Login.jsx       # Login component
│   │   ├── Login.css
│   │   ├── Chat.jsx        # Chat component
│   │   └── Chat.css
│   ├── App.jsx             # Main app component
│   ├── App.css
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

