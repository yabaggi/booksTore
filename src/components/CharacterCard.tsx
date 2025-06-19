import React from 'react';
import { Character } from '../types/api';
import { Home, User, Calendar } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
}

const houseColors: Record<string, string> = {
  'Gryffindor': 'from-red-500 to-yellow-500',
  'Slytherin': 'from-green-500 to-gray-700',
  'Ravenclaw': 'from-blue-500 to-gray-600',
  'Hufflepuff': 'from-yellow-500 to-gray-600',
};

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  const houseGradient = houseColors[character.hogwartsHouse] || 'from-gray-500 to-gray-700';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={character.image}
          alt={character.fullName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x400/6b7280/ffffff?text=Character';
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${houseGradient} opacity-20`} />
        <div className="absolute bottom-4 left-4 right-4">
          {character.hogwartsHouse && (
            <div className={`bg-gradient-to-r ${houseGradient} rounded-lg px-3 py-2`}>
              <span className="text-white font-bold text-sm">{character.hogwartsHouse}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {character.fullName}
        </h3>
        
        {character.nickname && (
          <p className="text-purple-600 font-medium mb-3">"{character.nickname}"</p>
        )}

        <div className="space-y-2 text-sm text-gray-600">
          {character.interpretedBy && (
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Played by {character.interpretedBy}</span>
            </div>
          )}
          
          {character.birthdate && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Born {character.birthdate}</span>
            </div>
          )}
        </div>

        {character.children && character.children.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">Children:</p>
            <div className="flex flex-wrap gap-1">
              {character.children.slice(0, 3).map((child, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                >
                  {child}
                </span>
              ))}
              {character.children.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{character.children.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};