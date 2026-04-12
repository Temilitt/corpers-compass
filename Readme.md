# Corper's Compass 

> Anonymous PPA reviews by Nigerian corpers, for Nigerian corpers.

**Live:** [corpers-compass.vercel.app](https://corpers-compass.vercel.app)

---

## What is this?

Corper's Compass is a platform where NYSC corps members can anonymously review their Place of Primary Assignment (PPA). Future corpers can search by state, filter by year, and read honest reviews before they land.

---

## Features

-  **Interactive Nigeria Map** — click any state to see PPA reviews
-  **4-Category Ratings** — Security, Allowance, Work Environment, Social Life
-  **100% Anonymous** — Firebase anonymous auth, no login required
-  **Search & Filter** — search by PPA name, filter by year, sort by rating
-  **Fully Responsive** — works on mobile, tablet and desktop
-  **Map colored by rating** — states light up based on average corper ratings

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 + custom CSS variables |
| Database | Firebase Firestore |
| Auth | Firebase Anonymous Auth |
| Map | React Simple Maps + D3 Geo |
| Deployment | Vercel |

---

## Local Setup

```bash
git clone https://github.com/Temilitt/corpers-compass.git
cd corpers-compass
npm install
```

Create a `.env` file with your Firebase config:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

```bash
npm run dev
```

---

## Project Structure