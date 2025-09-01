# PsyCare Web Application

A safe space to talk, listen, and heal. Welcome to the future of mental healthcare.

PsyCare is a web platform born from a simple yet powerful idea: everyone deserves a safe space to discuss their mental well-being without fear, judgment, or barriers. We are bridging the gap between those seeking help and the professionals who can provide it, creating a supportive ecosystem powered by technology and human empathy.

# About The Project
Mental health is a journey, and no one should have to walk it alone. Yet, many do. Stigma, high costs, and lack of access prevent countless individuals from taking the first step. PsyCare was created to dismantle these barriers. It’s an anonymous, accessible, and affordable platform where you can share your struggles, gain insights, and connect with qualified professionals in a way that feels right for you.

We're not just building an app; we're building a community dedicated to healing and understanding.

# ✨ Features That Set Us Apart
We designed PsyCare with you in mind, focusing on features that provide real comfort and tangible support.

# Speak Freely, Stay Anonymous
Tired of putting on a brave face? Here, you don’t have to. Post your thoughts and problems with the comfort of complete anonymity. Share what’s on your mind without your name, your face, or your history attached. It’s your story, told on your terms.

# Connect Face-to-Face with Live Video Calls
Sometimes, a human connection makes all the difference. Our new video calling feature allows you to have secure, private sessions with your chosen consultant. It’s the personalization of a traditional therapy session, available from the comfort and privacy of your own space.

# Instant Insights with AI
When you share a problem, our intelligent AI assistant gently offers suggestions by connecting you with similar, previously addressed issues. It’s like having a wise friend who provides immediate perspective while you await professional advice.

# Find Your Personal Guide
Ready for a deeper connection? Our subscription model lets you choose a preferred consultant and stick with them. Build a trusting relationship with a professional who understands your journey and is dedicated to your long-term growth.

# A Library of Wisdom at Your Fingertips
After a session, your consultant leaves detailed notes and summaries for you. This creates a personal library of advice and reflections that you can revisit anytime, helping you track your progress and reinforce what you’ve learned.

# Navigate by What Matters to You
Feeling overwhelmed by a specific issue? Our topic-based filters allow you to easily sort through community discussions and find the conversations that are most relevant to you, whether it's about anxiety, relationships, or work-related stress.

🛠️ Technology Stack

We use a modern and robust tech stack to ensure a secure, scalable, and seamless experience.

Frontend - React.js (Vite) , Tailwind CSS
Backend - Node.js	, Express.js
Database - MongoDB	
AI - LLM APIs (Gemini)
Video - Socket

Export to Sheets

🚀 Getting Started
Want to get the project up and running on your local machine? Just follow these simple steps.

Prerequisites:

Node.js (v14 or higher)

npm or yarn

A running instance of PostgreSQL

Installation:

Clone the repository:

Bash

git clone https://github.com/ZahidHasan7/Psycare.git

Navigate to the project directory:

Bash

cd psycare-project

Install dependencies for the frontend and backend:

Bash

# For the frontend
cd client
npm install

# For the backend
cd ../server
npm install
Set up your environment variables:
Create a .env file in the server directory and add your configuration details (database credentials, API keys, etc.).

DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_api_key
Run the application:

Bash

# Start the backend server
cd server
npm start

# Start the frontend development server
cd client
npm run dev
Your PsyCare application should now be running locally at http://localhost:5173!

🤝 How to Contribute
We believe in the power of collaboration. If you have an idea to improve PsyCare or want to fix a bug, we would love your help! Please feel free to fork the repository, make your changes, and submit a pull request.

Every contribution, no matter how small, helps us further our mission.

License
This project is licensed under the MIT License.  
