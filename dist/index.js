// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  gameProgress;
  gameStats;
  currentUserId;
  currentProgressId;
  currentStatsId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.gameProgress = /* @__PURE__ */ new Map();
    this.gameStats = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
    this.currentStatsId = 1;
    const defaultUser = { id: 1, username: "player", password: "password" };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;
    const defaultStats = {
      id: 1,
      userId: 1,
      totalScore: 0,
      levelsCompleted: 0,
      hintsRemaining: 3
    };
    this.gameStats.set(1, defaultStats);
    this.currentStatsId = 2;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getGameProgress(userId, level) {
    return Array.from(this.gameProgress.values()).find(
      (progress) => progress.userId === userId && progress.level === level
    );
  }
  async getAllGameProgress(userId) {
    return Array.from(this.gameProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }
  async createGameProgress(insertProgress) {
    const id = this.currentProgressId++;
    const progress = {
      ...insertProgress,
      id,
      userId: insertProgress.userId || null,
      score: insertProgress.score || 0,
      completed: insertProgress.completed || false,
      hintsUsed: insertProgress.hintsUsed || 0,
      answeredQuestions: insertProgress.answeredQuestions || 0,
      gridState: insertProgress.gridState || null
    };
    this.gameProgress.set(id, progress);
    return progress;
  }
  async updateGameProgress(id, updates) {
    const existing = this.gameProgress.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.gameProgress.set(id, updated);
    return updated;
  }
  async getGameStats(userId) {
    return Array.from(this.gameStats.values()).find(
      (stats) => stats.userId === userId
    );
  }
  async createGameStats(insertStats) {
    const id = this.currentStatsId++;
    const stats = {
      ...insertStats,
      id,
      userId: insertStats.userId || null,
      totalScore: insertStats.totalScore || 0,
      levelsCompleted: insertStats.levelsCompleted || 0,
      hintsRemaining: insertStats.hintsRemaining || 3
    };
    this.gameStats.set(id, stats);
    return stats;
  }
  async updateGameStats(userId, updates) {
    const existing = Array.from(this.gameStats.values()).find(
      (stats) => stats.userId === userId
    );
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.gameStats.set(existing.id, updated);
    return updated;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  level: integer("level").notNull(),
  score: integer("score").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  hintsUsed: integer("hints_used").notNull().default(0),
  totalQuestions: integer("total_questions").notNull(),
  answeredQuestions: integer("answered_questions").notNull().default(0),
  gridState: jsonb("grid_state")
});
var gameStats = pgTable("game_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalScore: integer("total_score").notNull().default(0),
  levelsCompleted: integer("levels_completed").notNull().default(0),
  hintsRemaining: integer("hints_remaining").notNull().default(3)
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertGameProgressSchema = createInsertSchema(gameProgress).omit({
  id: true
});
var insertGameStatsSchema = createInsertSchema(gameStats).omit({
  id: true
});

// server/routes.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",
    // Ganti dengan email pengirim
    pass: "your-app-password"
    // Ganti dengan App Password Gmail
  }
});
async function registerRoutes(app2) {
  app2.get("/api/game-stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getGameStats(userId);
      if (!stats) {
        return res.status(404).json({ message: "Game stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.patch("/api/game-stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const updates = req.body;
      const stats = await storage.updateGameStats(userId, updates);
      if (!stats) {
        return res.status(404).json({ message: "Game stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/game-progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getAllGameProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/game-progress/:userId/:level", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const level = parseInt(req.params.level);
      const progress = await storage.getGameProgress(userId, level);
      if (!progress) {
        return res.status(404).json({ message: "Game progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/game-progress", async (req, res) => {
    try {
      const data = insertGameProgressSchema.parse(req.body);
      const existing = await storage.getGameProgress(data.userId, data.level);
      if (existing) {
        const updated = await storage.updateGameProgress(existing.id, data);
        return res.json(updated);
      }
      const progress = await storage.createGameProgress(data);
      res.status(201).json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });
  app2.patch("/api/game-progress/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const progress = await storage.updateGameProgress(id, updates);
      if (!progress) {
        return res.status(404).json({ message: "Game progress not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/send-score", async (req, res) => {
    try {
      const { username, level, score, timestamp } = req.body;
      if (!username || !level || !score) {
        return res.status(400).json({ message: "Missing data" });
      }
      const mailOptions = {
        from: "yourgmail@gmail.com",
        // Ganti dengan email pengirim
        to: "buypristine@gmail.com",
        subject: `Skor User: ${username} - Level ${level}`,
        text: `User: ${username}
Level: ${level}
Score: ${score}
Waktu: ${timestamp || (/* @__PURE__ */ new Date()).toISOString()}`
      };
      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to send email" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
