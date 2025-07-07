import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameProgressSchema, insertGameStatsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get game stats for a user
  app.get("/api/game-stats/:userId", async (req, res) => {
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

  // Update game stats
  app.patch("/api/game-stats/:userId", async (req, res) => {
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

  // Get all game progress for a user
  app.get("/api/game-progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getAllGameProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get specific level progress
  app.get("/api/game-progress/:userId/:level", async (req, res) => {
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

  // Create or update game progress
  app.post("/api/game-progress", async (req, res) => {
    try {
      const data = insertGameProgressSchema.parse(req.body);
      
      // Check if progress already exists
      const existing = await storage.getGameProgress(data.userId!, data.level);
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

  // Update game progress
  app.patch("/api/game-progress/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const progress = await storage.updateGameProgress(id, updates);
      if (!progress) {
        return res.status(404).json({ message: "Game progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
