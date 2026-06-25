# TechSetu AI (Enterprise Edition) - Complete Portfolio Project

TechSetu AI is an enterprise-grade Career & Skill Bridge Platform designed to help students, developers, and job seekers (especially in regional/vernacular contexts in India) identify tech industry skill gaps, construct visual learning roadmaps, practice interviews in multiple languages (English, Hindi, Hinglish), and review resumes.

Built on the DevNexus enterprise blueprint, TechSetu AI models modern system architectural designs, incorporating independent UI layers, a Spring Boot Java API server, multiple databases (Postgres, Mongo, Redis), real-time WebSockets, and containerized deployment infrastructure.

---

## Architectural Topology

```text
               User Browser (React SPA)
                         │
                 Nginx (Port 80)
                /               \
        Static Assets         API Routes (/api/*)
        (frontend/dist)         (backend:8080)
                                      │
                         Spring Boot (Java 21 Core)
                               /      │      \
                   PostgreSQL      MongoDB    Redis
                   (JPA Data)      (Chats)   (Caching)
```

---

## Features Matrix

| Feature | Tech Stack Integration | Purpose |
| :--- | :--- | :--- |
| **Auth System** | Spring Security + JWT + Local Storage | Secured token authentication and registration routing. |
| **Skill Analyzer** | SVG Metrics Canvas + Spring Controller | Calculates a user's "Bridge Score" and identifies missing tech stacks. |
| **Learning Roadmap** | React Query + Recharts | Generates custom timelines with micro-quizzes and confetti rewards. |
| **Mock Interview** | Spring WebSockets + MongoDB Logs | Conversational training interface offering Hinglish/Hindi/English feedback. |
| **Resume Optimizer** | Real-time score check | Analyzes content structure, highlighting actionable advice. |
| **Caching Engine** | Spring Cache + Redis | Quick retrieval of static milestones and session caching. |

---

## Quick Start (Dockerized)

1. Open your terminal in the root directory.
2. Launch the entire application stack:
   ```bash
   docker-compose up --build -d
   ```
3. Open `http://localhost/` in your browser.

*For manual local dev instructions, see the [Setup & Deployment Guide](setup_guide.md).*
