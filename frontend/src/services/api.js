import axios from 'axios';

// Configure standard API base URL matching reverse proxy
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if JWT token exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ----------------------------------------------------
// DUAL-MODE LOGIC & SIMULATED DATABASE
// ----------------------------------------------------
const SIMULATE_DELAY = () => new Promise(resolve => setTimeout(resolve, 800));

// Local database mapping stored in localStorage to mock backend actions if offline
const getLocalData = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

const setLocalData = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// Heuristics lists
const MOCK_ROADMAPS = {
  "Frontend Developer": [
    { title: "Milestone 1: HTML & Advanced CSS", durationHours: 12, topics: "Flexbox, Grid, Responsive Design, CSS Custom Variables", completed: true, quizUnlocked: true, quiz: { id: 101, title: "HTML & CSS Gate", questions: [{ text: "Which CSS layout mode aligns children in rows or columns dynamically?", choices: ["Absolute positioning", "Flexbox layout", "Block elements", "Float wrap"], correctIndex: 1 }, { text: "What represents CSS variable syntax?", choices: ["$var", "--var-name", "var-name:", "@variable"], correctIndex: 1 }] } },
    { title: "Milestone 2: Modern JavaScript (ES6+)", durationHours: 18, topics: "Promises, Async/Await, Array methods, Modules", completed: false, quizUnlocked: true, quiz: { id: 102, title: "JavaScript Gate", questions: [{ text: "Which keyword defines block-scoped reassignable variables?", choices: ["var", "let", "const", "global"], correctIndex: 1 }, { text: "How do you handle asynchronous operations in ES8?", choices: ["Callbacks", "xmlHttpRequest", "Async/Await", "Event Loops"], correctIndex: 2 }] } },
    { title: "Milestone 3: React Fundamentals", durationHours: 24, topics: "Components, Props, State, Hooks (useState, useEffect)", completed: false, quizUnlocked: false, quiz: { id: 103, title: "React Gate", questions: [{ text: "What is JSX?", choices: ["A database format", "JavaScript XML syntax extension", "React rendering utility", "A stylesheet variant"], correctIndex: 1 }, { text: "Where should you fetch data in functional components?", choices: ["useState", "Inside the return block", "useEffect hook", "Component constructor"], correctIndex: 2 }] } },
    { title: "Milestone 4: State Management & Redux", durationHours: 15, topics: "Redux Toolkit, Store, Reducers, Actions", completed: false, quizUnlocked: false, quiz: { id: 104, title: "Redux Gate", questions: [{ text: "What handles state modification inside Redux?", choices: ["Actions", "Reducers", "Dispatchers", "Store variables"], correctIndex: 1 }, { text: "What is RTK shorthand for?", choices: ["React Template Kit", "Redux Toolkit", "React Typing Key", "Reactive Thread Kernel"], correctIndex: 1 }] } }
  ],
  "Backend Developer": [
    { title: "Milestone 1: Java 21 Basics", durationHours: 15, topics: "Variables, OOP, Streams, Record types", completed: true, quizUnlocked: true, quiz: { id: 201, title: "Java 21 Gate", questions: [{ text: "Which Java 16+ feature provides immutable data carriers?", choices: ["Interface", "Record class", "Enum type", "POJO class"], correctIndex: 1 }] } },
    { title: "Milestone 2: Spring Boot REST APIs", durationHours: 20, topics: "Controllers, Services, DI, Autowiring", completed: false, quizUnlocked: true, quiz: { id: 202, title: "Spring REST Gate", questions: [{ text: "Which annotation registers a REST endpoint class?", choices: ["@Controller", "@Service", "@RestController", "@Endpoint"], correctIndex: 2 }] } },
    { title: "Milestone 3: Database JPA & Postgres", durationHours: 18, topics: "Entities, Relations, Spring Data JPA Repositories", completed: false, quizUnlocked: false, quiz: { id: 203, title: "JPA Gate", questions: [{ text: "What defines database object mapping?", choices: ["@Entity", "@TableMap", "@JPAclass", "@Model"], correctIndex: 0 }] } },
    { title: "Milestone 4: Caching & Redis", durationHours: 12, topics: "Redis, Spring Cache, Keys, Expiry", completed: false, quizUnlocked: false, quiz: { id: 204, title: "Redis Gate", questions: [{ text: "What does Redis store data in?", choices: ["Disk storage", "Relational tables", "In-memory key-value maps", "XML collections"], correctIndex: 2 }] } }
  ]
};

