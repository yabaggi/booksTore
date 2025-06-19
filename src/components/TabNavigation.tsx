import React from 'react';
import { BookOpen, Users, Home, Sparkles } from 'lucide-react';

export type TabType = 'books' | 'characters' | 'houses' | 'spells';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'books' as TabType, label: 'Books', icon: BookOpen },
  { id: 'characters' as TabType, label: 'Characters', icon: Users },
  { id: 'houses' as TabType, label: 'Houses', icon: Home },
  { id: 'spells' as TabType, label: 'Spells', icon: Sparkles },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};