# 📝 Taskhive

A full-stack collaboration platform for managing groups, tasks, and deadlines. Built with React, Firebase Firestore, and React-Bootstrap. Users can join or create groups, manage tasks, track deadlines, view analytics, and communicate with group members in real-time.

---

## 🚀 Features

- **User Authentication**
  - Registration and login with Firebase Authentication
  - Role-based access: Admin, Member, Pending
  - Secure login and session management


- **Group Management**
  - Create and join groups
  - Invite members or approve/decline join requests
  - Leave group with confirmation
  - Admin controls: remove members, manage requests, view all members


- **Task Management**
  - Add, update, and delete tasks
  - Track task progress (No progress, In progress, Finished)
  - View detailed task information
  - Assign tasks to groups with deadlines

- **Calendar & Deadlines**
  - View all tasks by due date
  - Click a date to see tasks due on that day

- **Analytics**
  - Graph of top 3 users who completed the most tasks in a group
  - Add restaurants with notes and optional ranking
  - Public and private list support (if extended)

- **Search & Invitations**
  - Search for groups by name
  - Send join requests or accept/decline invitations
  - Public and private list support (if extended)

- **Chat**
  - Real-time group chat with all members
---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, React-Bootstrap, CSS
- **Backend:** Firebase Firestore
- **Authentication:** Firebase Authentication


## 🏃 How to Run
### Installation
1️⃣ Clone the repository
```bash
git clone https://github.com/johnmartinroque/TaskHive.git
cd Taskhive
```

2️⃣ Install dependencies
```bash
#Frontend (React app)
cd main
npm install
```

3️⃣ Configure environment variables
```bash
# Inside the frontend folder, create a `.env` file with your project settings
REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
```


4️⃣ Start the frontend (React app)
```bash
#From the main folder:
npm start
```
