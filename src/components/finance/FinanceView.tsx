import React, { useState } from 'react';
import { FinanceConfig, ContributionEntry } from '../../types';
import { 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Plus, 
  Trash2, 
  Calendar, 
  Settings2, 
  Save, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FinanceViewProps {
  config: FinanceConfig;
  contributions: ContributionEntry[];
  onSaveConfig: (cfg: FinanceConfig) => void;
  onSaveContribution: (entry: ContributionEntry) => void;
  onDeleteContribution: (id: string) => void;
  onResetContributions?: () => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  config,
  contributions,
  onSaveConfig,
  onSaveContribution,
  onDeleteContribution,
  onResetContributions
}) => {
  // Modal de Configuração Financeira
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [cfgEmergencyTarget, setCfgEmergencyTarget] = useState(config.emergencyTargetAmount?.toString() || '0');
  const [cfgEmergencyCurrent, setCfgEmergencyCurrent] = useState(config.emergencyCurrentAmount?.toString() || '0');
  const [cfgMonthlyTarget, setCfgMonthlyTarget] = useState(config.monthlyContributionTarget?.toString() || '0');
  const [cfg100kTarget, setCfg100kTarget] = useState(config.fourYearTargetAmount?.toString() || '100000');
  const [cfgStartDate, setCfgStartDate] = useState(config.startDate || new Date().toISOString().split('T')[0]);
  const [cfgEndDate, setCfgEndDate] = useState(config.targetEndDate || '2030-01-01');

  // Novo aporte form state
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState<'META_100K' | 'RESERVA_EMERGENCIA'>('META_100K');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Total acumulado na Meta 100k
  const totalContributed100k = contributions
    .filter((c) => c.destination === 'META_100K')
    .reduce((acc, c) => acc + c.amount, 0);

  // Progresso 100k
  const target100k = config.fourYearTargetAmount || 100000;
  const progress100kPct = target100k > 0 ? Math.min(100, Math.round((totalContributed100k / target100k) * 100)) : 0;

  // Reserva de Emergência
  const totalEmergencyContributed = contributions
    .filter((c) => c.destination === 'RESERVA_EMERGENCIA')
    .reduce((acc, c) => acc + c.amount, 0);
  const currentEmergency = (config.emergencyCurrentAmount || 0) + totalEmergencyContributed;
  const targetEmergency = config.emergencyTargetAmount || 0;
  const emergencyPct = targetEmergency > 0 ? Math.min(100, Math.round((currentEmergency / targetEmergency) * 100)) : 0;

  // Tempo decorrido vs. restante dos 4 anos (48 meses)
  const start = new Date(config.startDate || new Date().toISOString().split('T')[0]);
  const end = new Date(config.targetEndDate || '2030-01-01');
  const now = new Date();
  const totalMonths = 48;
  const monthsPassed = Math.max(0, Math.min(48, Math.round((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.4))));
  const monthsRemaining = Math.max(1, totalMonths - monthsPassed);

  // Aporte mensal sugerido
  const remaining100k = Math.max(0, target100k - totalContributed100k);
  const suggestedMonthlyContribution = monthsRemaining > 0 ? Math.round(remaining100k / monthsRemaining) : 0;

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    const entry: ContributionEntry = {
      id: `c-${Date.now()}`,
      date,
      amount: parseFloat(amount),
      destination,
      notes
    };
    onSaveContribution(entry);
    setAmount('');
    setNotes('');
  };

  const handleSaveFinanceConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      emergencyTargetAmount: parseFloat(cfgEmergencyTarget) || 0,
      emergencyCurrentAmount: parseFloat(cfgEmergencyCurrent) || 0,
      monthlyContributionTarget: parseFloat(cfgMonthlyTarget) || 0,
      fourYearTargetAmount: parseFloat(cfg100kTarget) || 100000,
      startDate: cfgStartDate,
      targetEndDate: cfgEndDate
    });
    setIsConfigModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Barra de Topo com Botão de Configurar Metas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-clean">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Painel Financeiro & Patrimônio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Construção da reserva de emergência e acumulação de R$ 100.000 em 4 anos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onResetContributions && contributions.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Deseja realmente zerar todo o histórico de lançamentos e aportes?')) {
                  onResetContributions();
                }
              }}
              className="px-3 py-2 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              Zerar Histórico
            </button>
          )}

          <button
            onClick={() => {
              setCfgEmergencyTarget(config.emergencyTargetAmount?.toString() || '0');
              setCfgEmergencyCurrent(config.emergencyCurrentAmount?.toString() || '0');
              setCfgMonthlyTarget(config.monthlyContributionTarget?.toString() || '0');
              setCfg100kTarget(config.fourYearTargetAmount?.toString() || '100000');
              setIsConfigModalOpen(true);
            }}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Settings2 size={14} />
            Configurar Metas & Capacidade
          </button>
        </div>
      </div>

      {/* Cards de Topo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Termômetro Meta 100k */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-clean relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Meta 100 Mil (4 Anos)</span>
            <TrendingUp size={18} className="text-purple-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">R$</span>
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {totalContributed100k.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>{progress100kPct}% da meta</span>
              <span className="font-mono">R$ {target100k.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${progress100kPct}%` }}
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Meses restantes: <strong className="text-slate-800">{monthsRemaining} meses</strong></span>
            <span>Sugerido: <strong className="text-purple-700">R$ {suggestedMonthlyContribution}/mês</strong></span>
          </div>
        </div>

        {/* Reserva de Emergência */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-clean">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Reserva de Emergência</span>
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">R$</span>
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {currentEmergency.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>{emergencyPct}% blindada</span>
              <span className="font-mono">Meta: R$ {targetEmergency.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${emergencyPct}%` }}
              />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">
            {targetEmergency > 0 ? 'Fundo de liquidez diária para imprevistos.' : 'Defina a meta da sua reserva nas configurações.'}
          </p>
        </div>

        {/* Capacidade de Aporte Mensal */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-clean">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Capacidade de Aporte</span>
            <DollarSign size={18} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">R$</span>
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {(config.monthlyContributionTarget || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-medium text-slate-500">/mês</span>
          </div>
          <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
            {config.monthlyContributionTarget > 0
              ? `Com R$ ${config.monthlyContributionTarget} mensais constantes, você mantém ritmo sólido de aportes.`
              : 'Clique em "Configurar Metas" para definir sua capacidade de aporte mensal.'}
          </div>
        </div>
      </div>

      {/* Grid Principal: Novo Aporte e Histórico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-clean h-fit">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-1.5">
            <Plus size={16} className="text-purple-600" />
            Registrar Novo Aporte
          </h3>
          <form onSubmit={handleAddContribution} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">Valor do Aporte (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="ex: 1500.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Destino</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
              >
                <option value="META_100K">Meta 100 Mil (Renda Fixa / Ações)</option>
                <option value="RESERVA_EMERGENCIA">Reserva de Emergência (Liquidez Diária)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Notas / Ativo</label>
              <input
                type="text"
                placeholder="ex: Tesouro Selic, CDB 100% CDI, Ações"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              Salvar Aporte
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-clean space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Histórico de Aportes Financeiros</h3>
            <span className="text-xs text-slate-500 font-mono">{contributions.length} lançamentos</span>
          </div>

          {contributions.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <DollarSign size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Nenhum aporte registrado ainda.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Faça o seu primeiro lançamento ao lado para começar a preencher o termômetro.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-2.5">Data</th>
                    <th className="py-2.5">Destino</th>
                    <th className="py-2.5">Valor</th>
                    <th className="py-2.5">Notas</th>
                    <th className="py-2.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {contributions.slice().reverse().map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 text-slate-700 font-sans">
                        {new Date(entry.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-2.5 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            entry.destination === 'META_100K'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {entry.destination === 'META_100K' ? 'Meta 100k' : 'Reserva'}
                        </span>
                      </td>
                      <td className="py-2.5 font-bold text-slate-900">
                        R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 text-slate-500 font-sans">{entry.notes || '-'}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onDeleteContribution(entry.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Configuração das Metas Financeiras */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                  <Settings2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Configurar Metas Financeiras</h3>
                  <p className="text-xs text-slate-500">Defina os valores da sua reserva e aporte mensal.</p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFinanceConfig} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block">
                  Meta da Reserva de Emergência (R$)
                </label>
                <input
                  type="number"
                  step="100"
                  value={cfgEmergencyTarget}
                  onChange={(e) => setCfgEmergencyTarget(e.target.value)}
                  placeholder="ex: 24000 (ex: 6 meses de despesas)"
                  className="w-full mt-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-[11px] text-slate-400">Total desejado para emergências.</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block">
                  Saldo Atual Inicial na Reserva (R$)
                </label>
                <input
                  type="number"
                  step="100"
                  value={cfgEmergencyCurrent}
                  onChange={(e) => setCfgEmergencyCurrent(e.target.value)}
                  placeholder="ex: 5000 (quanto já tem guardado hoje)"
                  className="w-full mt-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block">
                  Capacidade de Aporte Mensal Planejada (R$/mês)
                </label>
                <input
                  type="number"
                  step="50"
                  value={cfgMonthlyTarget}
                  onChange={(e) => setCfgMonthlyTarget(e.target.value)}
                  placeholder="ex: 1800"
                  className="w-full mt-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-[11px] text-slate-400">Quanto você planeja poupar/investir por mês.</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block">
                  Meta de Acumulação em 4 Anos (R$)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={cfg100kTarget}
                  onChange={(e) => setCfg100kTarget(e.target.value)}
                  placeholder="100000"
                  className="w-full mt-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Save size={14} />
                  Salvar Metas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
