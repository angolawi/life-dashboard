import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCloudSync } from './hooks/useCloudSync';
import { CloudBackupPayload, LAST_UPDATED_STORAGE_KEY } from './services/gistSync';
import {
  UserProfile,
  HabitItem,
  HabitsMonthState,
  WeightEntry,
  BloodMarker,
  BibleReadingEntry,
  PrayerItem,
  DevotionalThought,
  FinanceConfig,
  ContributionEntry,
  BJJSession,
  ConditioningSession,
  DailyNutrition,
  ReadinessCheck
} from './types';
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_HABITS,
  DEFAULT_WEIGHT_LOGS,
  DEFAULT_BLOOD_MARKERS,
  DEFAULT_PRAYERS,
  DEFAULT_FINANCE_CONFIG,
  DEFAULT_CONTRIBUTIONS,
  DEFAULT_BJJ_SESSIONS
} from './data/defaultData';
import { Header } from './components/layout/Header';
import { NavigationTabs, MainTabType } from './components/layout/NavigationTabs';
import { OverviewCockpit } from './components/layout/OverviewCockpit';
import { HabitWheel } from './components/habits/HabitWheel';
import { BJJHealthView } from './components/health/BJJHealthView';
import { SpiritualView } from './components/spiritual/SpiritualView';
import { FinanceView } from './components/finance/FinanceView';
import { SettingsModal } from './components/layout/SettingsModal';
import { CloudSyncModal } from './components/layout/CloudSyncModal';

