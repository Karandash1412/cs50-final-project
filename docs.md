# Chrome Analytics & YouTube Study Manager

A CS50x Final Project: a Chrome extension that tracks browsing activity, analyzes time spent on websites

The project combines **JavaScript, Chrome Extensions API, Flask, SQLite, and C**.

---

# 📌 Project Goal

The goal is to build a Chrome extension that helps users understand how they spend time online.

The extension will:

- Track time spent on websites
- Record browsing sessions
- Categorize websites
- Provide daily and weekly analytics
- Calculate a productivity score
- Provide a dashboard with statistics

The project will use **C as the analytics engine** for processing collected browsing data and calculating statistics.

---

# 🧰 Technologies

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| JavaScript            | Chrome extension logic        |
| HTML                  | Extension UI                  |
| CSS                   | Extension styling             |
| Chrome Extensions API | Browser interaction           |
| Python                | Backend                       |
| Flask                 | REST API                      |
| SQLite                | Database                      |
| C                     | Analytics and data processing |
| React                 | Optional dashboard upgrade    |
| Git/GitHub            | Version control               |
| GitHub Codespaces     | Development environment       |

---

# 🏗️ Architecture

```text
                         CHROME BROWSER
                               │
                               ▼
                 ┌─────────────────────────┐
                 │    Chrome Extension     │
                 │                         │
                 │  HTML / CSS / JavaScript│
                 └────────────┬────────────┘
                              │
                              │ HTTP / JSON
                              ▼
                 ┌─────────────────────────┐
                 │      Flask Backend     │
                 │                         │
                 │       Python            │
                 └────────────┬────────────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
        ┌─────────────────┐       ┌─────────────────┐
        │     SQLite      │       │   C Analytics   │
        │                 │       │                 │
        │ Raw session     │──────▶│ Data processing  │
        │ data            │       │ Statistics       │
        └─────────────────┘       │ Scoring          │
                                  └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │    Dashboard    │
                                  │                 │
                                  │ Statistics      │
                                  │ Charts          │
                                  │ Productivity    │
                                  └─────────────────┘
```

---

# 📁 Project Structure

The project will eventually look like this:

```text
cs50-final-project/
│
├── README.md
├── requirements.txt
├── .gitignore
│
├── extension/
│   │
│   ├── manifest.json
│   │
│   ├── background/
│   │   └── service-worker.js
│   │
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   │
│   ├── content/
│   │   └── content.js
│   │
│   ├── options/
│   │   ├── options.html
│   │   ├── options.css
│   │   └── options.js
│   │
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
│
├── backend/
│   │
│   ├── app.py
│   ├── config.py
│   │
│   ├── routes/
│   │   ├── analytics.py
│   │   ├── sessions.py
│   │   ├── websites.py
│   │   └── videos.py
│   │
│   ├── database/
│   │   ├── database.py
│   │   └── schema.sql
│   │
│   └── utils/
│       └── helpers.py
│
├── analytics/
│   ├── main.c
│   ├── analytics.c
│   ├── analytics.h
│   └── Makefile
│
├── database/
│   └── app.db
│
└── dashboard/
    ├── index.html
    ├── style.css
    └── script.js
```

> Do not create all these files immediately. Create them when you reach the corresponding development phase.

---

# 🔄 Data Flow

The most important concept in the project is how data moves through the application.

```text
User visits website
        │
        ▼
Chrome Extension
        │
        │ detects domain
        │ starts timer
        ▼
Service Worker
        │
        │ creates session
        ▼
Flask API
        │
        ▼
SQLite
        │
        │ stores raw data
        ▼
C Analytics
        │
        │ processes data
        ▼
Statistics
        │
        ▼
Flask API
        │
        ▼
Dashboard / Extension Popup
```

---

# 🧩 Part 1 — Chrome Extension

## Goal

Create an extension that can determine which website the user is currently using and track how long the user spends there.

---

## `manifest.json`

The Manifest V3 configuration file.

It will define:

- Extension name
- Version
- Icons
- Permissions
- Popup
- Service worker

Example structure:

```json
{
  "manifest_version": 3,
  "name": "Browser Analytics",
  "version": "1.0",
  "description": "Track and analyze browsing activity.",
  "permissions": ["tabs", "storage"],
  "background": {
    "service_worker": "background/service-worker.js"
  },
  "action": {
    "default_popup": "popup/popup.html"
  }
}
```

The exact permissions should be adjusted as the project develops.

---

# ⏱️ Part 2 — Website Time Tracking

## Main file

```text
extension/background/service-worker.js
```

This is the core of the extension.

It should:

1. Detect the active tab
2. Determine the domain
3. Start a session
4. Detect when the user changes tabs
5. Stop the previous session
6. Calculate the duration
7. Save the session
8. Eventually send it to Flask

---

## Example Session

