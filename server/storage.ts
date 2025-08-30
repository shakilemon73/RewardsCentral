import {
  users,
  tasks,
  rewards,
  userTaskCompletions,
  userRewardRedemptions,
  type User,
  type UpsertUser,
  type Task,
  type InsertTask,
  type Reward,
  type InsertReward,
  type UserTaskCompletion,
  type InsertUserTaskCompletion,
  type UserRewardRedemption,
  type InsertUserRewardRedemption,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import { surveyService, type ProviderSurvey } from "./surveyProviders";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPoints(userId: string, pointsChange: number): Promise<User>;
  
  // Task operations
  getTasks(): Promise<Task[]>;
  getTasksByType(type: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  
  // External survey provider operations
  getExternalSurveys(userId: string, userAgent?: string, ipAddress?: string): Promise<ProviderSurvey[]>;
  getExternalSurveysByType(type: string, userId: string, userAgent?: string, ipAddress?: string): Promise<ProviderSurvey[]>;
  
  // User task completion operations
  completeTask(completion: InsertUserTaskCompletion): Promise<UserTaskCompletion>;
  getUserTaskCompletions(userId: string): Promise<UserTaskCompletion[]>;
  getRecentActivities(userId: string, limit?: number): Promise<any[]>;
  
  // Reward operations
  getRewards(): Promise<Reward[]>;
  createReward(reward: InsertReward): Promise<Reward>;
  
  // User reward redemption operations
  redeemReward(redemption: InsertUserRewardRedemption): Promise<UserRewardRedemption>;
  getUserRedemptions(userId: string): Promise<UserRewardRedemption[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserPoints(userId: string, pointsChange: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        points: sql`points + ${pointsChange}`,
        totalEarned: pointsChange > 0 ? sql`total_earned + ${pointsChange}` : sql`total_earned`,
        tasksCompleted: pointsChange > 0 ? sql`tasks_completed + 1` : sql`tasks_completed`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.isActive, true));
  }

  async getTasksByType(type: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.type, type), eq(tasks.isActive, true)));
  }

  // External survey provider operations
  async getExternalSurveys(userId: string, userAgent?: string, ipAddress?: string): Promise<ProviderSurvey[]> {
    return await surveyService.getAllSurveys(userId, userAgent, ipAddress);
  }

  async getExternalSurveysByType(type: string, userId: string, userAgent?: string, ipAddress?: string): Promise<ProviderSurvey[]> {
    return await surveyService.getSurveysByType(type, userId, userAgent, ipAddress);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  // User task completion operations
  async completeTask(completion: InsertUserTaskCompletion): Promise<UserTaskCompletion> {
    const [newCompletion] = await db
      .insert(userTaskCompletions)
      .values(completion)
      .returning();
    
    // Update user points
    await this.updateUserPoints(completion.userId, completion.pointsEarned);
    
    return newCompletion;
  }

  async getUserTaskCompletions(userId: string): Promise<UserTaskCompletion[]> {
    return await db
      .select()
      .from(userTaskCompletions)
      .where(eq(userTaskCompletions.userId, userId))
      .orderBy(desc(userTaskCompletions.completedAt));
  }

  async getRecentActivities(userId: string, limit = 10): Promise<any[]> {
    const completions = await db
      .select({
        id: userTaskCompletions.id,
        type: sql`'task_completion'`.as('type'),
        title: tasks.title,
        taskType: tasks.type,
        pointsEarned: userTaskCompletions.pointsEarned,
        createdAt: userTaskCompletions.completedAt,
      })
      .from(userTaskCompletions)
      .innerJoin(tasks, eq(userTaskCompletions.taskId, tasks.id))
      .where(eq(userTaskCompletions.userId, userId))
      .orderBy(desc(userTaskCompletions.completedAt))
      .limit(limit);

    return completions;
  }

  // Reward operations
  async getRewards(): Promise<Reward[]> {
    return await db.select().from(rewards).where(eq(rewards.isActive, true));
  }

  async createReward(reward: InsertReward): Promise<Reward> {
    const [newReward] = await db.insert(rewards).values(reward).returning();
    return newReward;
  }

  // User reward redemption operations
  async redeemReward(redemption: InsertUserRewardRedemption): Promise<UserRewardRedemption> {
    const [newRedemption] = await db
      .insert(userRewardRedemptions)
      .values(redemption)
      .returning();
    
    // Deduct points from user
    await this.updateUserPoints(redemption.userId, -redemption.pointsSpent);
    
    return newRedemption;
  }

  async getUserRedemptions(userId: string): Promise<UserRewardRedemption[]> {
    return await db
      .select()
      .from(userRewardRedemptions)
      .where(eq(userRewardRedemptions.userId, userId))
      .orderBy(desc(userRewardRedemptions.redeemedAt));
  }
}

export const storage = new DatabaseStorage();