// Fallback Services mapping local operations
export const AuthAPI = {
  login: async (username, password) => {
    try {
      const res = await api.post('/auth/signin', { username, password });
      const data = res.data;
      const userObj = {
        id: data.id,
        username: data.username,
        email: data.email,
        targetRole: data.targetRole || null,
        bridgeScore: data.bridgeScore || 0,
        roles: data.roles || ["ROLE_USER"]
      };
      return { token: data.token, user: userObj };
    } catch (e) {
      if (e.response && e.response.data) {
        throw new Error(e.response.data.message || "Invalid username or password");
      }
      // Offline fallback
      await SIMULATE_DELAY();
      const mockUsers = getLocalData('mock_users', {});
      if (mockUsers[username] && mockUsers[username].password === password) {
        const token = "mock-jwt-token-xyz-" + Date.now();
        const userObj = {
          id: mockUsers[username].id,
          username: username,
          email: mockUsers[username].email,
          targetRole: mockUsers[username].targetRole || null,
          bridgeScore: mockUsers[username].bridgeScore || 0,
          roles: ["ROLE_USER"]
        };
        return { token, user: userObj };
      }
      throw new Error("Invalid username or password");
    }
  },

  signup: async (username, email, password) => {
    try {
      const res = await api.post('/auth/signup', { username, email, password });
      return res.data;
    } catch (e) {
      if (e.response && e.response.data) {
        throw new Error(e.response.data.message || "Registration failed");
      }
      await SIMULATE_DELAY();
      const mockUsers = getLocalData('mock_users', {});
      if (mockUsers[username]) {
        throw new Error("Username already exists");
      }
      mockUsers[username] = { id: Date.now(), username, email, password, bridgeScore: 0 };
      setLocalData('mock_users', mockUsers);
      return { message: "User registered successfully!" };
    }
  },

  getProfile: async () => {
    try {
      const res = await api.get('/auth/profile');
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const user = getLocalData('user', null);
      if (user) return user;
      throw new Error("Unauthorized");
    }
  },

  socialLogin: async (provider, email, username) => {
    try {
      const res = await api.post('/auth/social-login', { provider, email, username });
      return res.data;
    } catch (e) {
      if (e.response && e.response.data) {
        throw new Error(e.response.data.message || "Social login failed.");
      }
      await SIMULATE_DELAY();
      // Mock OAuth login fallback
      const token = "mock-social-jwt-" + Date.now();
      const userObj = {
        id: Date.now(),
        username: username.toLowerCase().replace(/\s+/g, ""),
        email: email,
        targetRole: null,
        bridgeScore: 0,
        solvedCount: 0,
        streak: 0,
        roles: ["ROLE_USER"]
      };
      // Save simulated users in mock DB
      const mockUsers = getLocalData('mock_users', {});
      mockUsers[userObj.username] = { ...userObj, password: "oauth_simulated" };
      setLocalData('mock_users', mockUsers);
      return { token, user: userObj };
    }
  },

  forgotPassword: async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return res.data;
    } catch (e) {
      if (e.response && e.response.data) {
        throw new Error(e.response.data.message || "Failed to trigger password recovery.");
      }
      await SIMULATE_DELAY();
      const mockUsers = getLocalData('mock_users', {});
      const userExists = Object.values(mockUsers).some(u => u.email === email);
      if (!userExists && email !== "atulrana104@gmail.com") {
        throw new Error("Email address not registered.");
      }
      return { message: "OTP sent successfully. Sandbox dev OTP is: 123456" };
    }
  },

  resetPassword: async (email, otp, newPassword) => {
    try {
      const res = await api.post('/auth/reset-password', { email, otp, newPassword });
      return res.data;
    } catch (e) {
      if (e.response && e.response.data) {
        throw new Error(e.response.data.message || "Password reset failed.");
      }
      await SIMULATE_DELAY();
      if (otp !== "123456") {
        throw new Error("Invalid or expired OTP verification token.");
      }
      const mockUsers = getLocalData('mock_users', {});
      Object.keys(mockUsers).forEach(username => {
        if (mockUsers[username].email === email) {
          mockUsers[username].password = newPassword;
        }
      });
      setLocalData('mock_users', mockUsers);
      return { message: "Password has been reset successfully!" };
    }
  },

  getLeaderboard: async () => {
    try {
      const res = await api.get('/auth/leaderboard');
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const mockUsers = getLocalData('mock_users', {});
      const list = Object.values(mockUsers).map(u => ({
        username: u.username,
        solvedCount: u.solvedCount || 0,
        streak: u.streak || 0,
        bridgeScore: u.bridgeScore || 0,
        targetRole: u.targetRole || null
      }));
      // Add standard leaderboard developers for rich styling
      list.push({ username: "Aditi Sen", solvedCount: 42, streak: 12, bridgeScore: 62, targetRole: "React Developer" });
      list.push({ username: "Rohit Verma", solvedCount: 89, streak: 35, bridgeScore: 84, targetRole: "Kubernetes Administrator" });
      list.push({ username: "Siddharth Jain", solvedCount: 142, streak: 67, bridgeScore: 92, targetRole: "System Architect" });
      
      return list.sort((a, b) => b.solvedCount - a.solvedCount || b.bridgeScore - a.bridgeScore);
    }
  }
};