User opens:

```text
github.com
```

At:

```text
10:00:00
```

The extension starts:

```text
domain = github.com
start = 10:00:00
```

The user switches to:

```text
youtube.com
```

At:

```text
10:25:00
```

The extension calculates:

```text
duration = 25 minutes
```

The session becomes:

```json
{
  "domain": "github.com",
  "start_time": "10:00:00",
  "end_time": "10:25:00",
  "duration": 1500
}
```

---

# 💾 Important: Store the Current Session

Do not rely only on a JavaScript variable such as:

```javascript
let currentSession = {};
```

Chrome Manifest V3 service workers can be suspended.

Use Chrome storage for important state.

Conceptually:

```text
chrome.storage.local
│
├── currentDomain
├── startTime
└── currentSession
```

This allows the extension to restore its state when necessary.

---

# 🖥️ Part 3 — Extension Popup

Directory:

```text
extension/popup/
```

### `popup.html`

Responsible for the interface.

Example:

```text
┌─────────────────────────────┐
│       Browser Analytics     │
├─────────────────────────────┤
│                             │
│ Today's Time                │
│ 4h 32m                      │
│                             │
│ Productivity                │
│ 78%                         │
│                             │
│ GitHub          1h 20m      │
│ YouTube          52m        │
│ CS50             48m        │
│ Reddit           32m        │
│                             │
│ [ Open Dashboard ]          │
└─────────────────────────────┘
```

### `popup.js`

Responsible for:

- Requesting statistics
- Updating the popup
- Communicating with the service worker
- Calling the Flask API

### `popup.css`

Responsible only for styling.

---

# 🌐 Part 4 — Flask Backend

Directory:

```text
backend/
```

The backend acts as the communication layer between the extension, database, and analytics system.

```text
Chrome Extension
       │
       ▼
      Flask
       │
       ├── SQLite
       │
       └── C Analytics
```

---

# `backend/app.py`

The main Flask application.

Responsibilities:

- Create Flask application
- Configure application
- Register routes
- Start server

Basic starting point:

```python
from flask import Flask

app = Flask(__name__)


@app.route("/")
def index():
    return "Browser Analytics API"


if __name__ == "__main__":
    app.run(debug=True)
```

---

# API Design

The extension will communicate with Flask using JSON.

---

## Sessions

```text
POST /api/sessions
```

Create a browsing session.

Example request:

```json
{
  "domain": "github.com",
  "start_time": "2026-08-15T10:00:00",
  "end_time": "2026-08-15T10:25:00",
  "duration": 1500
}
```

---

## Analytics

```text
GET /api/analytics/today
```

Return today's statistics.

```text
GET /api/analytics/week
```

Return weekly statistics.

```text
GET /api/analytics/websites
```

Return statistics grouped by website.

---

## Websites

```text
GET    /api/websites
POST   /api/websites
PUT    /api/websites/<id>
DELETE /api/websites/<id>
```

Used for managing website categories.

Example:

```text
github.com         → productive
cs50.harvard.edu   → productive
youtube.com        → neutral
reddit.com         → distracting
```

---

# 🗄️ Part 5 — SQLite Database

Database:

```text
database/app.db
```

Schema:

```text
backend/database/schema.sql
```

Start with three main tables.

---

## Websites

```sql
CREATE TABLE websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL
);
```

---

## Sessions

```sql
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    website_id INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    duration INTEGER NOT NULL,

    FOREIGN KEY (website_id)
        REFERENCES websites(id)
);
```

---

## Videos

```sql
CREATE TABLE videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    youtube_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT,
    watched INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
);
```

The database schema can evolve as the project grows.

---

# 🧠 Part 6 — C Analytics Engine

This is where C has a real purpose.

The Chrome extension **collects** the data.

C **analyzes** the data.

```text
JavaScript
    │
    │ Collect raw data
    ▼
SQLite
    │
    │ Data
    ▼
C
    │
    ├── Total time
    ├── Average session
    ├── Longest session
    ├── Most visited website
    ├── Productivity score
    └── Daily/weekly statistics
```

---

# C Project Structure

```text
analytics/
│
├── main.c
├── analytics.c
├── analytics.h
└── Makefile
```

---

## `analytics.h`

Function declarations.

Possible functions:

```c
double calculate_total_time(...);

double calculate_average_session(...);

int find_longest_session(...);

double calculate_productivity_score(...);
```

---

## `analytics.c`

Implementation of the analytics algorithms.

Example concept:

```text
Productive website     +1
Neutral website         0
Distracting website    -1
```

The algorithm can use:

```text
time × website category
```

to calculate a productivity score.

The exact algorithm is your design decision.

---

## `main.c`

Entry point.

Responsibilities:

- Load input
- Call analytics functions
- Display/output results

---

## `Makefile`

Used to compile the C application.

