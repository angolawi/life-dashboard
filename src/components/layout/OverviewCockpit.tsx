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
  BJJSession 
} from '../../types';
import { 
  Sparkles, 
  CheckCircle2, 
  CircleDot, 
  ShieldCheck, 
  BookOpen, 
  TrendingUp, 
  Scale, 
  ArrowRight, 
  Activity 
} from 'lucide-react';

interface OverviewCockpitProps {
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
  onNavigateTab: (tab: 'habits' | 'bjj_health' | 'spiritual' | 'finance') => void;
}

export const OverviewCockpit: React.FC<OverviewCockpitProps> = ({
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
  onNavigateTab
}) => {
  // Dia atual e progresso de hábitos hoje
  const todayDayIndex = parseInt(selectedDate.split('-')[2], 10) - 1;
  let habitsDoneToday = 0;
  habits.forEach((_, hIdx) => {
    if (cells[hIdx]?.[todayDayIndex]) habitsDoneToday++;
  });
  const habitsDoneTodayPct = Math.round((habitsDoneToday / (habits.length || 1)) * 100);

  // Leitura bíblica hoje
  const todayBible = bibleLogs.find((b) => b.date === selectedDate);

  // Peso atual
  const latestWeight = weightLogs[weightLogs.length - 1];

  // Finanças
  const totalContributed100k = contributions
    .filter((c) => c.destination === 'META_100K')
    .reduce((acc, c) => acc + c.amount, 0);
  const pct100k = Math.min(100, Math.round((totalContributed100k / (financeConfig.fourYearTargetAmount || 100000)) * 100));

  return (
    <div className="space-y-6">
      {/* Banner Principal de Boas-Vindas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-clean-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
            <Sparkles size={14} className="text-purple-600" />
            <span>Foco no Alvo & Excelência Diária</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Olá, {user.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Seu cockpit unificado de vida reúne sua Roda de Hábitos, progresso técnico rumo à {user.targetRank}, saúde biológica, devoção reformada e patrimônio de 100k.
          </p>
        </div>

        {/* Status Rápido do Dia */}
        <div className="z-10 flex flex-wrap gap-3">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center min-w-[130px]">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Hábitos Hoje</span>
            <div className="text-2xl font-black font-mono text-purple-700 mt-0.5">
              {habitsDoneToday}/{habits.length}
            </div>
            <span className="text-[10px] text-slate-500">{habitsDoneTodayPct}% cumpridos</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center min-w-[130px]">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Meta 100k</span>
            <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">
              {pct100k}%
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">Em andamento</span>
          </div>
        </div>
      </div>

      {/* Grid dos 4 Pilares Fundamentais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Roda de Hábitos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-clean-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                  <CircleDot size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Roda de Hábitos</h3>
              </div>
              <span className="text-xs font-semibold text-purple-600">{habits.length} Raias Ativas</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Estrutura circular de 8 hábitos de alta performance inspirada em heatmaps do GitHub.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {habits.slice(0, 4).map((h) => (
                <span key={h.id} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                  {h.name}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('habits')}
            className="mt-6 flex items-center justify-between py-2.5 px-4 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Abrir Roda de Hábitos Completa</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 2. BJJ & Saúde Biomarcadores */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-clean-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Jornada Faixa Roxa & Biomarcadores</h3>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {user.currentRank}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tatame de Jiu Jitsu, peso ({latestWeight?.weightKg || 84}kg), IMC e {bloodMarkers.length} biomarcadores de exames de sangue monitorados.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-700">Peso: <strong>{latestWeight?.weightKg || 84}kg</strong></span>
              <span className="text-slate-700">Rolas Recentes: <strong>{bjjSessions[0]?.roundsRolled || 6}</strong></span>
              <span className="text-emerald-700 font-bold">Sangue: Otimizado</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('bjj_health')}
            className="mt-6 flex items-center justify-between py-2.5 px-4 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Ver Saúde & Diário do Tatame</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 3. Perspectiva Espiritual Reformada */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-clean-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Vida Espiritual Reformada</h3>
              </div>
              <span className="text-xs font-semibold text-amber-700">Soli Deo Gloria</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fidelidade nas Escrituras Sagradas, diário de intercessão e memorial de providências divinas.
            </p>
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Leitura Diária:</span>
              <span className="text-xs font-bold text-slate-900">
                {todayBible?.completed ? `✓ ${todayBible.book} ${todayBible.chapters}` : 'Aguardando check-in'}
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('spiritual')}
            className="mt-6 flex items-center justify-between py-2.5 px-4 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Abrir Leitura Bíblica & Orações</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 4. Perspectiva Financeira */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-clean-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Meta R$ 100.000 em 4 Anos</h3>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-700">
                {pct100k}%
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Construção patrimonial consistente com reserva de emergência e aportes mensais de longo prazo.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600">Acumulado:</span>
              <strong className="text-slate-900">
                R$ {totalContributed100k.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('finance')}
            className="mt-6 flex items-center justify-between py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Acessar Painel Financeiro</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
