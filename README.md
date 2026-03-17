# Open Source Contribution Tracker (OSCT)

> Track your open-source contributions, earn points, climb leaderboards, and redeem real rewards.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | https://osct.vercel.app |
| **Backend API** | https://osct-api.onrender.com |
| **Health Check** | https://osct-api.onrender.com/health |

---

## ✨ Features

- 🔐 **GitHub OAuth** — One-click sign in with your GitHub account via Passport.js and JWT
- 🧑 **User Profiles** — Showcase your skills, badges, and contribution history
- 📁 **Project Listings** — Browse curated open-source projects filtered by difficulty, language, and category
- 🤝 **Contribution Tracking** — Log pull requests, bug fixes, docs, reviews, and more
- 🏆 **Points System** — Earn points automatically based on contribution type
- 🎖️ **Badge System** — Unlock achievement badges as your points grow
- 📊 **Leaderboard** — Compete with all-time, monthly, and weekly rankings
- 🎁 **Rewards Store** — Redeem points for course discounts, mentorship, and swag
- 🛠️ **Admin Dashboard** — Review contributions, manage projects, and fulfill redemptions
- 🔒 **Role-based Access** — User, Moderator, and Admin roles with protected routes

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Axios |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB Atlas (Mongoose) |
| **Authentication** | GitHub OAuth 2.0, Passport.js, JWT |
| **Styling** | Vanilla CSS with CSS variables (dark theme) |
| **Security** | Helmet, express-rate-limit, express-validator |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

---

## 📁 Project Structure

```
osct/
├── client/                          # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ProjectCard.js
│   │   │   ├── ContributionCard.js
│   │   │   └── Pagination.js
│   │   ├── context/
│   │   │   └── AuthContext.js       # JWT auth state management
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── AuthCallbackPage.js
│   │   │   ├── ProjectsPage.js
│   │   │   ├── ProjectDetailPage.js
│   │   │   ├── ContributionsPage.js
│   │   │   ├── LeaderboardPage.js
│   │   │   ├── RewardsPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── AdminDashboardPage.js
│   │   │   └── NotFoundPage.js
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + service modules
│   │   ├── App.js                   # Routes + protected route guards
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles + CSS variables
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   ├── passport.js              # GitHub OAuth strategy
│   │   └── points.js                # Points + badges + rewards config
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   └── contributionController.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT protect + role guards
│   │   └── validate.js              # express-validator helper
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Contribution.js
│   │   └── Redemption.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── projects.js
│   │   ├── contributions.js
│   │   ├── leaderboard.js
│   │   └── rewards.js
│   ├── app.js                       # Express app entry point
│   └── package.json
│
├── .env.example                     # Environment variable template
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 14+
- MongoDB running locally **or** a MongoDB Atlas account
- A GitHub OAuth App

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/osct.git
cd osct
```

### 2. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Set up environment variables

Create `server/.env`:

```dotenv
PORT=5000
MONGODB_URI=mongodb://localhost:27017/osct
JWT_SECRET=generate_with_node_crypto
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Create `client/.env`:

```dotenv
REACT_APP_API_URL=http://localhost:5000
```

> **Generate a JWT secret** by running:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

> **Get GitHub OAuth credentials** at https://github.com/settings/developers → New OAuth App
> Set the callback URL to: `http://localhost:5000/api/auth/github/callback`

### 4. Run the app

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm start
```

Visit **http://localhost:3000** 🎉

---

## ☁️ Deployment

### Backend → Render

| Setting | Value |
|---------|-------|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `node app.js` |
| Instance Type | Free |

**Environment variables to set on Render:**
```
MONGODB_URI          → your Atlas connection string
JWT_SECRET           → your generated secret
GITHUB_CLIENT_ID     → your GitHub OAuth client ID
GITHUB_CLIENT_SECRET → your GitHub OAuth client secret
CLIENT_URL           → https://your-app.vercel.app
NODE_ENV             → production
```

### Frontend → Vercel

| Setting | Value |
|---------|-------|
| Root Directory | `client` |
| Framework | Create React App |
| Build Command | `npm run build` |
| Output Directory | `build` |

**Environment variables to set on Vercel:**
```
REACT_APP_API_URL → https://your-api.onrender.com
```

### After deploying both:
1. Update the GitHub OAuth App callback URL to `https://your-api.onrender.com/api/auth/github/callback`
2. Update `CLIENT_URL` on Render to your actual Vercel URL
3. Verify the backend is live at `https://your-api.onrender.com/health`

> ⚠️ **Render free tier** spins down after 15 min of inactivity. Use [UptimeRobot](https://uptimerobot.com) to ping `/health` every 10 minutes and keep it awake for free.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/github` | Initiate GitHub OAuth |
| GET | `/api/auth/github/callback` | GitHub OAuth callback |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | Public | Get all users (paginated) |
| GET | `/api/users/:id` | Public | Get user by ID |
| PUT | `/api/users/:id` | Owner/Admin | Update user profile |
| DELETE | `/api/users/:id` | Admin | Deactivate user |
| GET | `/api/users/:id/contributions` | Public | Get user's contributions |

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | Public | Get all projects (filtered) |
| GET | `/api/projects/featured` | Public | Get featured projects |
| GET | `/api/projects/:id` | Public | Get project by ID |
| POST | `/api/projects` | Moderator | Create project |
| PUT | `/api/projects/:id` | Moderator | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| POST | `/api/projects/:id/sync` | Moderator | Sync stats from GitHub |

### Contributions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/contributions` | Public | Get all contributions |
| GET | `/api/contributions/:id` | Public | Get contribution by ID |
| POST | `/api/contributions` | User | Log a new contribution |
| PUT | `/api/contributions/:id` | Owner | Update contribution |
| DELETE | `/api/contributions/:id` | Owner/Admin | Delete contribution |
| PUT | `/api/contributions/:id/review` | Moderator | Approve or reject |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Get ranked users (`?period=all\|month\|week`) |
| GET | `/api/leaderboard/stats` | Get community-wide stats |

### Rewards
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/rewards` | Public | List all rewards |
| POST | `/api/rewards/redeem` | User | Redeem points for a reward |
| GET | `/api/rewards/my-redemptions` | User | Get redemption history |
| GET | `/api/rewards/all-redemptions` | Admin | Get all redemptions |

---

## 🏅 Points System

| Contribution Type | Points |
|-------------------|--------|
| 🐛 Bug Fix | 10 |
| ✨ Feature Addition | 25 |
| 📝 Documentation | 5 |
| 👀 Code Review | 8 |
| 🔍 Issue Report | 3 |
| 🧪 Test Addition | 12 |
| 🌐 Translation | 7 |
| 🎨 Design | 15 |

## 🎖️ Badges

| Badge | Requirement |
|-------|-------------|
| 🌱 First Contribution | Earn your first point |
| ⭐ Getting Started | Reach 50 points |
| 🔥 Active Contributor | Reach 200 points |
| 🦸 Open Source Hero | Reach 500 points |
| 👑 Legend | Reach 1,000 points |

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

Have questions or suggestions? Open an issue on GitHub or reach out at your-email@example.com.

---

<p align="center">Built with ❤️ for the open-source community</p>
