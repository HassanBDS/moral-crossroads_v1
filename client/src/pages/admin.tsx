import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Scenario, Player } from '@shared/schema';

interface AdminUser {
  id: number;
  username: string;
  role: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'players'>('scenarios');
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Authentication form
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Scenario form
  const [scenarioForm, setScenarioForm] = useState({
    level: 1,
    title: '',
    titleArabic: '',
    description: '',
    descriptionArabic: '',
    choice1: '',
    choice1Arabic: '',
    choice2: '',
    choice2Arabic: '',
    type: 'consequence',
    characterCount: 5,
    scenarioCategory: 'consequence'
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/admin/login', credentials);
      return response.json();
    },
    onSuccess: (data) => {
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      localStorage.setItem('adminToken', data.token);
    },
  });

  // Get scenarios query
  const { data: scenarios = [], refetch: refetchScenarios } = useQuery<Scenario[]>({
    queryKey: ['/api/admin/scenarios'],
    enabled: isAuthenticated,
  });

  // Get players query
  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ['/api/admin/players'],
    enabled: isAuthenticated,
  });

  // Create scenario mutation
  const createScenarioMutation = useMutation({
    mutationFn: async (scenario: any) => {
      const response = await apiRequest('POST', '/api/admin/scenarios', scenario);
      return response.json();
    },
    onSuccess: () => {
      refetchScenarios();
      setShowAddForm(false);
      resetScenarioForm();
    },
  });

  // Update scenario mutation
  const updateScenarioMutation = useMutation({
    mutationFn: async ({ id, scenario }: { id: number; scenario: any }) => {
      const response = await apiRequest('PUT', `/api/admin/scenarios/${id}`, scenario);
      return response.json();
    },
    onSuccess: () => {
      refetchScenarios();
      setEditingScenario(null);
      resetScenarioForm();
    },
  });

  // Delete scenario mutation
  const deleteScenarioMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/scenarios/${id}`);
    },
    onSuccess: () => {
      refetchScenarios();
    },
  });

  const resetScenarioForm = () => {
    setScenarioForm({
      level: 1,
      title: '',
      titleArabic: '',
      description: '',
      descriptionArabic: '',
      choice1: '',
      choice1Arabic: '',
      choice2: '',
      choice2Arabic: '',
      type: 'consequence',
      characterCount: 5,
      scenarioCategory: 'consequence'
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleScenarioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingScenario) {
      updateScenarioMutation.mutate({ id: editingScenario.id, scenario: scenarioForm });
    } else {
      createScenarioMutation.mutate(scenarioForm);
    }
  };

  const startEdit = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setScenarioForm({
      level: scenario.level,
      title: scenario.title,
      titleArabic: scenario.titleArabic || '',
      description: scenario.description,
      descriptionArabic: scenario.descriptionArabic || '',
      choice1: scenario.choice1,
      choice1Arabic: scenario.choice1Arabic || '',
      choice2: scenario.choice2,
      choice2Arabic: scenario.choice2Arabic || '',
      type: scenario.type,
      characterCount: scenario.characterCount || 5,
      scenarioCategory: scenario.scenarioCategory || 'consequence'
    });
    setShowAddForm(true);
  };

  // Check for existing token
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token with backend
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="starfield-bg"></div>
        <div className="glass-panel p-8 max-w-md w-full mx-4 relative z-10">
          <h1 className="text-3xl font-bold mb-6 text-center neon-text">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-purple-300">Username</Label>
              <Input
                id="username"
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="glass-panel border border-blue-400 text-white"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-purple-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="glass-panel border border-blue-400 text-white"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full"
              style={{
                background: 'linear-gradient(45deg, var(--neon-green), var(--neon-blue))',
                border: '2px solid var(--neon-green)'
              }}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="starfield-bg"></div>
      <div className="relative z-10">
        {/* Header */}
        <header className="glass-panel m-6 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold neon-text">Moral Crossroads Admin</h1>
            <div className="flex items-center gap-4">
              <span className="text-purple-300">Welcome, {currentUser?.username}</span>
              <Button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mx-6 mb-6">
          <div className="glass-panel p-2 inline-flex rounded-lg">
            <Button
              onClick={() => setActiveTab('scenarios')}
              className={`mr-2 ${
                activeTab === 'scenarios' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-transparent text-gray-300 hover:text-white'
              }`}
            >
              Scenarios
            </Button>
            <Button
              onClick={() => setActiveTab('players')}
              className={`${
                activeTab === 'players' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-transparent text-gray-300 hover:text-white'
              }`}
            >
              Players
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="mx-6">
          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              {/* Add New Scenario Button */}
              <div className="glass-panel p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Scenarios Management</h2>
                  <Button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      setEditingScenario(null);
                      resetScenarioForm();
                    }}
                    className="neon-button green"
                  >
                    {showAddForm ? 'Cancel' : 'Add New Scenario'}
                  </Button>
                </div>
              </div>

              {/* Add/Edit Form */}
              {showAddForm && (
                <div className="glass-panel p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    {editingScenario ? 'Edit Scenario' : 'Add New Scenario'}
                  </h3>
                  <form onSubmit={handleScenarioSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-purple-300">Level</Label>
                        <Input
                          type="number"
                          value={scenarioForm.level}
                          onChange={(e) => setScenarioForm(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                          className="glass-panel border border-blue-400 text-white"
                          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-purple-300">Character Count</Label>
                        <Input
                          type="number"
                          value={scenarioForm.characterCount}
                          onChange={(e) => setScenarioForm(prev => ({ ...prev, characterCount: parseInt(e.target.value) }))}
                          className="glass-panel border border-blue-400 text-white"
                          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-purple-300">Title (English)</Label>
                        <Input
                          value={scenarioForm.title}
                          onChange={(e) => setScenarioForm(prev => ({ ...prev, title: e.target.value }))}
                          className="glass-panel border border-blue-400 text-white"
                          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-purple-300">Title (Arabic)</Label>
                        <Input
                          value={scenarioForm.titleArabic}
                          onChange={(e) => setScenarioForm(prev => ({ ...prev, titleArabic: e.target.value }))}
                          className="glass-panel border border-blue-400 text-white"
                          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-purple-300">Description (English)</Label>
                        <Textarea
                          value={scenarioForm.description}
                          onChange={(e) => setScenarioForm(prev => ({ ...prev, description: e.target.value }))}
                          className="glass-panel border border-blue-400 text-white min-h-32"
                          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-purple-300">Description (Arabic)</Label>
                        <Textarea
                          value={scenarioForm.descriptionArabic}
                          onChange={(e) => setScenarioForm(prev => ({ ...prev, descriptionArabic: e.target.value }))}
                          className="glass-panel border border-blue-400 text-white min-h-32"
                          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-purple-300">Choice 1 (English)</Label>
                        <Input
                          value={scenarioForm.choice1}
                          onChange={(e) => setScenarioForm(prev => ({ ...prev, choice1: e.target.value }))}
                          className="glass-panel border border-blue-400 text-white"
                          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-purple-300">Choice 1 (Arabic)</Label>
                        <Input
                          value={scenarioForm.choice1Arabic}
                          onChange={(e) => setScenarioForm(prev => ({ ...prev, choice1Arabic: e.target.value }))}
                          className="glass-panel border border-blue-400 text-white"
                          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-purple-300">Choice 2 (English)</Label>
                        <Input
                          value={scenarioForm.choice2}
                          onChange={(e) => setScenarioForm(prev => ({ ...prev, choice2: e.target.value }))}
                          className="glass-panel border border-blue-400 text-white"
                          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-purple-300">Choice 2 (Arabic)</Label>
                        <Input
                          value={scenarioForm.choice2Arabic}
                          onChange={(e) => setScenarioForm(prev => ({ ...prev, choice2Arabic: e.target.value }))}
                          className="glass-panel border border-blue-400 text-white"
                          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={createScenarioMutation.isPending || updateScenarioMutation.isPending}
                      className="w-full"
                      style={{
                        background: 'linear-gradient(45deg, var(--neon-purple), var(--neon-blue))',
                        border: '2px solid var(--neon-purple)'
                      }}
                    >
                      {editingScenario ? 'Update Scenario' : 'Create Scenario'}
                    </Button>
                  </form>
                </div>
              )}

              {/* Scenarios List */}
              <div className="glass-panel p-6">
                <h3 className="text-xl font-bold text-white mb-4">Existing Scenarios</h3>
                <div className="space-y-4">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className="glass-panel p-4 border border-gray-600">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-green-600 text-white">Level {scenario.level}</Badge>
                            <h4 className="text-lg font-semibold text-white">{scenario.title}</h4>
                          </div>
                          <p className="text-gray-300 mb-2">{scenario.description.substring(0, 200)}...</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-green-400">Choice 1:</span> {scenario.choice1}
                            </div>
                            <div>
                              <span className="text-red-400">Choice 2:</span> {scenario.choice2}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => startEdit(scenario)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => deleteScenarioMutation.mutate(scenario.id)}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={deleteScenarioMutation.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Players Management</h2>
              <div className="space-y-4">
                {players.map((player) => (
                  <div key={player.id} className="glass-panel p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{player.name}</h4>
                        <div className="flex gap-4 text-sm text-gray-300">
                          <span>Gender: {player.gender}</span>
                          <span>Language: {player.language}</span>
                          <span>ID: {player.id}</span>
                        </div>
                        {player.photoUrl && (
                          <div className="mt-2">
                            <span className="text-blue-400">Has profile photo</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">
                          Joined: {player.createdAt ? new Date(player.createdAt).toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}