export const SkillsAPI = {
  analyze: async (targetRole, resumeText) => {
    try {
      const res = await api.post('/skills/analyze', { targetRole, resumeText });
      // Update local storage user profile if login is active
      const user = getLocalData('user', null);
      if (user) {
        const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        user.targetRole = targetRole;
        user.bridgeScore = parsed.bridgeScore || 0;
        setLocalData('user', user);
      }
      return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      // Heuristic offline analysis
      const score = Math.floor(Math.random() * 25) + 48; // 48 - 72
      let missing = ["TypeScript", "Docker", "Unit Testing", "CI/CD Pipelines", "System Design"];
      let acquired = ["JavaScript", "HTML/CSS", "Git", "REST APIs"];
      let summary = "Good core skills. Focus on expanding testing methodologies, static typing, and automated packaging workflows.";
      
      if (targetRole.toLowerCase().includes("front")) {
        missing = ["TypeScript", "Redux Toolkit", "Next.js", "Jest"];
        acquired = ["HTML5/CSS3", "JavaScript", "React basics"];
      } else if (targetRole.toLowerCase().includes("back")) {
        missing = ["Spring Security", "PostgreSQL", "Docker", "Redis"];
        acquired = ["Java", "SQL queries", "REST APIs"];
      }

      const analysis = { bridgeScore: score, missingSkills: missing, acquiredSkills: acquired, summary };
      
      const user = getLocalData('user', null);
      if (user) {
        user.targetRole = targetRole;
        user.bridgeScore = score;
        setLocalData('user', user);
      }
      return analysis;
    }
  }
};

export const RoadmapAPI = {
  getActive: async () => {
    try {
      const res = await api.get('/roadmaps');
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const activeRoadmap = getLocalData('active_roadmap', null);
      if (activeRoadmap) return activeRoadmap;
      return { message: "No active roadmap found. Please run skill gap analyzer." };
    }
  },

  generate: async (targetRole, missingSkills) => {
    try {
      const res = await api.post('/roadmaps/generate', { targetRole, missingSkills });
      setLocalData('active_roadmap', res.data);
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      // Generate simulated roadmap
      const base = MOCK_ROADMAPS[targetRole] || MOCK_ROADMAPS["Frontend Developer"];
      const milestones = base.map((m, idx) => ({
        ...m,
        id: idx + 1,
        completed: idx === 0, // complete first milestone
        quizUnlocked: idx <= 1, // unlock first and second quiz gates
      }));
      const roadmap = {
        id: Date.now(),
        targetRole,
        description: `Personalized learning roadmap designed to bridge the gaps to become a ${targetRole}.`,
        milestones
      };
      setLocalData('active_roadmap', roadmap);
      return roadmap;
    }
  },

  completeMilestone: async (milestoneId) => {
    try {
      const res = await api.post(`/roadmaps/milestones/${milestoneId}/complete`);
      setLocalData('active_roadmap', res.data);
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const roadmap = getLocalData('active_roadmap', null);
      if (roadmap) {
        roadmap.milestones = roadmap.milestones.map((m, idx) => {
          if (m.id === milestoneId) {
            m.completed = true;
            // unlock next quiz
            if (roadmap.milestones[idx + 1]) {
              roadmap.milestones[idx + 1].quizUnlocked = true;
            }
          }
          return m;
        });
        setLocalData('active_roadmap', roadmap);
      }
      return roadmap;
    }
  },

  submitQuiz: async (quizId, answers) => {
    try {
      const res = await api.post(`/roadmaps/quizzes/${quizId}/submit`, { answers });
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const roadmap = getLocalData('active_roadmap', null);
      let passed = true; // offline mock passes by default for easy testing
      if (roadmap) {
        roadmap.milestones = roadmap.milestones.map((m, idx) => {
          if (m.quiz && m.quiz.id === quizId) {
            m.quiz.passed = true;
            m.completed = true;
            if (roadmap.milestones[idx + 1]) {
              roadmap.milestones[idx + 1].quizUnlocked = true;
            }
          }
          return m;
        });
        setLocalData('active_roadmap', roadmap);
      }
      return { passed, correctCount: answers.length, totalQuestions: answers.length };
    }
  }
};