Eventually:

```bash
make
```

should compile the analytics program.

---

# 📊 Example C Output

Input:

```text
github.com          80 minutes
youtube.com         50 minutes
cs50.harvard.edu    60 minutes
reddit.com           30 minutes
```

Output:

```text
Total browsing time: 220 minutes

Longest session: 80 minutes

Average session: 55 minutes

Most visited website: github.com

Productivity score: 72%
```

---

# ▶️ Part 7 — YouTube Manager

The extension can detect when the current page is YouTube.

The first version should focus on **saving and organizing videos**.

Example flow:

```text
YouTube
   │
   ▼
Chrome Extension
   │
   │ "Save Video"
   ▼
Flask API
   │
   ▼
SQLite
```

---

# YouTube Features

### MVP

- [ ] Detect YouTube video
- [ ] Save video
- [ ] Store title
- [ ] Store URL
- [ ] List saved videos
- [ ] Mark video as watched

### Future

- [ ] Categories
- [ ] Tags
- [ ] Playlists
- [ ] Search
- [ ] Notes
- [ ] Watch progress

---

# 📈 Part 8 — Dashboard

Create:

```text
dashboard/
```

Initial version:

```text
dashboard/
├── index.html
├── style.css
└── script.js
```

The dashboard should display:

```text
Today's Activity
────────────────────────────

Total time       4h 32m
Productive       3h 10m
Distracting      1h 22m

Productivity     78%


Top Websites
────────────────────────────

GitHub           1h 20m
YouTube           52m
CS50              48m
Reddit            32m
```

---

# ⚛️ Optional React Upgrade

Do **not** start with React.

First build the application with normal HTML/CSS/JavaScript.

If the backend and extension work correctly, you can replace the dashboard with React.

```text
React
  │
  │ HTTP / JSON
  ▼
Flask API
  │
  ├── SQLite
  │
  └── C Analytics
```

React is an optional improvement, not a requirement for the MVP.

---

# 🔐 Privacy

Because the extension handles browsing information, privacy should be taken seriously.

The application should:

- Only collect the information necessary for analytics
- Avoid collecting page contents
- Avoid collecting passwords
- Avoid collecting form inputs
- Explain what data is stored
- Give the user a way to delete their data

The project should clearly document what information the extension collects.

---

# 🧪 Testing Strategy

Test each component separately.

## Chrome Extension

Test:

- [ ] Opening a new tab
- [ ] Switching tabs
- [ ] Changing URL
- [ ] Closing a tab
- [ ] Refreshing a page
- [ ] Browser restart
- [ ] Service worker restart

---

## Flask

Test:

- [ ] API receives JSON
- [ ] API validates data
- [ ] Data is stored
- [ ] Data can be retrieved
- [ ] Invalid requests are rejected

---

## SQLite

Test:

- [ ] Website insertion
- [ ] Session insertion
- [ ] Video insertion
- [ ] Queries
- [ ] Foreign keys

---

## C

Test:

- [ ] Empty data
- [ ] One session
- [ ] Multiple sessions
- [ ] Very long session
- [ ] Zero duration
- [ ] Different website categories

---

# 🛠️ Development Roadmap

## Phase 1 — GitHub + Codespaces

- [ ] Create GitHub repository
- [ ] Create Codespace
- [ ] Create project structure
- [ ] Create `.gitignore`
- [ ] Create `README.md`

---

## Phase 2 — Chrome Extension

- [ ] Create `manifest.json`
- [ ] Create popup
- [ ] Create service worker
- [ ] Detect active tab
- [ ] Detect domain
- [ ] Start session
- [ ] Stop session
- [ ] Calculate duration
- [ ] Store current session using Chrome storage

### Milestone

> The extension can correctly tell how long you spent on each website.

---

## Phase 3 — SQLite

- [ ] Create database
- [ ] Create schema
- [ ] Create websites table
- [ ] Create sessions table
- [ ] Test SQL queries

### Milestone

> Browsing sessions survive after the extension is closed.

---

## Phase 4 — Flask

- [ ] Create Flask application
- [ ] Connect SQLite
- [ ] Create session endpoint
- [ ] Create analytics endpoints
- [ ] Connect extension to Flask

### Milestone

```text
Extension → Flask → SQLite
```

works.

---

## Phase 5 — Analytics

- [ ] Total browsing time
- [ ] Average session
- [ ] Longest session
- [ ] Most visited website
- [ ] Daily statistics
- [ ] Weekly statistics
- [ ] Website categories
- [ ] Productivity score

### Milestone

> The application provides useful browsing analytics.

---

## Phase 6 — C

- [ ] Create `main.c`
- [ ] Create `analytics.c`
- [ ] Create `analytics.h`
- [ ] Create `Makefile`
- [ ] Read analytics data
- [ ] Implement calculations
- [ ] Implement productivity algorithm
- [ ] Connect C results to backend

