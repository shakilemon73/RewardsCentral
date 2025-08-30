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

  // Task routes - Combined internal and external surveys
  app.get("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userAgent = req.get('User-Agent');
      const ipAddress = req.ip || req.connection.remoteAddress;
      
      // Get both internal tasks and external surveys
      const [internalTasks, externalSurveys] = await Promise.all([
        storage.getTasks(),
        storage.getExternalSurveys(userId, userAgent, ipAddress)
      ]);
      
      // Combine and format the results
      const allTasks = [
        ...internalTasks,
        ...externalSurveys.map(survey => ({
          id: survey.id,
          type: survey.type,
          title: survey.title,
          description: survey.description,
          points: survey.points,
          duration: survey.duration,
          category: survey.category,
          rating: survey.rating,
          isActive: survey.isActive,
          provider: survey.provider,
          entryUrl: survey.entryUrl,
          createdAt: new Date().toISOString(),
        }))
      ];
      
      res.json(allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:type", isAuthenticated, async (req: any, res) => {
    try {
      const { type } = req.params;
      const userId = req.user.claims.sub;
      const userAgent = req.get('User-Agent');
      const ipAddress = req.ip || req.connection.remoteAddress;
      
      // Get both internal tasks and external surveys by type
      const [internalTasks, externalSurveys] = await Promise.all([
        storage.getTasksByType(type),
        storage.getExternalSurveysByType(type, userId, userAgent, ipAddress)
      ]);
      
      // Combine and format the results
      const allTasks = [
        ...internalTasks,
        ...externalSurveys.map(survey => ({
          id: survey.id,
          type: survey.type,
          title: survey.title,
          description: survey.description,
          points: survey.points,
          duration: survey.duration,
          category: survey.category,
          rating: survey.rating,
          isActive: survey.isActive,
          provider: survey.provider,
          entryUrl: survey.entryUrl,
          createdAt: new Date().toISOString(),
        }))
      ];
      
      res.json(allTasks);
    } catch (error) {
      console.error("Error fetching tasks by type:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { taskId, pointsEarned } = req.body;
      
      // Check if this is an external survey (has provider prefix)
      const isExternalSurvey = taskId.includes('-') && ['cpx-', 'theorem-', 'bitlabs-'].some(prefix => taskId.startsWith(prefix));
      
      if (isExternalSurvey) {
        // For external surveys, just award points directly
        // In a real implementation, you would verify completion via webhooks/callbacks
        await storage.updateUserPoints(userId, pointsEarned);
        
        res.json({
          id: `completion-${Date.now()}`,
          userId,
          taskId,
          pointsEarned,
          completedAt: new Date(),
        });
      } else {
        // Handle internal tasks as before
        const completionData = insertUserTaskCompletionSchema.parse({
          taskId,
          pointsEarned,
          userId,
        });
        
        const completion = await storage.completeTask(completionData);
        res.json(completion);
      }
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

  // Survey provider webhook endpoints
  
  // CPX Research webhook
  app.post("/api/webhooks/cpx-research", async (req, res) => {
    try {
      const { status, user_id, transaction_id, reward } = req.body;
      
      if (status === 'completed' && user_id && reward) {
        const pointsEarned = Math.floor(parseFloat(reward) * 100); // Convert USD to points
        await storage.updateUserPoints(user_id, pointsEarned);
        
        console.log(`CPX Research: User ${user_id} earned ${pointsEarned} points`);
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error("CPX Research webhook error:", error);
      res.status(500).send('Error');
    }
  });
  
  // TheoremReach webhook
  app.post("/api/webhooks/theoremreach", async (req, res) => {
    try {
      const { user_id, reward_cents, transaction_id } = req.body;
      
      if (user_id && reward_cents) {
        const pointsEarned = Math.floor(reward_cents); // 1 cent = 1 point
        await storage.updateUserPoints(user_id, pointsEarned);
        
        console.log(`TheoremReach: User ${user_id} earned ${pointsEarned} points`);
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error("TheoremReach webhook error:", error);
      res.status(500).send('Error');
    }
  });
  
  // BitLabs webhook
  app.post("/api/webhooks/bitlabs", async (req, res) => {
    try {
      const { user_id, payout, type } = req.body;
      
      if (user_id && payout && type === 'survey_complete') {
        const pointsEarned = Math.floor(parseFloat(payout.usd) * 100); // Convert USD to points
        await storage.updateUserPoints(user_id, pointsEarned);
        
        console.log(`BitLabs: User ${user_id} earned ${pointsEarned} points`);
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error("BitLabs webhook error:", error);
      res.status(500).send('Error');
    }
  });
  
  // External survey redirect endpoint
  app.get("/api/survey/redirect/:surveyId", isAuthenticated, async (req: any, res) => {
    try {
      const { surveyId } = req.params;
      const userId = req.user.claims.sub;
      
      // For demo purposes, we'll redirect to the survey URL
      // In production, you would handle this properly with provider APIs
      let redirectUrl = '#';
      
      if (surveyId.startsWith('cpx-')) {
        redirectUrl = `https://offers.cpx-research.com/index.php?app_id=${process.env.CPX_RESEARCH_APP_ID}&ext_user_id=${userId}`;
      } else if (surveyId.startsWith('theorem-')) {
        redirectUrl = `https://theoremreach.com/respondent_entry/direct?api_key=${process.env.THEOREMREACH_API_KEY}&user_id=${userId}&transaction_id=${Date.now()}`;
      } else if (surveyId.startsWith('bitlabs-')) {
        redirectUrl = `https://web.bitlabs.ai/?token=${process.env.BITLABS_API_TOKEN}&uid=${userId}`;
      }
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Error redirecting to survey:", error);
      res.status(500).json({ message: "Failed to redirect to survey" });
    }
  });

  // Initialize sample data
  app.post("/api/init-data", isAuthenticated, async (req, res) => {
    try {
      // Create sample tasks (keeping a few internal ones for demo)
      const sampleTasks = [
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
        {
          type: "offer",
          title: "Sign up for Newsletter",
          description: "Subscribe to our partner's newsletter and earn points",
          points: 50,
          duration: "2 minutes",
          category: "Sign-ups",
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

      res.json({ 
        message: "Sample data initialized successfully", 
        note: "Real surveys are now loaded from CPX Research, TheoremReach, and BitLabs APIs" 
      });
    } catch (error) {
      console.error("Error initializing data:", error);
      res.status(500).json({ message: "Failed to initialize data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
