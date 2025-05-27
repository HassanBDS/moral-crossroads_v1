import { 
  players, 
  scenarios, 
  votes, 
  type Player, 
  type InsertPlayer, 
  type Vote, 
  type InsertVote, 
  type Scenario 
} from "@shared/schema";

export interface IStorage {
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  getScenario(level: number): Promise<Scenario | undefined>;
  getAllScenarios(): Promise<Scenario[]>;
  createVote(vote: InsertVote): Promise<Vote>;
  getVoteStats(scenarioId: number): Promise<{ choice: string; count: number }[]>;
}

export class MemStorage implements IStorage {
  private players: Map<number, Player>;
  private scenarios: Map<number, Scenario>;
  private votes: Map<number, Vote>;
  private currentPlayerId: number;
  private currentVoteId: number;

  constructor() {
    this.players = new Map();
    this.scenarios = new Map();
    this.votes = new Map();
    this.currentPlayerId = 1;
    this.currentVoteId = 1;

    // Initialize default scenarios
    this.initializeScenarios();
  }

  private initializeScenarios() {
    const defaultScenarios: Omit<Scenario, 'id'>[] = [
      {
        level: 1,
        title: "Basic Dilemma",
        description: "A trolley is heading towards 5 people. You can pull the lever to divert it to kill 1 person instead. What do you do?",
        type: "basic"
      },
      {
        level: 2,
        title: "Four People",
        description: "A trolley is heading towards 4 people. You can pull the lever to divert it to kill 1 person instead. What do you do?",
        type: "basic"
      },
      {
        level: 3,
        title: "Three People",
        description: "A trolley is heading towards 3 people. You can pull the lever to divert it to kill 1 person instead. What do you do?",
        type: "basic"
      },
      {
        level: 4,
        title: "Two People",
        description: "A trolley is heading towards 2 people. You can pull the lever to divert it to kill 1 person instead. What do you do?",
        type: "basic"
      },
      {
        level: 5,
        title: "One Person",
        description: "A trolley is heading towards 1 person. You can pull the lever to divert it to kill 1 different person instead. What do you do?",
        type: "basic"
      },
      {
        level: 6,
        title: "Fat Person",
        description: "A trolley is heading towards 5 people. You can push a large person off a bridge to stop the trolley, killing them but saving the 5. What do you do?",
        type: "fat_person"
      },
      {
        level: 7,
        title: "Loop Track",
        description: "A trolley is heading towards 5 people. You can divert it to a loop track where it will kill 1 person before returning to kill the original 5. What do you do?",
        type: "loop"
      },
      {
        level: 8,
        title: "Sleeping",
        description: "Oh no! A trolley is heading towards 5 people who are sleeping and won't feel pain. You can pull the lever to divert it to the other track, running over someone who is wide awake instead. What do you do?",
        type: "sleeping"
      }
    ];

    defaultScenarios.forEach((scenario, index) => {
      const id = index + 1;
      this.scenarios.set(id, { ...scenario, id });
    });
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = this.currentPlayerId++;
    const player: Player = { ...insertPlayer, id };
    this.players.set(id, player);
    return player;
  }

  async getScenario(level: number): Promise<Scenario | undefined> {
    return Array.from(this.scenarios.values()).find(s => s.level === level);
  }

  async getAllScenarios(): Promise<Scenario[]> {
    return Array.from(this.scenarios.values()).sort((a, b) => a.level - b.level);
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.currentVoteId++;
    const vote: Vote = { ...insertVote, id };
    this.votes.set(id, vote);
    return vote;
  }

  async getVoteStats(scenarioId: number): Promise<{ choice: string; count: number }[]> {
    const scenarioVotes = Array.from(this.votes.values()).filter(v => v.scenarioId === scenarioId);
    const stats = new Map<string, number>();
    
    scenarioVotes.forEach(vote => {
      stats.set(vote.choice, (stats.get(vote.choice) || 0) + 1);
    });

    return Array.from(stats.entries()).map(([choice, count]) => ({ choice, count }));
  }
}

export const storage = new MemStorage();