export const InterviewAPI = {
  getHistory: async () => {
    try {
      const res = await api.get('/interviews');
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      return getLocalData('interview_sessions', []);
    }
  },

  getMessages: async (sessionId) => {
    try {
      const res = await api.get(`/interviews/${sessionId}/messages`);
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const allMsgs = getLocalData('interview_messages', {});
      return allMsgs[sessionId] || [];
    }
  },

  start: async (targetRole, interviewType, language) => {
    try {
      const res = await api.post('/interviews/start', { targetRole, interviewType, language });
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const sessionId = "session-" + Date.now();
      const session = {
        id: sessionId,
        targetRole,
        interviewType,
        language,
        active: true,
        createdAt: new Date()
      };
      
      let greeting = "Hello and welcome to your TechSetu AI interview! Main aapka Technical interviewer hoon. Please tell me something about yourself and your tech stack.";
      if (language === 'HINDI') {
        greeting = "नमस्कार! TechSetu AI इंटरव्यू में आपका स्वागत है। मुझे अपने बारे में बताएं।";
      } else if (language === 'ENGLISH') {
        greeting = "Hello and welcome! I am your TechSetu AI interviewer today. To begin, please introduce yourself.";
      }

      const welcomeMsg = { id: "msg-0", sessionId, sender: "AI", content: greeting, timestamp: new Date() };
      
      // Save in mock list
      const sessions = getLocalData('interview_sessions', []);
      sessions.unshift(session);
      setLocalData('interview_sessions', sessions);

      const allMsgs = getLocalData('interview_messages', {});
      allMsgs[sessionId] = [welcomeMsg];
      setLocalData('interview_messages', allMsgs);

      return { session, welcomeMessage: welcomeMsg };
    }
  },

  sendMessage: async (sessionId, message) => {
    try {
      const res = await api.post(`/interviews/${sessionId}/message`, { message });
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const allMsgs = getLocalData('interview_messages', {});
      const sessionMsgs = allMsgs[sessionId] || [];

      // Save user message
      const userMsgObj = { id: "user-" + Date.now(), sessionId, sender: "USER", content: message, timestamp: new Date() };
      sessionMsgs.push(userMsgObj);

      // Generate AI response
      const sessions = getLocalData('interview_sessions', []);
      const currentSession = sessions.find(s => s.id === sessionId) || { language: 'HINGLISH', targetRole: 'Developer' };
      
      let reply = "Acha answer hai! Par concepts code metrics validation point se explain kijiye. How do you implement this in a real codebase?";
      if (currentSession.language === 'HINDI') {
        reply = "यह सही है। कृपया इसे थ्रेड सेफ्टी और डेटाबेस लेवल स्केलेबिलिटी के साथ समझाइए।";
      } else if (currentSession.language === 'ENGLISH') {
        reply = "That sounds reasonable. Follow-up: how would you optimize the performance of this system under high concurrent loads?";
      }

      const aiMsgObj = { id: "ai-" + Date.now(), sessionId, sender: "AI", content: reply, timestamp: new Date() };
      sessionMsgs.push(aiMsgObj);
      
      allMsgs[sessionId] = sessionMsgs;
      setLocalData('interview_messages', allMsgs);

      return aiMsgObj;
    }
  },

  end: async (sessionId) => {
    try {
      const res = await api.post(`/interviews/${sessionId}/end`);
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const sessions = getLocalData('interview_sessions', []);
      const sessionIdx = sessions.findIndex(s => s.id === sessionId);
      if (sessionIdx !== -1) {
        sessions[sessionIdx].active = false;
        sessions[sessionIdx].feedbackSummary = "### Offline Mock Interview Feedback\n\n**Overall Rating**: **8/10**\n\n#### Strengths\n- Direct answers to the core programming prompts.\n- Demonstrated robust understanding of MVC architecture.\n\n#### Recommendations\n- Expand on edge-case testing practices.\n- Incorporate more metrics when discussing performance benchmarks.";
        setLocalData('interview_sessions', sessions);
        return sessions[sessionIdx];
      }
      throw new Error("Session not found");
    }
  }
};

