import React from 'react';
import { House } from '../types/api';
import { Crown, Palette, Zap } from 'lucide-react';

interface HouseCardProps {
  house: House;
  onClick?: () => void;
}

const houseGradients: Record<string, string> = {
  'Gryffindor': 'from-red-500 via-red-600 to-yellow-500',
  'Slytherin': 'from-green-500 via-green-600 to-gray-700',
  'Ravenclaw': 'from-blue-500 via-blue-600 to-gray-600',
  'Hufflepuff': 'from-yellow-500 via-yellow-600 to-gray-600',
};

export const HouseCard: React.FC<HouseCardProps> = ({ house, onClick }) => {
  const gradient = houseGradients[house.house] || 'from-gray-500 to-gray-700';

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
    >
      <div className={`bg-gradient-to-br ${gradient} p-6 text-white min-h-[300px] flex flex-col`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{house.emoji}</div>
          <Crown className="w-6 h-6 opacity-80" />
        </div>

        <h3 className="text-2xl font-bold mb-2">{house.house}</h3>
        
        <div className="flex items-center space-x-2 mb-4 opacity-90">
          <span className="text-sm">Founded by {house.founder}</span>
        </div>

        <div className="space-y-3 flex-grow">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <div className="flex space-x-1">
              {house.colors.map((color, index) => (
                <span key={index} className="text-sm opacity-90">
                  {color}{index < house.colors.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm opacity-90">{house.animal} • {house.element}</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs opacity-75 mb-2">House Traits:</p>
          <div className="flex flex-wrap gap-1">
            {(house.traits || []).slice(0, 4).map((trait, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};