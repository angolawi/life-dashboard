import React from 'react';
import { 
  UserProfile, 
  HabitItem, 
  HabitsMonthState,
  WeightEntry, 
  BloodMarker, 
  BibleReadingEntry, 
  PrayerItem, 
  ContributionEntry, 
  FinanceConfig, 
  BJJSession,
  ConditioningSession
} from '../../types';
import { calculateGamificationStats, generateActivityHeatmapData } from '../../utils/gamification';
import { GamificationBanner } from '../overview/GamificationBanner';
import { ConsistencyHeatmap } from '../overview/ConsistencyHeatmap';
import { PillarsProgressGrid } from '../overview/PillarsProgressGrid';

interface OverviewCockpitProps {
  user: UserProfile;
  habits: HabitItem[];
  cells: boolean[][];
  habitsState: HabitsMonthState;
  selectedDate: string;
  weightLogs: WeightEntry[];
  bloodMarkers: BloodMarker[];
  bibleLogs: BibleReadingEntry[];
  prayers: PrayerItem[];
  contributions: ContributionEntry[];
  financeConfig: FinanceConfig;
  bjjSessions: BJJSession[];
  conditioningSessions?: ConditioningSession[];
  onNavigateTab: (tab: 'habits' | 'bjj_health' | 'spiritual' | 'finance') => void;
}

export const OverviewCockpit: React.FC<OverviewCockpitProps> = ({
  user,
  habits,
  cells,
  habitsState,
  selectedDate,
  weightLogs,
  bloodMarkers,
  bibleLogs,
  prayers,
  contributions,
  financeConfig,
  bjjSessions,
  conditioningSessions = [],
  onNavigateTab
}) => {
  // Cálculo de estatísticas e gamificação central
  const gamificationStats = calculateGamificationStats(
    user,
    habits,
    habitsState,
    bjjSessions,
    conditioningSessions,
    bibleLogs,
    contributions,
    selectedDate
  );

  // Dados do Heatmap (últimos 70 dias)
  const heatmapData = generateActivityHeatmapData(
    habitsState,
    bjjSessions,
    conditioningSessions,
    bibleLogs,
    contributions,
    70
  );

  return (
    <div className="space-y-6">
      {/* 1. Banner Principal Gamificado (XP, Nível, Streak e Conquistas) */}
      <GamificationBanner 
        stats={gamificationStats} 
        userName={user.name} 
      />

      {/* 2. Heatmap de Consistência Diária (Estilo GitHub) */}
      <ConsistencyHeatmap 
        data={heatmapData} 
        selectedDate={selectedDate} 
      />

      {/* 3. Grid de Progressos dos 4 Pilares da Vida */}
      <PillarsProgressGrid
        user={user}
        habits={habits}
        cells={cells}
        selectedDate={selectedDate}
        weightLogs={weightLogs}
        bloodMarkers={bloodMarkers}
        bibleLogs={bibleLogs}
        prayers={prayers}
        contributions={contributions}
        financeConfig={financeConfig}
        bjjSessions={bjjSessions}
        conditioningSessions={conditioningSessions}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};
