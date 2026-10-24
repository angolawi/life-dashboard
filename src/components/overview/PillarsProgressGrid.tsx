import React from 'react';
import { 
  UserProfile, 
  HabitItem, 
  WeightEntry, 
  BloodMarker, 
  BibleReadingEntry, 
  PrayerItem, 
  ContributionEntry, 
  FinanceConfig, 
  BJJSession,
  ConditioningSession
} from '../../types';
import { 
  CircleDot, 
  ShieldCheck, 
  BookOpen, 
  TrendingUp, 
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface PillarsProgressGridProps {
  user: UserProfile;
  habits: HabitItem[];
  cells: boolean[][];
  selectedDate: string;
  weightLogs: WeightEntry[];
  bloodMarkers: BloodMarker[];
  bibleLogs: BibleReadingEntry[];
  prayers: PrayerItem[];
  contributions: ContributionEntry[];
  financeConfig: FinanceConfig;
  bjjSessions: BJJSession[];
  conditioningSessions: ConditioningSession[];
  onNavigateTab: (tab: 'habits' | 'bjj_health' | 'spiritual' | 'finance') => void;
}

export const PillarsProgressGrid: React.FC<PillarsProgressGridProps> = ({
  user,
  habits,
  cells,
  selectedDate,
  weightLogs,
  bloodMarkers,
  bibleLogs,
  prayers,
  contributions,
  financeConfig,
  bjjSessions,
  conditioningSessions,
  onNavigateTab
}) => {
  // 1. Hábitos
  const todayDayIndex = parseInt(selectedDate.split('-')[2], 10) - 1;
  let habitsDoneToday = 0;
  let totalHabitSlots = habits.length * 30; // aprox mês
  let totalHabitsDoneMonth = 0;

  habits.forEach((_, hIdx) => {
    if (cells[hIdx]?.[todayDayIndex]) habitsDoneToday++;
    cells[hIdx]?.forEach((done) => {
      if (done) totalHabitsDoneMonth++;
    });
  });

  const habitsDoneTodayPct = Math.round((habitsDoneToday / (habits.length || 1)) * 100);
  const monthlyHabitsPct = Math.min(100, Math.round((totalHabitsDoneMonth / (totalHabitSlots || 1)) * 100));

  // 2. BJJ & Saúde
  const latestWeight = weightLogs[weightLogs.length - 1];
  const optimalBloodCount = bloodMarkers.filter(b => b.status === 'OPTIMAL').length;
  const bloodHealthPct = bloodMarkers.length > 0 
    ? Math.round((optimalBloodCount / bloodMarkers.length) * 100) 
    : 100;
  
  // Graus BJJ (0 a 4 graus rumo à próxima)
  const currentDegrees = user.currentDegrees || 0;
  const degreePct = Math.min(100, Math.round(((currentDegrees) / 4) * 100));

  // 3. Espiritual
  const todayBible = bibleLogs.find((b) => b.date === selectedDate);
  const answeredPrayersCount = prayers.filter(p => p.status === 'ANSWERED').length;
  const totalBibleCount = bibleLogs.filter(b => b.completed).length;

  // 4. Finanças
  const totalContributed100k = contributions
    .filter((c) => c.destination === 'META_100K')
    .reduce((acc, c) => acc + c.amount, 0);
  const pct100k = Math.min(100, Math.round((totalContributed100k / (financeConfig.fourYearTargetAmount || 100000)) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 1. Roda de Hábitos & Disciplina */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-clean flex flex-col justify-between hover:shadow-clean-md transition-all">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-purple-50 text-purple-700 rounded-2xl border border-purple-200/60">
                <CircleDot size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Roda de Hábitos</h3>
                <span className="text-[11px] text-slate-500 font-medium">{habits.length} Raias Ativas</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-black text-purple-700">{habitsDoneTodayPct}%</span>
              <p className="text-[10px] text-slate-400">cumprido hoje</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Hoje: <strong>{habitsDoneToday}/{habits.length}</strong></span>
              <span>Mensal: <strong>{monthlyHabitsPct}%</strong></span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${habitsDoneTodayPct}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {habits.slice(0, 4).map((h) => (
              <span key={h.id} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700">
                {h.name}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('habits')}
          className="mt-6 flex items-center justify-between py-2.5 px-4 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-2xl text-xs font-bold transition-all border border-slate-200/60"
        >
          <span>Abrir Roda de Hábitos Completa</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 2. BJJ & Saúde Biomarcadores */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-clean flex flex-col justify-between hover:shadow-clean-md transition-all">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-200/60">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Tatame & Biomarcadores</h3>
                <span className="text-[11px] text-slate-500 font-medium">Rumo à {user.targetRank}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              {user.currentRank} ({currentDegrees}º grau)
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Graus na Faixa: <strong>{currentDegrees}/4</strong></span>
              <span>Saúde Sanguínea: <strong>{bloodHealthPct}%</strong></span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${degreePct}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60 text-center">
              <span className="text-[10px] text-slate-500 font-bold block">PESO</span>
              <span className="text-xs font-black font-mono text-slate-800">{latestWeight?.weightKg || 84}kg</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60 text-center">
              <span className="text-[10px] text-slate-500 font-bold block">ROLAS RECENTES</span>
              <span className="text-xs font-black font-mono text-indigo-700">{bjjSessions[0]?.roundsRolled || 6}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60 text-center">
              <span className="text-[10px] text-slate-500 font-bold block">BIOMARCADORES</span>
              <span className="text-xs font-black font-mono text-emerald-700">{optimalBloodCount}/{bloodMarkers.length}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('bjj_health')}
          className="mt-6 flex items-center justify-between py-2.5 px-4 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-2xl text-xs font-bold transition-all border border-slate-200/60"
        >
          <span>Ver Diário de Treinos & Saúde</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 3. Espiritualidade Reformada */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-clean flex flex-col justify-between hover:shadow-clean-md transition-all">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200/60">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Vida Espiritual Reformada</h3>
                <span className="text-[11px] text-amber-700 font-semibold">Soli Deo Gloria</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
              {totalBibleCount} leituras
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Leitura do Dia:</span>
              <span className="font-bold text-slate-900">
                {todayBible?.completed ? `✓ ${todayBible.book} ${todayBible.chapters}` : 'Aguardando check-in'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Orações Atendidas:</span>
              <span className="font-bold text-emerald-700 font-mono">
                {answeredPrayersCount} testemunhos
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('spiritual')}
          className="mt-6 flex items-center justify-between py-2.5 px-4 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 rounded-2xl text-xs font-bold transition-all border border-slate-200/60"
        >
          <span>Abrir Leitura Bíblica & Orações</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 4. Liberdade Financeira (Meta 100k) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-clean flex flex-col justify-between hover:shadow-clean-md transition-all">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200/60">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Meta R$ 100.000 em 4 Anos</h3>
                <span className="text-[11px] text-emerald-700 font-bold font-mono">{pct100k}% Concluído</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
              R$ {totalContributed100k.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Alvo: <strong>R$ {(financeConfig.fourYearTargetAmount || 100000).toLocaleString('pt-BR')}</strong></span>
              <span className="text-emerald-700 font-semibold">{pct100k}% do alvo</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${pct100k}%` }}
              />
            </div>
          </div>

          {/* Marcadores de Etapas */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1 pt-1">
            <span>R$ 0</span>
            <span>25k</span>
            <span>50k</span>
            <span>75k</span>
            <span className="font-bold text-slate-700">100k</span>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('finance')}
          className="mt-6 flex items-center justify-between py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-2xl text-xs font-bold transition-all border border-slate-200/60"
        >
          <span>Acessar Painel Financeiro</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
