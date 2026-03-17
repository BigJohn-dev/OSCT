# Open Source Contribution Tracker (OSCT)

A web application that helps developers track their open-source contributions, earn points, and engage with the community.

## Features

- 🧑 **User Profiles** – Create and manage profiles showcasing skills and contributions
- 📁 **Project Listings** – Explore curated open-source projects to contribute to
- 🔗 **Contribution Tracking** – Track via GitHub API or manually log contributions
- 🏆 **Points System** – Earn points with leaderboards for friendly competition
- 🎁 **Reward System** – Redeem points for courses, content, or mentorship
- 💬 **Community Engagement** – Forums, discussions, and challenges
- 🛠 **Admin Dashboard** – Manage projects, monitor contributions, adjust point system

## Tech Stack

- **Frontend**: React + React Router + Axios
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + GitHub OAuth
- **Styling**: Tailwind CSS

## Quick Start

### Prerequisites
- Node.js 14+
- MongoDB (local or Atlas)
- GitHub OAuth App credentials

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/osct.git
cd osct

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` in the root:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/osct
JWT_SECRET=your_super_secret_jwt_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
CLIENT_URL=http://localhost:3000
```

### 3. Run the App

```bash
# In /server
npm run dev

# In /client (separate terminal)
npm start
```

Visit `http://localhost:3000`

## API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users |
| POST | /api/users | Create user |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Get project by ID |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |

### Contributions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/contributions | Get all contributions |
| POST | /api/contributions | Log a contribution |
| GET | /api/contributions/:id | Get contribution by ID |
| PUT | /api/contributions/:id | Update contribution |
| DELETE | /api/contributions/:id | Delete contribution |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/auth/github | Start GitHub OAuth |
| GET | /api/auth/github/callback | GitHub OAuth callback |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |

## Points System

| Contribution Type | Points |
|-------------------|--------|
| Bug Fix | 10 |
| Feature Addition | 25 |
| Documentation | 5 |
| Code Review | 8 |
| Issue Report | 3 |
| Test Addition | 12 |

## License

MIT License — see [LICENSE](LICENSE)

