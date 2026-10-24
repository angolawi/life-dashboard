import React, { useState } from 'react';
import { 
  WeightEntry, 
  BloodMarker, 
  BJJSession, 
  ConditioningSession, 
  DailyNutrition,
  ReadinessCheck,
  UserProfile,
  WeeklyScheduleConfig
} from '../../types';
import { 
  Scale, 
  Activity, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Heart, 
  CheckCircle2, 
  Dumbbell,
  Apple,
  Clock,
  Sparkles,
  Flame,
  Award
} from 'lucide-react';
import { BJJBeltBadge } from '../ui/BJJBeltBadge';
import { BJJCheckinModal } from '../bjj/BJJCheckinModal';
import { BJJSessionsList } from '../bjj/BJJSessionsList';
import { ConditioningView } from '../conditioning/ConditioningView';
import { NutritionView } from '../nutrition/NutritionView';
import { ReadinessCard } from '../today/ReadinessCard';

interface BJJHealthViewProps {
  user: UserProfile;
  selectedDate: string;
  weightLogs: WeightEntry[];
  bloodMarkers: BloodMarker[];
  bjjSessions: BJJSession[];
  conditioningSessions: ConditioningSession[];
  nutritionLogs: DailyNutrition[];
  readinessLogs: ReadinessCheck[];
  onSaveBjjSession: (session: BJJSession) => void;
  onDeleteBjjSession: (id: string) => void;
  onSaveConditioningSession: (session: ConditioningSession) => void;
  onSaveNutritionLog: (log: DailyNutrition) => void;
  onSaveReadinessLog: (check: ReadinessCheck) => void;
  onSaveWeight: (entry: WeightEntry) => void;
  onDeleteWeight: (id: string) => void;
  onSaveBloodMarker: (marker: BloodMarker) => void;
  onDeleteBloodMarker: (id: string) => void;
}

