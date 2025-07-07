import { users, gameProgress, gameStats, type User, type InsertUser, type GameProgress, type InsertGameProgress, type GameStats, type InsertGameStats } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getGameProgress(userId: number, level: number): Promise<GameProgress | undefined>;
  getAllGameProgress(userId: number): Promise<GameProgress[]>;
  createGameProgress(progress: InsertGameProgress): Promise<GameProgress>;
  updateGameProgress(id: number, progress: Partial<GameProgress>): Promise<GameProgress | undefined>;
  
  getGameStats(userId: number): Promise<GameStats | undefined>;
  createGameStats(stats: InsertGameStats): Promise<GameStats>;
  updateGameStats(userId: number, stats: Partial<GameStats>): Promise<GameStats | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameProgress: Map<number, GameProgress>;
  private gameStats: Map<number, GameStats>;
  private currentUserId: number;
  private currentProgressId: number;
  private currentStatsId: number;

  constructor() {
    this.users = new Map();
    this.gameProgress = new Map();
    this.gameStats = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
    this.currentStatsId = 1;

    // Create a default user for demo purposes
    const defaultUser: User = { id: 1, username: "player", password: "password" };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;

    // Create default game stats
    const defaultStats: GameStats = {
      id: 1,
      userId: 1,
      totalScore: 0,
      levelsCompleted: 0,
      hintsRemaining: 3,
    };
    this.gameStats.set(1, defaultStats);
    this.currentStatsId = 2;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGameProgress(userId: number, level: number): Promise<GameProgress | undefined> {
    return Array.from(this.gameProgress.values()).find(
      (progress) => progress.userId === userId && progress.level === level
    );
  }

  async getAllGameProgress(userId: number): Promise<GameProgress[]> {
    return Array.from(this.gameProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async createGameProgress(insertProgress: InsertGameProgress): Promise<GameProgress> {
    const id = this.currentProgressId++;
    const progress: GameProgress = { ...insertProgress, id };
    this.gameProgress.set(id, progress);
    return progress;
  }

  async updateGameProgress(id: number, updates: Partial<GameProgress>): Promise<GameProgress | undefined> {
    const existing = this.gameProgress.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.gameProgress.set(id, updated);
    return updated;
  }

  async getGameStats(userId: number): Promise<GameStats | undefined> {
    return Array.from(this.gameStats.values()).find(
      (stats) => stats.userId === userId
    );
  }

  async createGameStats(insertStats: InsertGameStats): Promise<GameStats> {
    const id = this.currentStatsId++;
    const stats: GameStats = { ...insertStats, id };
    this.gameStats.set(id, stats);
    return stats;
  }

  async updateGameStats(userId: number, updates: Partial<GameStats>): Promise<GameStats | undefined> {
    const existing = Array.from(this.gameStats.values()).find(
      (stats) => stats.userId === userId
    );
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.gameStats.set(existing.id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
