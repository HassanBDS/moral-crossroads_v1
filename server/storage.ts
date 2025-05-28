import { 
  players, 
  scenarios, 
  votes,
  adminUsers,
  type Player, 
  type InsertPlayer, 
  type Vote, 
  type InsertVote, 
  type Scenario,
  type InsertScenario,
  type AdminUser,
  type InsertAdmin
} from "@shared/schema";
import bcrypt from 'bcryptjs';

export interface IStorage {
  // Player management
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayerPhoto(id: number, photoUrl: string): Promise<Player | undefined>;
  getAllPlayers(): Promise<Player[]>;
  
  // Scenario management
  getScenario(level: number): Promise<Scenario | undefined>;
  getAllScenarios(): Promise<Scenario[]>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;
  updateScenario(id: number, scenario: Partial<InsertScenario>): Promise<Scenario | undefined>;
  deleteScenario(id: number): Promise<boolean>;
  
  // Voting system
  createVote(vote: InsertVote): Promise<Vote>;
  getVoteStats(scenarioId: number): Promise<{ choice: string; count: number }[]>;
  
  // Admin management
  createAdmin(admin: InsertAdmin): Promise<AdminUser>;
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  authenticateAdmin(username: string, password: string): Promise<AdminUser | null>;
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
        title: "The Unseen Consequence",
        titleArabic: "العواقب الخفية",
        description: "A group of 5 innocent people are unknowingly trapped in a collapsing structure. You have two large buttons before you. Pressing the GREEN button will instantly save them, but it will also unleash a plague that will slowly affect 1 other innocent person elsewhere in the world, causing them prolonged suffering before death. Pressing the RED button does nothing, leaving the 5 people to die instantly, but saving the distant person from the plague.",
        descriptionArabic: "مجموعة من 5 أشخاص أبرياء محاصرون في هيكل آيل للسقوط. أمامك زران كبيران. الضغط على الزر الأخضر سينقذهم فوراً، لكنه سيطلق وباءً يؤثر ببطء على شخص بريء آخر في مكان ما من العالم، مسبباً له معاناة طويلة قبل الموت. الضغط على الزر الأحمر لا يفعل شيئاً، مما يترك الـ5 أشخاص يموتون فوراً، لكنه ينقذ الشخص البعيد من الوباء.",
        choice1: "Press GREEN (Save 5, Harm 1 Slowly)",
        choice1Arabic: "اضغط الأخضر (أنقذ 5، اضرار 1 ببطء)",
        choice2: "Press RED (5 Die, 1 Safe)",
        choice2Arabic: "اضغط الأحمر (5 يموتون، 1 آمن)",
        type: "consequence"
      },
      {
        level: 2,
        title: "The Bystander's Choice",
        titleArabic: "خيار المتفرج",
        description: "You witness a crime in progress. A group of 3 criminals are about to harm 2 innocent victims. You can press the GREEN button to call the police, which will save the victims but result in the criminals being imprisoned for years, destroying their families. Pressing the RED button means you do nothing, allowing the harm to occur but avoiding the destruction of the criminals' families.",
        descriptionArabic: "تشهد جريمة قيد التنفيذ. مجموعة من 3 مجرمين على وشك إيذاء ضحيتين أبرياء. يمكنك الضغط على الزر الأخضر لاستدعاء الشرطة، مما سينقذ الضحايا لكن سيؤدي إلى سجن المجرمين لسنوات، مما يدمر عائلاتهم. الضغط على الزر الأحمر يعني أنك لا تفعل شيئاً، مما يسمح بحدوث الضرر لكن يتجنب تدمير عائلات المجرمين.",
        choice1: "Call Police (Save 2, Imprison 3)",
        choice1Arabic: "اتصل بالشرطة (أنقذ 2، اسجن 3)",
        choice2: "Do Nothing (2 Harmed, 3 Families Safe)",
        choice2Arabic: "لا تفعل شيئاً (2 مؤذيان، 3 عائلات آمنة)",
        type: "bystander"
      },
      {
        level: 3,
        title: "The Resource Dilemma",
        titleArabic: "معضلة الموارد",
        description: "You control the distribution of life-saving medicine. There's only enough for one group. The GREEN button sends medicine to a hospital treating 4 elderly patients who will die without it. The RED button sends it to a clinic treating 1 young child who will die without it. Both groups will die if they don't receive the medicine.",
        descriptionArabic: "أنت تتحكم في توزيع دواء منقذ للحياة. يوجد ما يكفي لمجموعة واحدة فقط. الزر الأخضر يرسل الدواء إلى مستشفى يعالج 4 مرضى مسنين سيموتون بدونه. الزر الأحمر يرسله إلى عيادة تعالج طفلاً واحداً صغيراً سيموت بدونه. كلا المجموعتين ستموت إذا لم تحصل على الدواء.",
        choice1: "Save 4 Elderly Patients",
        choice1Arabic: "أنقذ 4 مرضى مسنين",
        choice2: "Save 1 Young Child",
        choice2Arabic: "أنقذ طفلاً واحداً صغيراً",
        type: "resource"
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
    const player: Player = { 
      ...insertPlayer, 
      id,
      photoUrl: insertPlayer.photoUrl || null,
      language: insertPlayer.language || 'en'
    };
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
