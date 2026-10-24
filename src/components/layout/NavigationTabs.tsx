import React from 'react';
import { 
  Compass, 
  CircleDot, 
  ShieldCheck, 
  BookOpen, 
  TrendingUp, 
  HeartPulse 
} from 'lucide-react';

export type MainTabType = 'overview' | 'habits' | 'bjj_health' | 'spiritual' | 'finance';

interface NavigationTabsProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab
}) => {
  const tabs = [
    { id: 'overview', label: 'Visão Geral (Cockpit)', icon: Compass },
    { id: 'habits', label: 'Roda de Hábitos', icon: CircleDot },
    { id: 'bjj_health', label: 'Jornada BJJ & Saúde', icon: ShieldCheck },
    { id: 'spiritual', label: 'Perspectiva Reformada', icon: BookOpen },
    { id: 'finance', label: 'Finanças (100k)', icon: TrendingUp },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id as MainTabType)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
