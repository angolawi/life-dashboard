import React, { useState, useMemo } from 'react';
import {
  BiblePlanDay,
  BiblePlanProgress,
  BibleReadingEntry
} from '../../types';
import {
  ANNUAL_BIBLE_PLAN,
  calculateBiblePlanStats,
  TOTAL_BIBLE_CHAPTERS
} from '../../data/bibleReadingPlan';
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  FastForward,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  ChevronRight,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';

interface BiblePlanTrackerProps {
  progress: BiblePlanProgress;
  selectedDate: string;
  onToggleDay: (dayNumber: number) => void;
  onQuickCheckinToday: (day: BiblePlanDay) => void;
  onUpdateStartDate?: (newDate: string) => void;
  bibleLogs: BibleReadingEntry[];
}

export const BiblePlanTracker: React.FC<BiblePlanTrackerProps> = ({
  progress,
  selectedDate,
  onToggleDay,
  onQuickCheckinToday,
  bibleLogs
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'OT' | 'NT'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllDays, setShowAllDays] = useState(false);

  const stats = useMemo(() => {
    return calculateBiblePlanStats(progress, selectedDate);
  }, [progress, selectedDate]);

  const completedSet = useMemo(() => {
    return new Set(progress.completedDayNumbers || []);
  }, [progress.completedDayNumbers]);

  // Plano do dia atual sugerido com base na data (dia do ano)
  const currentScheduledDay = useMemo(() => {
    const dayNumber = Math.min(365, Math.max(1, stats.expectedDay));
    return ANNUAL_BIBLE_PLAN.find((d) => d.dayNumber === dayNumber) || ANNUAL_BIBLE_PLAN[0];
  }, [stats.expectedDay]);

  const isCurrentScheduledDone = completedSet.has(currentScheduledDay.dayNumber);

  // Filtro de dias para navegação e adiantamento
  const filteredDays = useMemo(() => {
    return ANNUAL_BIBLE_PLAN.filter((day) => {
      const isDone = completedSet.has(day.dayNumber);
      if (filterMode === 'pending' && isDone) return false;
      if (filterMode === 'completed' && !isDone) return false;
      if (testamentFilter !== 'all' && day.testament !== testamentFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          day.book.toLowerCase().includes(query) ||
          day.chaptersText.toLowerCase().includes(query) ||
          `dia ${day.dayNumber}`.includes(query)
        );
      }
      return true;
    });
  }, [completedSet, filterMode, testamentFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Header com Status Geral e Próxima Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Próxima Leitura / Leitura do Dia */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <BookOpen size={220} />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-md text-purple-200 border border-white/15">
                <Sparkles size={12} className="text-amber-300" />
                Meta Canônica Diária • 365 Dias
              </span>
              <span className="text-xs font-mono font-medium text-slate-300">
                Dia {currentScheduledDay.dayNumber} de 365
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
                {isCurrentScheduledDone ? 'Leitura Concluída Hoje' : 'Passagem Programada para Hoje'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
                {currentScheduledDay.chaptersText}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {currentScheduledDay.chaptersCount} capítulos • {currentScheduledDay.testament === 'OT' ? 'Antigo Testamento' : 'Novo Testamento'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onQuickCheckinToday(currentScheduledDay)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
                isCurrentScheduledDone
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              <CheckCircle2 size={16} />
              {isCurrentScheduledDone ? 'Dia Concluído (Clique p/ Desmarcar)' : 'Concluir Check-in Desta Leitura'}
            </button>

            {stats.nextPendingDay && stats.nextPendingDay.dayNumber !== currentScheduledDay.dayNumber && (
              <button
                onClick={() => onQuickCheckinToday(stats.nextPendingDay)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-purple-100 border border-white/10 flex items-center gap-2 transition-all"
                title={`Adiantar Dia ${stats.nextPendingDay.dayNumber}: ${stats.nextPendingDay.chaptersText}`}
              >
                <FastForward size={14} className="text-amber-400" />
                Adiantar Próximo: Dia {stats.nextPendingDay.dayNumber} ({stats.nextPendingDay.chaptersText})
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Estatísticas de Ritmo & Capítulos */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Ritmo de Leitura
              </span>
              {stats.isAhead && (
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <TrendingUp size={12} />
                  +{stats.paceDelta} {stats.paceDelta === 1 ? 'dia adiantado' : 'dias adiantados'}
                </span>
              )}
              {stats.isOnTrack && (
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  Em dia
                </span>
              )}
              {stats.isBehind && (
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                  {stats.paceDelta} {stats.paceDelta === -1 ? 'dia pendente' : 'dias pendentes'}
                </span>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-700 mb-1">
                  <span>Capítulos Lidos</span>
                  <span className="font-mono text-purple-700">
                    {stats.chaptersRead} / {TOTAL_BIBLE_CHAPTERS} ({stats.percentageChapters.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${stats.percentageChapters}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-700 mb-1">
                  <span>Dias Concluídos</span>
                  <span className="font-mono text-slate-900">
                    {stats.completedDaysCount} / 365 ({stats.percentageDays.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.percentageDays}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Frente de Leitura:</span>
            <span className="font-bold text-slate-800">
              {stats.maxCompletedDay > 0 ? `Dia ${stats.maxCompletedDay}` : 'Ainda não iniciado'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visualizador & Navegador Completo dos 365 Dias (com suporte a adiantamento livre) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers size={18} className="text-purple-600" />
              Cronograma Anual & Adiantamento de Leituras
            </h3>
            <p className="text-xs text-slate-500">
              Você pode marcar qualquer dia como lido para adiantar capítulos sem restrições.
            </p>
          </div>

          {/* Botão de Toggle Expandir */}
          <button
            onClick={() => setShowAllDays(!showAllDays)}
            className="px-3.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors self-start sm:self-auto"
          >
            {showAllDays ? 'Recolher Lista de Dias' : `Ver Grade Completa (${stats.completedDaysCount}/365)`}
          </button>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar livro ou dia (ex: Romanos, Dia 45)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          {/* Filtro de Status */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({ANNUAL_BIBLE_PLAN.length})
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterMode === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendentes ({365 - stats.completedDaysCount})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterMode === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Concluídos ({stats.completedDaysCount})
            </button>
          </div>

          {/* Filtro Testamento */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTestamentFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                testamentFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ambos
            </button>
            <button
              onClick={() => setTestamentFilter('OT')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                testamentFilter === 'OT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AT
            </button>
            <button
              onClick={() => setTestamentFilter('NT')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                testamentFilter === 'NT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NT
            </button>
          </div>
        </div>

        {/* Grade de Dias */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2 ${
            !showAllDays ? 'max-h-[360px] overflow-y-auto pr-1' : ''
          }`}
        >
          {filteredDays.map((day) => {
            const isDone = completedSet.has(day.dayNumber);
            const isScheduledToday = day.dayNumber === currentScheduledDay.dayNumber;

            return (
              <div
                key={day.dayNumber}
                onClick={() => onToggleDay(day.dayNumber)}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 select-none ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-800 hover:bg-emerald-50'
                    : isScheduledToday
                    ? 'bg-purple-50/60 border-purple-300 ring-2 ring-purple-400/30'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[10px] text-slate-400">
                      Dia {day.dayNumber}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700">
                      {day.testament}
                    </span>
                    {isScheduledToday && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
                        Hoje
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-slate-900 truncate">
                    {day.chaptersText}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {day.chaptersCount} capítulos
                  </div>
                </div>

                <div className="flex-shrink-0 pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border border-slate-300 bg-white hover:border-purple-400'
                    }`}
                  >
                    {isDone && <CheckCircle2 size={13} className="text-white" />}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredDays.length === 0 && (
            <div className="col-span-full py-8 text-center text-xs text-slate-500">
              Nenhuma leitura encontrada com os filtros selecionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
