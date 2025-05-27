import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gender: text("gender").notNull(),
});

export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  level: integer("level").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
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
