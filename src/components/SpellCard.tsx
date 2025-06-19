import React from 'react';
import { Spell } from '../types/api';
import { Sparkles, Wand2 } from 'lucide-react';

interface SpellCardProps {
  spell: Spell;
  onClick?: () => void;
}

export const SpellCard: React.FC<SpellCardProps> = ({ spell, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 p-6 text-white relative overflow-hidden"
    >
      <div className="absolute top-2 right-2 opacity-20">
        <Sparkles className="w-12 h-12" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <Wand2 className="w-5 h-5" />
          <span className="text-sm opacity-90">Spell</span>
        </div>

        <h3 className="text-2xl font-bold mb-4 italic">
          {spell.spell}
        </h3>

        <p className="text-purple-100 leading-relaxed">
          {spell.use}
        </p>
      </div>

      <div className="absolute -bottom-4 -right-4 opacity-10">
        <div className="w-24 h-24 rounded-full bg-white" />
      </div>
    </div>
  );
};