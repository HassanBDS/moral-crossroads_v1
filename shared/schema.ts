import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gender: text("gender").notNull(),
  photoUrl: text("photo_url"),
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  level: integer("level").notNull(),
  title: text("title").notNull(),
  titleArabic: text("title_arabic"),
  description: text("description").notNull(),
  descriptionArabic: text("description_arabic"),
  choice1: text("choice1").notNull(),
  choice1Arabic: text("choice1_arabic"),
  choice2: text("choice2").notNull(),
  choice2Arabic: text("choice2_arabic"),
  type: text("type").notNull(),
  characterCount: integer("character_count").default(5),
  scenarioCategory: text("scenario_category").default("consequence"),
  svgData: json("svg_data"), // Store SVG references and animation data
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  scenarioId: integer("scenario_id").notNull(),
  choice: text("choice").notNull(),
  playerId: integer("player_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(players).pick({
  name: true,
  gender: true,
  photoUrl: true,
  language: true,
});

export const insertVoteSchema = createInsertSchema(votes).pick({
  scenarioId: true,
  choice: true,
  playerId: true,
});

export const insertScenarioSchema = createInsertSchema(scenarios).pick({
  level: true,
  title: true,
  titleArabic: true,
  description: true,
  descriptionArabic: true,
  choice1: true,
  choice1Arabic: true,
  choice2: true,
  choice2Arabic: true,
  type: true,
  characterCount: true,
  scenarioCategory: true,
  svgData: true,
  isActive: true,
});

export const insertAdminSchema = createInsertSchema(adminUsers).pick({
  username: true,
  email: true,
  passwordHash: true,
  role: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;
export type Scenario = typeof scenarios.$inferSelect;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
