import React, { useState } from 'react';
import { UserProfile, BJJBeltColor, BJJ_BELT_METAS } from '../../types';
import { X, Save, User, Award, Shield, Target, Calendar } from 'lucide-react';
import { BJJBeltBadge } from '../ui/BJJBeltBadge';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveUser: (u: UserProfile) => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser,
  onExportJson,
  onImportJson
}) => {
  const [name, setName] = useState(user.name);
  const [targetDate, setTargetDate] = useState(user.targetDate);
  const [targetWeight, setTargetWeight] = useState(user.targetWeightKg?.toString() || '82.5');

  // Faixa atual e graus
  const [currentBeltColor, setCurrentBeltColor] = useState<BJJBeltColor>(user.currentBeltColor || 'BLUE');
  const [currentDegrees, setCurrentDegrees] = useState<number>(user.currentDegrees ?? 3);

  // Faixa alvo e graus
  const [targetBeltColor, setTargetBeltColor] = useState<BJJBeltColor>(user.targetBeltColor || 'PURPLE');
  const [targetDegrees, setTargetDegrees] = useState<number>(user.targetDegrees ?? 0);

  if (!isOpen) return null;

  const availableBelts: { id: BJJBeltColor; label: string; colorDot: string }[] = [
    { id: 'WHITE', label: 'Branca', colorDot: 'bg-slate-200 border-slate-300' },
    { id: 'BLUE', label: 'Azul', colorDot: 'bg-blue-600 border-blue-700' },
    { id: 'PURPLE', label: 'Roxa', colorDot: 'bg-purple-700 border-purple-800' },
    { id: 'BROWN', label: 'Marrom', colorDot: 'bg-amber-900 border-amber-950' },
    { id: 'BLACK', label: 'Preta', colorDot: 'bg-neutral-900 border-neutral-950' },
  ];

  const formatRankTitle = (color: BJJBeltColor, deg: number) => {
    const meta = BJJ_BELT_METAS[color] || BJJ_BELT_METAS.PURPLE;
    if (deg === 0) return meta.name;
    return `${meta.name} (${deg}º Grau)`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      ...user,
      name,
      currentRank: formatRankTitle(currentBeltColor, currentDegrees),
      targetRank: formatRankTitle(targetBeltColor, targetDegrees),
      currentBeltColor,
      currentDegrees,
      targetBeltColor,
      targetDegrees,
      targetDate,
      targetWeightKg: parseFloat(targetWeight) || 82.5
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Configurações do Perfil</h2>
              <p className="text-xs text-slate-500">Graduação BJJ, metas e backup de dados.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SEÇÃO FAIXA ATUAL E GRAUS COM PREVIEW */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Award size={15} className="text-purple-600" />
                Faixa Atual & Graus (0 a 4)
              </span>
              <span className="text-[11px] font-semibold text-purple-700">
                {formatRankTitle(currentBeltColor, currentDegrees)}
              </span>
            </div>

            {/* Preview da Faixa */}
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-center shadow-xs">
              <BJJBeltBadge
                color={currentBeltColor}
                degrees={currentDegrees}
                size="lg"
                showLabel
              />
            </div>

            {/* Seleção de Cor da Faixa */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                Cor da Faixa
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {availableBelts.map((belt) => {
                  const isSelected = currentBeltColor === belt.id;
                  return (
                    <button
                      key={belt.id}
                      type="button"
                      onClick={() => setCurrentBeltColor(belt.id)}
                      className={`py-1.5 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-purple-50 text-purple-800 border-purple-500 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/60'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border ${belt.colorDot}`} />
                      <span className="text-[10px]">{belt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seleção de Graus (0 a 4) */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                Graus na Ponteira (Máx 4 para coloridas)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 1, 2, 3, 4].map((deg) => {
                  const isSelected = currentDegrees === deg;
                  return (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setCurrentDegrees(deg)}
                      className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {deg === 0 ? 'Lisa (0)' : `${deg}º Grau`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SEÇÃO FAIXA ALVO */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Target size={15} className="text-indigo-600" />
                Faixa Alvo (Próxima Graduação)
              </span>
              <span className="text-[11px] font-semibold text-indigo-700">
                {formatRankTitle(targetBeltColor, targetDegrees)}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {availableBelts.map((belt) => {
                const isSelected = targetBeltColor === belt.id;
                return (
                  <button
                    key={belt.id}
                    type="button"
                    onClick={() => setTargetBeltColor(belt.id)}
                    className={`py-1.5 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-500 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/60'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border ${belt.colorDot}`} />
                    <span className="text-[10px]">{belt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DADOS BÁSICOS & METAS */}
          <div>
            <label className="text-xs font-semibold text-slate-700">Nome do Atleta</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Data Alvo da Graduação</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Meta de Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          {/* BACKUP OFFLINE */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Backup Manual em Arquivo</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onExportJson}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Exportar Backup JSON
              </button>
              <label className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors text-center cursor-pointer">
                Importar Backup
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Save size={14} />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