export const ResumeAPI = {
  optimize: async (content) => {
    try {
      const res = await api.post('/resumes/optimize', { content });
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      // Simple offline heuristic
      let score = 70;
      const improvements = [];
      const strengths = ["Good standard structure and section breakdowns."];

      if (!content.includes('%') && !content.includes('0')) {
        score -= 10;
        improvements.push("Incorporate quantitative metrics (e.g. 20% speed improvement, 1000+ active users) to demonstrate clear impact.");
      } else {
        strengths.push("Includes measurable results and impact numbers.");
      }

      if (!content.toLowerCase().includes('github.com')) {
        score -= 10;
        improvements.push("Add a link to your active GitHub account or open-source portfolios.");
      }

      return {
        score,
        strengths,
        improvements,
        generalAdvice: score < 80 
          ? "Ensure your project bullets focus on results achieved rather than lists of technologies used."
          : "Excellent resume baseline! Tailor these bullets with keywords specific to the job descriptions you apply for."
      };
    }
  }
};

export const BlogAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/blogs');
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      return getLocalData('mock_blogs', [
        {
          id: 1,
          title: "Optimizing JVM Garbage Collection for Latency-Sensitive Apps",
          content: "In high-throughput microservices, GC pauses can degrade API performance. Tuning G1GC parameters like MaxGCPauseMillis and upgrading to Java 21 Virtual Threads reduces latency substantially.",
          author: "system",
          likes: 4,
          comments: [
            { id: 101, author: "rohit_v", content: "Great read! Have you benchmarked ZGC as well?", createdAt: new Date() }
          ],
          createdAt: new Date(Date.now() - 3600000 * 2)
        },
        {
          id: 2,
          title: "Securing Frontend Apps against XSS & CSRF Vulnerabilities",
          content: "To secure React SPA applications: ensure cookies are HttpOnly and SameSite=Strict, enable strict Content Security Policies (CSP), and double check state tokens on write operations.",
          author: "admin",
          likes: 7,
          comments: [],
          createdAt: new Date(Date.now() - 3600000 * 24)
        }
      ]);
    }
  },

  create: async (title, content) => {
    try {
      const res = await api.post('/blogs', { title, content });
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const blogs = getLocalData('mock_blogs', []);
      const user = getLocalData('user', { username: 'currentUser' });
      const newBlog = {
        id: Date.now(),
        title,
        content,
        author: user.username,
        likes: 0,
        comments: [],
        createdAt: new Date()
      };
      blogs.unshift(newBlog);
      setLocalData('mock_blogs', blogs);
      return newBlog;
    }
  },

  like: async (blogId) => {
    try {
      const res = await api.post(`/blogs/${blogId}/like`);
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const blogs = getLocalData('mock_blogs', []);
      const updated = blogs.map(b => {
        if (b.id === blogId) {
          b.likes = (b.likes || 0) + 1;
        }
        return b;
      });
      setLocalData('mock_blogs', updated);
      return updated.find(b => b.id === blogId);
    }
  },

  addComment: async (blogId, content) => {
    try {
      const res = await api.post(`/blogs/${blogId}/comments`, { content });
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const blogs = getLocalData('mock_blogs', []);
      const user = getLocalData('user', { username: 'currentUser' });
      let updatedBlog = null;
      const updated = blogs.map(b => {
        if (b.id === blogId) {
          const newComment = {
            id: Date.now(),
            author: user.username,
            content,
            createdAt: new Date()
          };
          b.comments = b.comments || [];
          b.comments.push(newComment);
          updatedBlog = b;
        }
        return b;
      });
      setLocalData('mock_blogs', updated);
      return updatedBlog;
    }
  }
};