### Milestone

> C is responsible for meaningful data processing and analytics.

---

## Phase 7 — YouTube

- [ ] Detect YouTube videos
- [ ] Save videos
- [ ] Store video metadata
- [ ] Create video list
- [ ] Add categories
- [ ] Add watched status

### Milestone

> Users can create their own YouTube study/media library.

---

## Phase 8 — Dashboard

- [ ] Create dashboard
- [ ] Display statistics
- [ ] Add charts
- [ ] Display saved videos
- [ ] Improve UI

---

## Phase 9 — React (Optional)

- [ ] Create React application
- [ ] Connect React to Flask
- [ ] Create components
- [ ] Create analytics charts
- [ ] Improve dashboard

---

## Phase 10 — Final Polish

- [ ] Fix bugs
- [ ] Test the entire application
- [ ] Improve error handling
- [ ] Improve UI
- [ ] Review security/privacy
- [ ] Clean up code
- [ ] Update README
- [ ] Prepare CS50 project video
- [ ] Prepare final submission

---

# 🚦 MVP

The minimum successful version should contain:

```text
Chrome Extension
       │
       ▼
Website Tracking
       │
       ▼
Flask
       │
       ▼
SQLite
       │
       ▼
C Analytics
       │
       ▼
Statistics
```

Required:

- [ ] Chrome extension works
- [ ] Website time is tracked
- [ ] Sessions are stored
- [ ] Flask API works
- [ ] SQLite works
- [ ] C performs meaningful analytics
- [ ] User can see statistics

Everything else is an enhancement.

---

# ⭐ Extra Features

Only work on these after the MVP works.

- [ ] YouTube manager
- [ ] Playlists
- [ ] Tags
- [ ] Notes
- [ ] Productivity goals
- [ ] Daily streaks
- [ ] Notifications
- [ ] Website blocking
- [ ] React dashboard
- [ ] User accounts
- [ ] Data export
- [ ] Dark mode

---

# 🔀 Git Workflow

Commit regularly.

Example:

```bash
git add .
git commit -m "Create Chrome extension"
git push
```

Suggested commits:

```text
Create project structure
Create Chrome extension manifest
Add active tab tracking
Add session tracking
Add Chrome storage
Create SQLite database
Create Flask API
Connect extension to Flask
Add analytics endpoints
Add C analytics engine
Add YouTube manager
Create dashboard
Improve UI
Fix bugs
Prepare final submission
```

---

# 💻 Development Environment

The project can be developed using **GitHub Codespaces**.

```text
GitHub Repository
        │
        ▼
GitHub Codespace
        │
        ├── JavaScript
        ├── Python
        ├── C
        └── SQLite
```

The Chrome extension itself will still need to be tested in your local Chrome browser.

Typical workflow:

```text
1. Code in Codespace
2. Run Flask in Codespace
3. Load extension into local Chrome
4. Test extension
5. Fix code
6. git commit
7. git push
```

---

# 🎓 CS50x Objective

This project should demonstrate understanding of:

- C
- Algorithms
- Data structures
- Python
- SQL
- HTML
- CSS
- JavaScript
- APIs
- Databases
- Web development
- Software architecture
- Debugging
- Git/version control

The goal is not to make the largest possible application.

The goal is to build something that **you understand and can explain**.

---

# 🏁 Final Goal

The finished application should allow a user to:

```text
                    Browser
                       │
                       ▼
              Chrome Extension
                       │
              ┌────────┴────────┐
              ▼                 ▼
        Track Websites     Save YouTube
              │                 │
              └────────┬────────┘
                       ▼
                    Flask
                       │
                       ▼
                    SQLite
                       │
                       ▼
                 C Analytics
                       │
                       ▼
                  Dashboard
```

### Final concept

> **JavaScript collects the browsing data. Flask manages the application. SQLite stores the data. C analyzes the data. The dashboard presents the results.**

---

# 📌 Current Status

## Project Setup

- [ ] GitHub repository
- [ ] Codespace
- [ ] Folder structure
- [ ] README

## Chrome Extension

- [ ] Manifest
- [ ] Popup
- [ ] Service worker
- [ ] Tab detection
- [ ] Session tracking
- [ ] Persistent session state

## Backend

- [ ] Flask
- [ ] API
- [ ] SQLite
- [ ] Database queries

## C

- [ ] Analytics engine
- [ ] Statistics
- [ ] Productivity algorithm
- [ ] Flask integration

## YouTube

- [ ] Save videos
- [ ] Organize videos
- [ ] Watched status

## Dashboard

- [ ] Basic dashboard
- [ ] Charts
- [ ] Optional React version

## Final

- [ ] Testing
- [ ] Documentation
- [ ] Demo
- [ ] CS50 submission
