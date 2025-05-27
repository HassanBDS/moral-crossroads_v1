import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlayerSchema, insertVoteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new player
  app.post("/api/players", async (req, res) => {
    try {
      const playerData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(playerData);
      res.json(player);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get player by ID
  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.getPlayer(id);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get all scenarios
  app.get("/api/scenarios", async (req, res) => {
    try {
      const scenarios = await storage.getAllScenarios();
      res.json(scenarios);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get scenario by level
  app.get("/api/scenarios/level/:level", async (req, res) => {
    try {
      const level = parseInt(req.params.level);
      const scenario = await storage.getScenario(level);
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Submit a vote
  app.post("/api/votes", async (req, res) => {
    try {
      const voteData = insertVoteSchema.parse(req.body);
      const vote = await storage.createVote(voteData);
      res.json(vote);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get voting statistics for a scenario
  app.get("/api/scenarios/:scenarioId/stats", async (req, res) => {
    try {
      const scenarioId = parseInt(req.params.scenarioId);
      const stats = await storage.getVoteStats(scenarioId);
      
      const totalVotes = stats.reduce((sum, stat) => sum + stat.count, 0);
      const pullVotes = stats.find(s => s.choice === "pull")?.count || 0;
      const nothingVotes = stats.find(s => s.choice === "nothing")?.count || 0;
      
      const pullPercent = totalVotes > 0 ? Math.round((pullVotes / totalVotes) * 100) : 0;
      const nothingPercent = totalVotes > 0 ? Math.round((nothingVotes / totalVotes) * 100) : 0;

      res.json({
        pullPercent,
        nothingPercent,
        totalVotes,
        rawStats: stats
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
