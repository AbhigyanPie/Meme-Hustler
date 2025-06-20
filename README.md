# MemeHustle: Cyberpunk AI Meme Marketplace
**Live demo:** [memehustle.vercel.app](https://memehustle.vercel.app)  
**Live Website:** https://meme-hustler.vercel.app/
## Project Overview

MemeHustle is a cyberpunk-inspired, AI-powered meme marketplace where users can:

- 🎨 Create and tag memes
- 💰 Bid in real-time using fake credits
- 📈 Upvote/downvote memes and climb the leaderboard
- 🤖 Generate AI captions and vibe tags using Google Gemini
- 🧠 Enjoy a neon-glitch hacker interface

This is a chaotic, fast-shipped, glitch-laced hackathon project — bold and messy by design.

---

## 🛠 Tech Stack

| Layer        | Tech Used                                   |
|--------------|---------------------------------------------|
| Frontend     | React, Tailwind CSS, Socket.IO              |
| Backend      | Node.js, Express, Socket.IO                 |
| Database     | Supabase (PostgreSQL)                       |
| AI API       | Google Gemini 2.0                           |
| Deployment   | Vercel (frontend), Render (optional backend)|

---

## Features

### Meme Creation

- `POST /memes` creates a meme with title, image URL, and tags

### 👍 Upvote/Downvote + Leaderboard

- `POST /memes/:id/vote` handles upvote/downvote
- Live leaderboard via `GET /leaderboard`
- Socket.IO broadcasts vote changes

### 🧠 AI Caption & Vibe (Google Gemini)

- On meme creation or button click:
  - Caption: Gemini generates a funny one-liner
  - Vibe: Gemini analyzes tags for meme “mood”
- Stored in Supabase `memes` table

### 🌐 Cyberpunk UI

- Glitch text, neon flickers, retro-futuristic grid
- Tailwind CSS + animation utilities
- Mobile-friendly layout
- Hacker-style terminal intro

---

## 📦 Setup & Installation

## Environment Variable
Create a .env file in both the backend and frontend directories with the following variables

SUPABASE_URL=your-supabase-url

SUPABASE_ANON_KEY=your-supabase-anon-key

GEMINI_API_KEY=your-google-gemini-api-key

GEMINI_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent

### 🔧 Clone and Install

```bash
git clone https://github.com/AbhigyanPie/Meme-Hustler.git
cd Meme-Hustler
npm install

# Setup frontend
cd frontend
npm install
