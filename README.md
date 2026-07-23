# System Design Arena

A LeetCode-style platform to practice system design. Draw architecture diagrams on an interactive canvas, get AI-generated feedback, and share your designs with the community.

## Live Demo

- App: https://system-design-arena-eight.vercel.app/
- API: https://system-design-arena.onrender.com/api/v1

## Features

- Draw system design diagrams using an interactive canvas (React Flow)
- Get AI-powered review and feedback on your designs (via Gemini through OpenRouter)
- Save versions of your design and track history
- Browse and learn from designs published by the community
- Comment and upvote on community designs
- Auth with email/password and Google Sign-In

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Flow

**Backend:** Node.js, Express, MongoDB, Mongoose

**AI:** OpenRouter (Gemini)

**Deployment:** Vercel (frontend), Render (backend)

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local or Atlas)

### Setup

1. Clone the repo

```bash
git clone https://github.com/your-username/system-design-arena.git
cd system-design-arena
```

2. Install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

3. Add environment variables

Create a `.env` file in `backend/` with:

```env
MONGODB_URI=
CORS_ORIGIN=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GOOGLE_CLIENT_ID=
```

Create a `.env` file in `frontend/` with:

```env
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
```

4. Run the app

```bash
# In backend/
npm run dev

# In frontend/
npm run dev
```

## License

MIT