export function App() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [activeTab, setActiveTab] = useState<MainTabType>('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Estados com persistência local
  const [user, setUser] = useLocalStorage<UserProfile>('nexus_user_profile', {
    ...DEFAULT_USER_PROFILE,
    currentBeltColor: 'BLUE',
    currentDegrees: 3,
    targetBeltColor: 'PURPLE',
    scheduleConfig: {
      bjjDays: [1, 3, 5], // Seg, Qua, Sex
      conditioningDays: [2, 4], // Ter, Qui
      pilatesDays: [3], // Quarta 18h
      bjjDefaultTime: '12:00',
      pilatesDefaultTime: '18:00'
    }
  });
  const [habits, setHabits] = useLocalStorage<HabitItem[]>('nexus_habits_list', DEFAULT_HABITS);
  const [habitsState, setHabitsState] = useLocalStorage<HabitsMonthState>('nexus_habits_months', {});
  const [weightLogs, setWeightLogs] = useLocalStorage<WeightEntry[]>('nexus_weight_logs', DEFAULT_WEIGHT_LOGS);
  const [bloodMarkers, setBloodMarkers] = useLocalStorage<BloodMarker[]>('nexus_blood_markers', DEFAULT_BLOOD_MARKERS);
  
  // BJJ & Road2Belt estados
  const [bjjSessions, setBjjSessions] = useLocalStorage<BJJSession[]>('nexus_bjj_sessions', DEFAULT_BJJ_SESSIONS);
  const [conditioningSessions, setConditioningSessions] = useLocalStorage<ConditioningSession[]>('nexus_conditioning_sessions', [
    {
      id: 'cond-1',
      date: '2026-10-22',
      type: 'SC_TREINO_A',
      weekCycle: 1,
      completed: true,
      cadenceAdherence: true,
      pseAverage: 7,
      barefootConfirmed: true,
      notes: 'Semana 1 concluída descalço. Ênfase no agachamento e core.'
    }
  ]);
  const [nutritionLogs, setNutritionLogs] = useLocalStorage<DailyNutrition[]>('nexus_nutrition_logs', [
    {
      id: 'nutr-1',
      date: '2026-10-22',
      protocolType: 'DIAS_COM_BJJ',
      targetKcal: 1702,
      targetCarbsG: 197.4,
      targetProteinG: 102.7,
      targetFatG: 63.5,
      breakfastDone: true,
      snackAmDone: true,
      lunchDone: true,
      snackPmDone: true,
      dinnerDone: true,
      hydrationLiters: 3.2,
      notes: 'Seguiu protocolo de pré e pós tatame 12:00.'
    }
  ]);
  const [readinessLogs, setReadinessLogs] = useLocalStorage<ReadinessCheck[]>('nexus_readiness_logs', [
    {
      id: 'read-1',
      date: '2026-10-24',
      sleepHours: 7.5,
      jointSoreness: 2,
      energyLevel: 4,
      lumbarNeckStatus: 'NORMAL',
      notes: 'Boa prontidão física para o treino.'
    }
  ]);

  // Espiritual & Financeiro
  const [bibleLogs, setBibleLogs] = useLocalStorage<BibleReadingEntry[]>('nexus_bible_logs', [
    { id: 'b1', date: '2026-10-24', book: 'Romanos', chapters: '8-9', completed: true, notes: 'A certeza da providência e o amor de Cristo.' },
    { id: 'b2', date: '2026-10-23', book: 'Romanos', chapters: '6-7', completed: true, notes: 'Mortos para o pecado e vivos para Deus.' },
  ]);
  const [prayers, setPrayers] = useLocalStorage<PrayerItem[]>('nexus_prayers', DEFAULT_PRAYERS);
  const [devotionals, setDevotionals] = useLocalStorage<DevotionalThought[]>('nexus_devotionals', []);
  const [financeConfig, setFinanceConfig] = useLocalStorage<FinanceConfig>('nexus_finance_config', DEFAULT_FINANCE_CONFIG);
  const [contributions, setContributions] = useLocalStorage<ContributionEntry[]>('nexus_contributions', DEFAULT_CONTRIBUTIONS);
  const [localUpdatedAt, setLocalUpdatedAt] = useLocalStorage<string | null>(LAST_UPDATED_STORAGE_KEY, null);

  const markModified = useCallback(() => {
    setLocalUpdatedAt(new Date().toISOString());
  }, [setLocalUpdatedAt]);

  // Aplicar dados remotos baixados do GitHub Gist
  const handleApplyRemoteData = useCallback((payload: CloudBackupPayload) => {
    if (payload.user) setUser(payload.user);
    if (payload.habits) setHabits(payload.habits);
    if (payload.habitsState) setHabitsState(payload.habitsState);
    if (payload.weightLogs) setWeightLogs(payload.weightLogs);
    if (payload.bloodMarkers) setBloodMarkers(payload.bloodMarkers);
    if (payload.bjjSessions) setBjjSessions(payload.bjjSessions);
    if (payload.conditioningSessions) setConditioningSessions(payload.conditioningSessions);
    if (payload.nutritionLogs) setNutritionLogs(payload.nutritionLogs);
    if (payload.readinessLogs) setReadinessLogs(payload.readinessLogs);
    if (payload.bibleLogs) setBibleLogs(payload.bibleLogs);
    if (payload.prayers) setPrayers(payload.prayers);
    if (payload.devotionals) setDevotionals(payload.devotionals);
    if (payload.financeConfig) setFinanceConfig(payload.financeConfig);
    if (payload.contributions) setContributions(payload.contributions);
    setLocalUpdatedAt(payload.updatedAt);
  }, [
    setUser,
    setHabits,
    setHabitsState,
    setWeightLogs,
    setBloodMarkers,
    setBjjSessions,
    setConditioningSessions,
    setNutritionLogs,
    setReadinessLogs,
    setBibleLogs,
    setPrayers,
    setDevotionals,
    setFinanceConfig,
    setContributions,
    setLocalUpdatedAt
  ]);

  // Hook de Sincronização
  const {
    config: syncConfig,
    isConfigured: isSyncConfigured,
    syncStatus,
    syncError,
    connectWithToken,
    syncNow,
    forcePull,
    forcePush,
    disconnect: disconnectSync,
    getPairingUrl
  } = useCloudSync({
    user,
    habits,
    habitsState,
    weightLogs,
    bloodMarkers,
    bjjSessions,
    conditioningSessions,
    nutritionLogs,
    readinessLogs,
    bibleLogs,
    prayers,
    devotionals,
    financeConfig,
    contributions,
    localUpdatedAt,
    onApplyRemoteData: handleApplyRemoteData
  });

  const handleUpdateHabit = (index: number, updated: HabitItem) => {
    setHabits((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
    markModified();
  };

  const handleUpdateAllHabits = (newHabits: HabitItem[]) => {
    setHabits(newHabits);
    markModified();
  };

  // Roda de hábitos
  const currentMonthCells = habitsState[currentMonth]?.cells || Array.from({ length: habits.length }, () => Array(31).fill(false));

  const handleToggleCell = (habitIdx: number, dayIdx: number) => {
    setHabitsState((prev) => {
      const monthData = prev[currentMonth]?.cells 
        ? prev[currentMonth].cells.map(row => [...row]) 
        : Array.from({ length: habits.length }, () => Array(31).fill(false));

      while (monthData.length < habits.length) {
        monthData.push(Array(31).fill(false));
      }

      monthData[habitIdx][dayIdx] = !monthData[habitIdx][dayIdx];

      return {
        ...prev,
        [currentMonth]: {
          cells: monthData
        }
      };
    });
    markModified();
  };

  // Handlers BJJ & Saúde
  const handleSaveBjjSession = (session: BJJSession) => {
    setBjjSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === session.id || s.date === session.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = session;
        return copy;
      }
      return [session, ...prev];
    });
    markModified();
  };

  const handleDeleteBjjSession = (id: string) => {
    setBjjSessions((prev) => prev.filter((s) => s.id !== id));
    markModified();
  };

  const handleSaveConditioningSession = (session: ConditioningSession) => {
    setConditioningSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === session.id || s.date === session.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = session;
        return copy;
      }
      return [session, ...prev];
    });
    markModified();
  };

  const handleSaveNutritionLog = (log: DailyNutrition) => {
    setNutritionLogs((prev) => {
      const idx = prev.findIndex((n) => n.id === log.id || n.date === log.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = log;
        return copy;
      }
      return [log, ...prev];
    });
    markModified();
  };

  const handleSaveReadinessLog = (readiness: ReadinessCheck) => {
    setReadinessLogs((prev) => {
      const idx = prev.findIndex((r) => r.id === readiness.id || r.date === readiness.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = readiness;
        return copy;
      }
      return [readiness, ...prev];
    });
    markModified();
  };

  const handleSaveWeight = (entry: WeightEntry) => {
    setWeightLogs((prev) => [...prev, entry]);
    markModified();
  };
  const handleDeleteWeight = (id: string) => {
    setWeightLogs((prev) => prev.filter((w) => w.id !== id));
    markModified();
  };

  const handleSaveBloodMarker = (marker: BloodMarker) => {
    setBloodMarkers((prev) => [...prev, marker]);
    markModified();
  };
  const handleDeleteBloodMarker = (id: string) => {
    setBloodMarkers((prev) => prev.filter((m) => m.id !== id));
    markModified();
  };

  // Handlers Espiritual
  const handleSaveReading = (entry: BibleReadingEntry) => {
    setBibleLogs((prev) => {
      const idx = prev.findIndex((e) => e.date === entry.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = entry;
        return copy;
      }
      return [...prev, entry];
    });
    markModified();
  };

  const handleSavePrayer = (prayer: PrayerItem) => {
    setPrayers((prev) => [prayer, ...prev]);
    markModified();
  };

  const handleToggleAnsweredPrayer = (id: string, testimony?: string) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'ANSWERED',
              answeredAt: new Date().toISOString().split('T')[0],
              testimony: testimony || p.testimony
            }
          : p
      )
    );
    markModified();
  };

  const handleDeletePrayer = (id: string) => {
    setPrayers((prev) => prev.filter((p) => p.id !== id));
    markModified();
  };

  const handleSaveDevotional = (item: DevotionalThought) => {
    setDevotionals((prev) => {
      const idx = prev.findIndex((d) => d.date === item.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [...prev, item];
    });
    markModified();
  };

  // Handlers Finanças
  const handleSaveContribution = (entry: ContributionEntry) => {
    setContributions((prev) => [entry, ...prev]);
    markModified();
  };

  const handleDeleteContribution = (id: string) => {
    setContributions((prev) => prev.filter((c) => c.id !== id));
    markModified();
  };

  const handleResetContributions = () => {
    setContributions([]);
    markModified();
  };

  const handleSaveUser = (u: UserProfile) => {
    setUser(u);
    markModified();
  };

  // Backup Manual JSON
  const handleExportJson = () => {
    const payload = {
      version: '1.0.0',
      user,
      habits,
      habitsState,
      weightLogs,
      bloodMarkers,
      bjjSessions,
      conditioningSessions,
      nutritionLogs,
      readinessLogs,
      bibleLogs,
      prayers,
      devotionals,
      financeConfig,
      contributions,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-nexus-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.user) setUser(data.user);
        if (data.habits) setHabits(data.habits);
        if (data.habitsState) setHabitsState(data.habitsState);
        if (data.weightLogs) setWeightLogs(data.weightLogs);
        if (data.bloodMarkers) setBloodMarkers(data.bloodMarkers);
        if (data.bjjSessions) setBjjSessions(data.bjjSessions);
        if (data.conditioningSessions) setConditioningSessions(data.conditioningSessions);
        if (data.nutritionLogs) setNutritionLogs(data.nutritionLogs);
        if (data.readinessLogs) setReadinessLogs(data.readinessLogs);
        if (data.bibleLogs) setBibleLogs(data.bibleLogs);
        if (data.prayers) setPrayers(data.prayers);
        if (data.financeConfig) setFinanceConfig(data.financeConfig);
        if (data.contributions) setContributions(data.contributions);
        markModified();
        alert('Dados importados com sucesso!');
      } catch (err) {
        alert('Erro ao importar arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-purple-100 selection:text-purple-900">
      <Header
        user={user}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSync={() => setIsSyncModalOpen(true)}
        syncStatus={syncStatus}
        isSyncConfigured={isSyncConfigured}
      />

      <NavigationTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewCockpit
            user={user}
            habits={habits}
            cells={currentMonthCells}
            habitsState={habitsState}
            selectedDate={selectedDate}
            weightLogs={weightLogs}
            bloodMarkers={bloodMarkers}
            bibleLogs={bibleLogs}
            prayers={prayers}
            contributions={contributions}
            financeConfig={financeConfig}
            bjjSessions={bjjSessions}
            conditioningSessions={conditioningSessions}
            nutritionLogs={nutritionLogs}
            onSaveNutritionLog={handleSaveNutritionLog}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'habits' && (
          <HabitWheel
            habits={habits}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            cells={currentMonthCells}
            onToggleCell={handleToggleCell}
            onUpdateHabit={handleUpdateHabit}
            onUpdateAllHabits={handleUpdateAllHabits}
          />
        )}

        {activeTab === 'bjj_health' && (
          <BJJHealthView
            user={user}
            selectedDate={selectedDate}
            weightLogs={weightLogs}
            bloodMarkers={bloodMarkers}
            bjjSessions={bjjSessions}
            conditioningSessions={conditioningSessions}
            nutritionLogs={nutritionLogs}
            readinessLogs={readinessLogs}
            onSaveBjjSession={handleSaveBjjSession}
            onDeleteBjjSession={handleDeleteBjjSession}
            onSaveConditioningSession={handleSaveConditioningSession}
            onSaveNutritionLog={handleSaveNutritionLog}
            onSaveReadinessLog={handleSaveReadinessLog}
            onSaveWeight={handleSaveWeight}
            onDeleteWeight={handleDeleteWeight}
            onSaveBloodMarker={handleSaveBloodMarker}
            onDeleteBloodMarker={handleDeleteBloodMarker}
          />
        )}

        {activeTab === 'spiritual' && (
          <SpiritualView
            bibleLogs={bibleLogs}
            prayers={prayers}
            devotionals={devotionals}
            selectedDate={selectedDate}
            onSaveReading={handleSaveReading}
            onSavePrayer={handleSavePrayer}
            onToggleAnsweredPrayer={handleToggleAnsweredPrayer}
            onDeletePrayer={handleDeletePrayer}
            onSaveDevotional={handleSaveDevotional}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceView
            config={financeConfig}
            contributions={contributions}
            onSaveConfig={(cfg) => {
              setFinanceConfig(cfg);
              markModified();
            }}
            onSaveContribution={handleSaveContribution}
            onDeleteContribution={handleDeleteContribution}
            onResetContributions={handleResetContributions}
          />
        )}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <span>Life Nexus Dashboard — Disciplina, Propósito & Fé</span>
          <span className="font-mono text-[11px] text-slate-500">Soli Deo Gloria</span>
        </div>
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onSaveUser={handleSaveUser}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        syncConfig={syncConfig}
        isSyncConfigured={isSyncConfigured}
        syncStatus={syncStatus}
        syncError={syncError}
        onConnectToken={connectWithToken}
        onSyncNow={syncNow}
        onForcePull={forcePull}
        onForcePush={forcePush}
        onDisconnectSync={disconnectSync}
        getPairingUrl={getPairingUrl}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />
    </div>
  );
}

export default App;
