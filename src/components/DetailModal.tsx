import React from 'react';
import { X } from 'lucide-react';
import { Book, Character, House, Spell } from '../types/api';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Book | Character | House | Spell | null;
  type: 'book' | 'character' | 'house' | 'spell';
}

export const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, data, type }) => {
  if (!isOpen || !data) return null;

  const renderContent = () => {
    switch (type) {
      case 'book':
        const book = data as Book;
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full rounded-lg shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x400/7c3aed/ffffff?text=Harry+Potter';
                  }}
                />
              </div>
              <div className="md:w-2/3 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h2>
                  <p className="text-purple-600 font-medium">Book #{book.number}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Release Date:</span>
                    <p className="text-gray-600">{book.releaseDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Pages:</span>
                    <p className="text-gray-600">{book.pages}</p>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-600 leading-relaxed mt-2">{book.description}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'character':
        const character = data as Character;
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={character.image}
                  alt={character.fullName}
                  className="w-full rounded-lg shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x400/6b7280/ffffff?text=Character';
                  }}
                />
              </div>
              <div className="md:w-2/3 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{character.fullName}</h2>
                  {character.nickname && (
                    <p className="text-purple-600 font-medium">"{character.nickname}"</p>
                  )}
                </div>
                <div className="space-y-3">
                  {character.hogwartsHouse && (
                    <div>
                      <span className="font-medium text-gray-700">House:</span>
                      <p className="text-gray-600">{character.hogwartsHouse}</p>
                    </div>
                  )}
                  {character.interpretedBy && (
                    <div>
                      <span className="font-medium text-gray-700">Portrayed by:</span>
                      <p className="text-gray-600">{character.interpretedBy}</p>
                    </div>
                  )}
                  {character.birthdate && (
                    <div>
                      <span className="font-medium text-gray-700">Birth Date:</span>
                      <p className="text-gray-600">{character.birthdate}</p>
                    </div>
                  )}
                  {character.children && character.children.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Children:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {character.children.map((child, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {child}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'house':
        const house = data as House;
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{house.emoji}</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{house.house}</h2>
              <p className="text-purple-600 font-medium">Founded by {house.founder}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-gray-700">House Colors:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {house.colors.map((color, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">House Animal:</span>
                  <p className="text-gray-600">{house.animal}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Element:</span>
                  <p className="text-gray-600">{house.element}</p>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">House Traits:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {house.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'spell':
        const spell = data as Spell;
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white">
              <h2 className="text-4xl font-bold mb-4 italic">{spell.spell}</h2>
              <p className="text-xl text-purple-100">{spell.use}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-lg font-semibold text-gray-900">Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};