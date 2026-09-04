# Gazi Fahim Hasan — Full-Stack SEO Portfolio

A high-performance, conversion-oriented portfolio web application engineered for **Gazi Fahim Hasan** (SEO Executive at Scaleup Ads Agency & B.Sc in Computer Science & Engineering graduate).

---

## 🌟 Key Highlights & Design System

- **Visual Aesthetics**: Inspired by top modern creative agency & SEO portfolios:
  - Deep Obsidian luxury dark palette (`#090A0F`) with sunset electric amber (`#FF6B00`) and neon status accents.
  - Floating 3D/glassmorphic analytics cards displaying Google Search Console metrics and ranking spikes.
  - Smooth interactive services drawer with hover expansion.
  - Seamless infinite marquee ticker highlighting technical proficiencies.
  - Animated impact counters (Organic traffic lift %, Top-3 keywords, Audits delivered, Client ROI).
  - Testimonial carousel featuring academic references (Sonargaon University CSE Head & Coordinator).
- **SEO-First Architecture**:
  - Semantic HTML5 heading hierarchy (single `<h1>`, logical `<h2>`/`<h3>` tags).
  - Rich `JSON-LD` structured data schemas (`Person`, `ProfessionalService`, `WebSite`).
  - OpenGraph & Twitter Cards metadata.
  - Valid `robots.txt` and `sitemap.xml`.
- **Full-Stack REST Backend**:
  - Express.js API powering live contact inquiries and free SEO audit request capture with client-side and server-side validation.
  - Local JSON persistence store (`backend/data/inquiries.json`).
  - Modular route structure (`/api/health`, `/api/profile`, `/api/case-studies`, `/api/contact`, `/api/audit-request`).

---

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── data/
│   │   ├── profile.json       # Gazi Fahim Hasan's structured CV details
│   │   ├── case-studies.json  # SEO case studies & organic growth metrics
│   │   └── inquiries.json     # Stored leads and audit submissions
│   ├── routes/
│   │   ├── api.js             # Profile, case studies, health check
│   │   └── contact.js         # Contact message & SEO audit handlers
│   ├── package.json           # express, cors, dotenv
│   └── server.js              # Express server (API + static client serving)
├── frontend/
│   ├── css/
│   │   ├── variables.css      # Design tokens (colors, typography, radii)
│   │   ├── style.css          # Layouts, glassmorphism, responsive grids
│   │   └── animations.css     # Keyframes, floating badges, marquee, transitions
│   ├── js/
│   │   ├── main.js            # UI behaviors, theme toggle, mobile nav, counters
│   │   └── api.js             # Async client communication with REST backend
│   ├── assets/
│   │   └── images/            # Showcase images and icons
│   ├── index.html             # Semantic page with JSON-LD Schema
│   ├── robots.txt             # Search crawler directives
│   └── sitemap.xml            # Sitemap index
├── package.json               # Root dev/start scripts
├── dev.sh                     # One-click launcher script
└── README.md
```

---

## 🚀 Getting Started

### 1. Launch the Application
Run either:
```bash
./dev.sh
```
or
```bash
npm run dev
```

### 2. Access the Application
- **Portfolio Website**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Profile Data**: [http://localhost:5000/api/profile](http://localhost:5000/api/profile)
- **Case Studies**: [http://localhost:5000/api/case-studies](http://localhost:5000/api/case-studies)

### 3. Open in Antigravity IDE
Open the folder `/home/gazifahimhasan/.gemini/antigravity-ide/scratch/portfolio` as your workspace to edit frontend and backend code seamlessly.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime and status check |
| `GET` | `/api/profile` | Structured profile, experience, skills, and references |
| `GET` | `/api/case-studies` | Curated SEO case studies and metrics |
| `POST` | `/api/contact` | Submit general inquiries & consultations |
| `POST` | `/api/audit-request` | Submit website URL for a free technical SEO audit |
| `GET` | `/api/inquiries` | Inspect stored inquiries (local development) |
