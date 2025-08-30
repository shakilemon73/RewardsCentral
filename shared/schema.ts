import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  points: integer("points").default(0).notNull(),
  totalEarned: integer("total_earned").default(0).notNull(),
  tasksCompleted: integer("tasks_completed").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // 'survey', 'ad', 'offer'
  title: varchar("title").notNull(),
  description: text("description"),
  points: integer("points").notNull(),
  duration: varchar("duration"), // e.g., "15 minutes"
  category: varchar("category"), // e.g., "General audience", "Ages 18-35"
  rating: integer("rating").default(0), // 1-5 stars * 10 (so 48 = 4.8 stars)
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User task completions
export const userTaskCompletions = pgTable("user_task_completions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  taskId: varchar("task_id").notNull().references(() => tasks.id),
  pointsEarned: integer("points_earned").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Rewards table
export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  pointsCost: integer("points_cost").notNull(),
  value: varchar("value").notNull(), // e.g., "$10.00"
  category: varchar("category").notNull(), // e.g., "gift_card", "paypal"
  brand: varchar("brand").notNull(), // e.g., "Amazon", "Starbucks"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User reward redemptions
export const userRewardRedemptions = pgTable("user_reward_redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  rewardId: varchar("reward_id").notNull().references(() => rewards.id),
  pointsSpent: integer("points_spent").notNull(),
  status: varchar("status").default("pending"), // 'pending', 'processed', 'delivered'
  redeemedAt: timestamp("redeemed_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  taskCompletions: many(userTaskCompletions),
  rewardRedemptions: many(userRewardRedemptions),
}));

export const tasksRelations = relations(tasks, ({ many }) => ({
  completions: many(userTaskCompletions),
}));

export const userTaskCompletionsRelations = relations(userTaskCompletions, ({ one }) => ({
  user: one(users, {
    fields: [userTaskCompletions.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [userTaskCompletions.taskId],
    references: [tasks.id],
  }),
}));

export const rewardsRelations = relations(rewards, ({ many }) => ({
  redemptions: many(userRewardRedemptions),
}));

export const userRewardRedemptionsRelations = relations(userRewardRedemptions, ({ one }) => ({
  user: one(users, {
    fields: [userRewardRedemptions.userId],
    references: [users.id],
  }),
  reward: one(rewards, {
    fields: [userRewardRedemptions.rewardId],
    references: [rewards.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertUserTaskCompletionSchema = createInsertSchema(userTaskCompletions).omit({
  id: true,
  completedAt: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true,
});

export const insertUserRewardRedemptionSchema = createInsertSchema(userRewardRedemptions).omit({
  id: true,
  redeemedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UserTaskCompletion = typeof userTaskCompletions.$inferSelect;
export type InsertUserTaskCompletion = z.infer<typeof insertUserTaskCompletionSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type UserRewardRedemption = typeof userRewardRedemptions.$inferSelect;
export type InsertUserRewardRedemption = z.infer<typeof insertUserRewardRedemptionSchema>;