export const ProjectAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/projects');
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      return getLocalData('mock_projects', [
        {
          id: 1,
          name: "TechSetu AI System Integration",
          description: "End-to-end dashboard setup, model integration, and WebSocket event connections.",
          ownerId: 1,
          members: ["admin"],
          tasks: [
            { id: 1001, title: "Configure Docker containers", description: "Set up Compose configurations for Postgres, Mongo, and Redis.", status: "DONE", assignee: "admin" },
            { id: 1002, title: "Implement Spring JWT Filters", description: "Enforce OAuth2 token checks and security routing.", status: "IN_PROGRESS", assignee: "admin" },
            { id: 1003, title: "Design vernacular mock simulator", description: "Integrate Gemini models with language triggers.", status: "TODO", assignee: "admin" }
          ]
        }
      ]);
    }
  },

  create: async (name, description) => {
    try {
      const res = await api.post('/projects', { name, description });
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const projects = getLocalData('mock_projects', []);
      const user = getLocalData('user', { username: 'currentUser', id: 999 });
      const newProj = {
        id: Date.now(),
        name,
        description,
        ownerId: user.id,
        members: [user.username],
        tasks: []
      };
      projects.push(newProj);
      setLocalData('mock_projects', projects);
      return newProj;
    }
  },

  addTask: async (projectId, task) => {
    try {
      const res = await api.post(`/projects/${projectId}/tasks`, task);
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const projects = getLocalData('mock_projects', []);
      let updatedProj = null;
      const updated = projects.map(p => {
        if (p.id === projectId) {
          const newTask = {
            ...task,
            id: Date.now()
          };
          p.tasks = p.tasks || [];
          p.tasks.push(newTask);
          updatedProj = p;
        }
        return p;
      });
      setLocalData('mock_projects', updated);
      return updatedProj;
    }
  },

  updateTask: async (projectId, taskId, status, assignee) => {
    try {
      const res = await api.put(`/projects/${projectId}/tasks/${taskId}`, { status, assignee });
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const projects = getLocalData('mock_projects', []);
      let updatedProj = null;
      const updated = projects.map(p => {
        if (p.id === projectId) {
          p.tasks = p.tasks.map(t => {
            if (t.id === taskId) {
              if (status !== null) t.status = status;
              if (assignee !== null) t.assignee = assignee;
            }
            return t;
          });
          updatedProj = p;
        }
        return p;
      });
      setLocalData('mock_projects', updated);
      return updatedProj;
    }
  },

  invite: async (projectId, username) => {
    try {
      const res = await api.post(`/projects/${projectId}/invite`, { username });
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const projects = getLocalData('mock_projects', []);
      let updatedProj = null;
      const updated = projects.map(p => {
        if (p.id === projectId) {
          p.members = p.members || [];
          if (!p.members.includes(username)) {
            p.members.push(username);
          }
          updatedProj = p;
        }
        return p;
      });
      setLocalData('mock_projects', updated);
      return updatedProj;
    }
  }
};

export const AiAPI = {
  getHistory: async () => {
    try {
      const res = await api.get('/ai/chat/history');
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      return getLocalData('mock_ai_chats', []);
    }
  },

  ask: async (prompt) => {
    try {
      const res = await api.post('/ai/chat', { prompt });
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      const chats = getLocalData('mock_ai_chats', []);
      const newChat = {
        id: "chat-" + Date.now(),
        prompt,
        response: `This is a simulated AI Architect response answering: "${prompt}". To get real production-level designs, please start the TechSetu Spring Boot backend container.`,
        createdAt: new Date()
      };
      chats.push(newChat);
      setLocalData('mock_ai_chats', chats);
      return newChat;
    }
  },

  generateRoadmap: async (targetRole, skillsList) => {
    try {
      const res = await api.post('/roadmaps/generate', { targetRole, missingSkills: skillsList });
      return res.data;
    } catch (e) {
      return await RoadmapAPI.generate(targetRole, skillsList);
    }
  }
};

export const QuestionAPI = {
  submit: async (questionId, language, code) => {
    try {
      const res = await api.post('/questions/submit', { questionId, language, code });
      return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
    } catch (e) {
      if (e.response && e.response.data) {
        throw new Error(e.response.data.message || "Execution failed.");
      }
      await SIMULATE_DELAY();
      // Mock result evaluator fallback
      const mockRes = {
        passed: true,
        score: 100,
        stdout: "[Success] Compilation finished.\nTest Case 1: Passed\nTest Case 2: Passed\nTime: 12ms",
        details: "All 5 standard test cases passed successfully."
      };
      return mockRes;
    }
  },

  explain: async (questionId) => {
    try {
      const res = await api.post('/questions/explain', { questionId });
      return res.data;
    } catch (e) {
      await SIMULATE_DELAY();
      return { explanation: "Concept explanation simulation: This problem focuses on optimizing space/time bounds by utilizing maps or two pointers. Ideal time complexity is O(N) using a HashMap." };
    }
  }
};
