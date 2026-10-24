import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Cloud, 
  CloudCheck, 
  CloudOff, 
  RefreshCw 
} from 'lucide-react';
import { UserProfile } from '../../types';
import { SyncStatus } from '../../services/gistSync';

interface HeaderProps {
  user: UserProfile;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenSettings: () => void;
  onOpenSync: () => void;
  syncStatus?: SyncStatus;
  isSyncConfigured?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  selectedDate,
  onSelectDate,
  onOpenSettings,
  onOpenSync,
  syncStatus = 'unconfigured',
  isSyncConfigured = false
}) => {
  const handlePrevDay = () => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onSelectDate(today);
  };

  const formattedDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-purple-200">
            <span className="font-bold text-lg tracking-wider">LN</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">Life Nexus</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
                White Executive
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Dashboard de Excelência & Propósito</p>
          </div>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80 shadow-inner">
          <button
            onClick={handlePrevDay}
            className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition-colors shadow-none hover:shadow-sm"
            title="Dia anterior"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2 px-2.5">
            <Calendar size={14} className="text-purple-600" />
            <span className="text-xs font-semibold text-slate-700 capitalize tracking-tight">
              {formattedDate}
            </span>
          </div>

          <button
            onClick={handleNextDay}
            className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition-colors shadow-none hover:shadow-sm"
            title="Próximo dia"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handleToday}
            className="px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100/60 rounded-md transition-colors ml-1"
          >
            Hoje
          </button>
        </div>

        {/* Profile & Cloud Sync */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Sync Button */}
          <button
            onClick={onOpenSync}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              syncStatus === 'synced'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : syncStatus === 'syncing'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : syncStatus === 'error'
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : syncStatus === 'offline'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Gerenciar sincronização em nuvem e pareamento de dispositivos"
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw size={14} className="animate-spin text-purple-600" />
            ) : syncStatus === 'synced' ? (
              <CloudCheck size={15} className="text-emerald-600" />
            ) : syncStatus === 'error' || syncStatus === 'offline' ? (
              <CloudOff size={15} />
            ) : (
              <Cloud size={15} />
            )}
            <span className="hidden md:inline">
              {syncStatus === 'synced'
                ? 'Nuvem Conectada'
                : syncStatus === 'syncing'
                ? 'Sincronizando'
                : syncStatus === 'error'
                ? 'Erro Nuvem'
                : isSyncConfigured
                ? 'Nuvem Pronta'
                : 'Conectar Nuvem'}
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
              <div className="text-[11px] font-medium text-purple-600">{user.currentRank}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Configurações do Perfil"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
