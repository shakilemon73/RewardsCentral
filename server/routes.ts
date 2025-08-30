import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { insertUserTaskCompletionSchema, insertUserRewardRedemptionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Task routes
  app.get("/api/tasks", isAuthenticated, async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:type", isAuthenticated, async (req, res) => {
    try {
      const { type } = req.params;
      const tasks = await storage.getTasksByType(type);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks by type:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const completionData = insertUserTaskCompletionSchema.parse({
        ...req.body,
        userId,
      });
      
      const completion = await storage.completeTask(completionData);
      res.json(completion);
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Failed to complete task" });
    }
  });

  // Activity routes
  app.get("/api/activities", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activities = await storage.getRecentActivities(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Reward routes
  app.get("/api/rewards", isAuthenticated, async (req, res) => {
    try {
      const rewards = await storage.getRewards();
      res.json(rewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });

  app.post("/api/rewards/redeem", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const redemptionData = insertUserRewardRedemptionSchema.parse({
        ...req.body,
        userId,
      });
      
      // Check if user has enough points
      const user = await storage.getUser(userId);
      if (!user || user.points < redemptionData.pointsSpent) {
        return res.status(400).json({ message: "Insufficient points" });
      }
      
      const redemption = await storage.redeemReward(redemptionData);
      res.json(redemption);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      res.status(500).json({ message: "Failed to redeem reward" });
    }
  });

  app.get("/api/redemptions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const redemptions = await storage.getUserRedemptions(userId);
      res.json(redemptions);
    } catch (error) {
      console.error("Error fetching redemptions:", error);
      res.status(500).json({ message: "Failed to fetch redemptions" });
    }
  });

  // Initialize sample data
  app.post("/api/init-data", isAuthenticated, async (req, res) => {
    try {
      // Create sample tasks
      const sampleTasks = [
        {
          type: "survey",
          title: "Consumer Preferences Study",
          description: "Share your shopping preferences to help brands improve their products",
          points: 150,
          duration: "15 minutes",
          category: "General audience",
          rating: 48,
          isActive: true,
        },
        {
          type: "survey",
          title: "Shopping Habits Survey",
          description: "Tell us about your online shopping behavior",
          points: 100,
          duration: "10 minutes", 
          category: "Ages 18-35",
          rating: 42,
          isActive: true,
        },
        {
          type: "survey",
          title: "Technology Usage Study",
          description: "How do you use technology in your daily life?",
          points: 200,
          duration: "20 minutes",
          category: "Tech enthusiasts",
          rating: 49,
          isActive: true,
        },
        {
          type: "ad",
          title: "Mobile Game Ad",
          description: "Watch a 30-second ad for a new mobile game",
          points: 10,
          duration: "30 seconds",
          category: "Gaming",
          rating: 0,
          isActive: true,
        },
        {
          type: "ad",
          title: "Product Demo",
          description: "Watch a product demonstration video",
          points: 10,
          duration: "45 seconds",
          category: "Products",
          rating: 0,
          isActive: true,
        },
      ];

      for (const task of sampleTasks) {
        await storage.createTask(task);
      }

      // Create sample rewards
      const sampleRewards = [
        {
          title: "Amazon Gift Card",
          description: "Digital delivery within 24 hours",
          pointsCost: 1000,
          value: "$10.00",
          category: "gift_card",
          brand: "Amazon",
          isActive: true,
        },
        {
          title: "Starbucks Gift Card",
          description: "Perfect for your morning coffee",
          pointsCost: 500,
          value: "$5.00",
          category: "gift_card", 
          brand: "Starbucks",
          isActive: true,
        },
        {
          title: "PayPal Cash",
          description: "Instant transfer to your account",
          pointsCost: 2000,
          value: "$20.00",
          category: "paypal",
          brand: "PayPal",
          isActive: true,
        },
        {
          title: "Netflix Gift Card",
          description: "Stream your favorite shows",
          pointsCost: 1500,
          value: "$15.00",
          category: "gift_card",
          brand: "Netflix",
          isActive: true,
        },
        {
          title: "App Store Gift Card",
          description: "Apps, games, and more",
          pointsCost: 2500,
          value: "$25.00",
          category: "gift_card",
          brand: "Apple",
          isActive: true,
        },
      ];

      for (const reward of sampleRewards) {
        await storage.createReward(reward);
      }

      res.json({ message: "Sample data initialized successfully" });
    } catch (error) {
      console.error("Error initializing data:", error);
      res.status(500).json({ message: "Failed to initialize data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
