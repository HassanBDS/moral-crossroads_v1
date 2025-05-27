import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gender: text("gender").notNull(),
  photoUrl: text("photo_url"),
  language: text("language").default("en"),
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
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  scenarioId: integer("scenario_id").notNull(),
  choice: text("choice").notNull(),
  playerId: integer("player_id"),
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

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;
export type Scenario = typeof scenarios.$inferSelect;