export const BJJHealthView: React.FC<BJJHealthViewProps> = ({
  user,
  selectedDate,
  weightLogs,
  bloodMarkers,
  bjjSessions,
  conditioningSessions,
  nutritionLogs,
  readinessLogs,
  onSaveBjjSession,
  onDeleteBjjSession,
  onSaveConditioningSession,
  onSaveNutritionLog,
  onSaveReadinessLog,
  onSaveWeight,
  onDeleteWeight,
  onSaveBloodMarker,
  onDeleteBloodMarker
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tatame' | 'conditioning' | 'nutrition' | 'weight' | 'blood'>('tatame');

  // Modal BJJ Check-in
  const [isBjjModalOpen, setIsBjjModalOpen] = useState(false);
  const [editingBjjSession, setEditingBjjSession] = useState<BJJSession | undefined>(undefined);

  // Exame modal state
  const [isMarkerModalOpen, setIsMarkerModalOpen] = useState(false);
  const [markerName, setMarkerName] = useState('');
  const [markerCategory, setMarkerCategory] = useState<BloodMarker['category']>('Metabólico');
  const [markerUnit, setMarkerUnit] = useState('mg/dL');
  const [markerValue, setMarkerValue] = useState('');
  const [markerMin, setMarkerMin] = useState('');
  const [markerMax, setMarkerMax] = useState('');

  // Peso form state
  const [newWeight, setNewWeight] = useState<string>('');
  const [newHeight, setNewHeight] = useState<string>('178');
  const [weightDate, setWeightDate] = useState<string>(selectedDate);

  // Sessões e dados da data selecionada
  const currentBjjSession = bjjSessions.find((s) => s.date === selectedDate);
  const currentConditioningSession = conditioningSessions.find((s) => s.date === selectedDate);
  const currentNutritionLog = nutritionLogs.find((s) => s.date === selectedDate);
  const currentReadinessLog = readinessLogs.find((s) => s.date === selectedDate);

  // Cálculos de Peso & IMC
  const latestWeightEntry = weightLogs[weightLogs.length - 1];
  const currentWeight = latestWeightEntry?.weightKg || 84.0;
  const currentHeightCm = latestWeightEntry?.heightCm || 178;
  const heightM = currentHeightCm / 100;
  const imc = (currentWeight / (heightM * heightM)).toFixed(1);

  const getImcClassification = (val: number) => {
    if (val < 18.5) return { label: 'Abaixo do peso', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (val < 25) return { label: 'Peso Saudável (Eutrofia)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val < 30) return { label: 'Sobrepeso / Massa Muscular BJJ', color: 'text-purple-700 bg-purple-50 border-purple-200' };
    return { label: 'Obesidade Grau I', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const imcInfo = getImcClassification(parseFloat(imc));

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    const entry: WeightEntry = {
      id: `w-${Date.now()}`,
      date: weightDate,
      weightKg: parseFloat(newWeight),
      heightCm: parseFloat(newHeight) || 178,
      notes: 'Registro via painel BJJ & Saúde'
    };
    onSaveWeight(entry);
    setNewWeight('');
  };

  const handleAddMarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!markerName || !markerValue) return;

    const val = parseFloat(markerValue);
    const min = parseFloat(markerMin) || 0;
    const max = parseFloat(markerMax) || 100;
    let status: BloodMarker['status'] = 'OPTIMAL';
    if (val < min || val > max) {
      status = 'ATTENTION';
    }

    const marker: BloodMarker = {
      id: `b-${Date.now()}`,
      name: markerName,
      category: markerCategory,
      unit: markerUnit,
      value: val,
      minOptimal: min,
      maxOptimal: max,
      status,
      date: new Date().toISOString().split('T')[0]
    };

    onSaveBloodMarker(marker);
    setIsMarkerModalOpen(false);
    setMarkerName('');
    setMarkerValue('');
    setMarkerMin('');
    setMarkerMax('');
  };

  return (
    <div className="space-y-6">
      {/* Banner de Graduação & Faixa Autêntica */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-clean flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Jornada Road to Purple Belt
            </span>
            <span className="text-xs text-slate-500 font-medium">Meta: 31/12/2026</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rumo à {user.targetRank}
            </h2>
            <BJJBeltBadge
              color={user.currentBeltColor || 'BLUE'}
              degrees={user.currentDegrees || 3}
              size="md"
              showLabel
            />
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Integração integral: tatame 12:00, preparação física Samuel Saraiva (6 semanas), nutrição Aline Marinho, mobilidade e indicadores de sangue.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBjjSession(currentBjjSession);
            setIsBjjModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <Flame size={15} />
          {currentBjjSession ? 'Editar Check-in Tatame' : 'Novo Check-in BJJ (Hoje)'}
        </button>
      </div>

      {/* Sub-navegação das Abas do BJJ & Saúde */}
      <div className="flex space-x-1 sm:space-x-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('tatame')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'tatame' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flame size={14} />
          Tatame & Rolas
        </button>

        <button
          onClick={() => setActiveSubTab('conditioning')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'conditioning' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Dumbbell size={14} />
          Força (Saraiva) & Pilates
        </button>

        <button
          onClick={() => setActiveSubTab('nutrition')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'nutrition' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Apple size={14} />
          Nutrição (Aline Marinho)
        </button>

        <button
          onClick={() => setActiveSubTab('weight')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'weight' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Scale size={14} />
          Peso & IMC ({currentWeight}kg)
        </button>

        <button
          onClick={() => setActiveSubTab('blood')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'blood' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart size={14} />
          Biomarcadores de Sangue ({bloodMarkers.length})
        </button>
      </div>

      {/* 1. ABA TATAME */}
      {activeSubTab === 'tatame' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ReadinessCard
                selectedDate={selectedDate}
                readiness={currentReadinessLog}
                onSaveReadiness={onSaveReadinessLog}
              />
            </div>
            <div className="lg:col-span-2">
              <BJJSessionsList
                sessions={bjjSessions}
                scheduleConfig={user.scheduleConfig}
                onOpenCheckin={() => {
                  setEditingBjjSession(undefined);
                  setIsBjjModalOpen(true);
                }}
                onEditSession={(s) => {
                  setEditingBjjSession(s);
                  setIsBjjModalOpen(true);
                }}
                onDeleteSession={onDeleteBjjSession}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. ABA FORÇA SAMUEL SARAIVA & PILATES */}
      {activeSubTab === 'conditioning' && (
        <ConditioningView
          selectedDate={selectedDate}
          sessions={conditioningSessions}
          onSaveSession={onSaveConditioningSession}
        />
      )}

      {/* 3. ABA NUTRIÇÃO ALINE MARINHO */}
      {activeSubTab === 'nutrition' && (
        <NutritionView
          selectedDate={selectedDate}
          nutritionLog={currentNutritionLog}
          defaultProtocol={currentBjjSession ? 'DIAS_COM_BJJ' : 'DIAS_SEM_BJJ'}
          onSaveNutrition={onSaveNutritionLog}
        />
      )}

      {/* 4. ABA PESO & IMC */}
      {activeSubTab === 'weight' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus size={16} className="text-purple-600" />
              Novo Registro de Pesagem
            </h3>
            <form onSubmit={handleAddWeight} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="ex: 83.5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Altura (cm)</label>
                <input
                  type="number"
                  placeholder="ex: 178"
                  value={newHeight}
                  onChange={(e) => setNewHeight(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Data</label>
                <input
                  type="date"
                  value={weightDate}
                  onChange={(e) => setWeightDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Salvar Pesagem
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Histórico de Pesagens & Evolução</h3>
                <p className="text-xs text-slate-500">Classificação atual: <span className="font-semibold text-purple-700">{imcInfo.label} (IMC {imc})</span></p>
              </div>
              <span className="text-xs text-slate-500">Meta: {user.targetWeightKg || 82.5} kg</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-2.5">Data</th>
                    <th className="py-2.5">Peso</th>
                    <th className="py-2.5">IMC</th>
                    <th className="py-2.5">Notas</th>
                    <th className="py-2.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {weightLogs.slice().reverse().map((entry) => {
                    const hM = (entry.heightCm || 178) / 100;
                    const calculatedImc = (entry.weightKg / (hM * hM)).toFixed(1);

                    return (
                      <tr key={entry.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 text-slate-700 font-sans">
                          {new Date(entry.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-2.5 font-bold text-slate-900">{entry.weightKg} kg</td>
                        <td className="py-2.5 font-semibold text-purple-700">{calculatedImc}</td>
                        <td className="py-2.5 text-slate-500 font-sans">{entry.notes || '-'}</td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => onDeleteWeight(entry.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. ABA BIOMARCADORES DE SANGUE */}
      {activeSubTab === 'blood' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Painel de Biomarcadores & Exames de Sangue</h3>
              <p className="text-xs text-slate-500">Acompanhamento bioquímico para longevidade e alto rendimento no tatame.</p>
            </div>
            <button
              onClick={() => setIsMarkerModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm"
            >
              <Plus size={14} />
              Novo Biomarcador
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {bloodMarkers.map((marker) => {
              const isOptimal = marker.status === 'OPTIMAL';

              return (
                <div
                  key={marker.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isOptimal
                      ? 'border-slate-200 bg-white hover:border-purple-200'
                      : 'border-amber-200 bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {marker.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug mt-0.5">{marker.name}</h4>
                    </div>
                    <button
                      onClick={() => onDeleteBloodMarker(marker.id)}
                      className="text-slate-300 hover:text-rose-500 p-0.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-black font-mono text-slate-900">
                      {marker.value} <span className="text-xs font-normal text-slate-500">{marker.unit}</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                        isOptimal
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {isOptimal ? 'Otimizado' : 'Atenção'}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-400 font-mono">
                    Faixa alvo: {marker.minOptimal} - {marker.maxOptimal} {marker.unit}
                  </div>
                </div>
              );
            })}
          </div>

          {isMarkerModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-4">Adicionar Biomarcador</h3>
                <form onSubmit={handleAddMarker} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Nome do Exame</label>
                    <input
                      type="text"
                      placeholder="ex: Ferritina, Testosterona Livre, Vitamina D"
                      value={markerName}
                      onChange={(e) => setMarkerName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Categoria</label>
                      <select
                        value={markerCategory}
                        onChange={(e) => setMarkerCategory(e.target.value as any)}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
                      >
                        <option value="Metabólico">Metabólico</option>
                        <option value="Lipídico">Lipídico</option>
                        <option value="Hormonal">Hormonal</option>
                        <option value="Hepático/Renal">Hepático/Renal</option>
                        <option value="Vitaminas">Vitaminas</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Unidade</label>
                      <input
                        type="text"
                        placeholder="mg/dL, ng/mL"
                        value={markerUnit}
                        onChange={(e) => setMarkerUnit(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Valor</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="85"
                        value={markerValue}
                        onChange={(e) => setMarkerValue(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Mínimo</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="70"
                        value={markerMin}
                        onChange={(e) => setMarkerMin(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Máximo</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="99"
                        value={markerMax}
                        onChange={(e) => setMarkerMax(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsMarkerModalOpen(false)}
                      className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl"
                    >
                      Adicionar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Check-in BJJ */}
      <BJJCheckinModal
        isOpen={isBjjModalOpen}
        onClose={() => {
          setIsBjjModalOpen(false);
          setEditingBjjSession(undefined);
        }}
        selectedDate={selectedDate}
        existingSession={editingBjjSession}
        onSaveSession={(session) => {
          onSaveBjjSession(session);
          setIsBjjModalOpen(false);
          setEditingBjjSession(undefined);
        }}
      />
    </div>
  );
};
