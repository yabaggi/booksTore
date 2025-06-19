import React, { useState, useEffect } from 'react';
import { HarryPotterAPI } from './services/harryPotterApi';
import { Book, Character, House, Spell, Language } from './types/api';
import { TabNavigation, TabType } from './components/TabNavigation';
import { LanguageSelector } from './components/LanguageSelector';
import { LoadingSpinner } from './components/LoadingSpinner';
import { BookCard } from './components/BookCard';
import { CharacterCard } from './components/CharacterCard';
import { HouseCard } from './components/HouseCard';
import { SpellCard } from './components/SpellCard';
import { DetailModal } from './components/DetailModal';
import { Sparkles, Shuffle, Wand2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('books');
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [books, setBooks] = useState<Book[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [spells, setSpells] = useState<Spell[]>([]);
  
  // Random data states
  const [randomBook, setRandomBook] = useState<Book | null>(null);
  const [randomCharacter, setRandomCharacter] = useState<Character | null>(null);
  const [randomHouse, setRandomHouse] = useState<House | null>(null);
  const [randomSpell, setRandomSpell] = useState<Spell | null>(null);
  
  // Modal states
  const [modalData, setModalData] = useState<Book | Character | House | Spell | null>(null);
  const [modalType, setModalType] = useState<'book' | 'character' | 'house' | 'spell'>('book');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    HarryPotterAPI.setLanguage(language);
    loadInitialData();
  }, [language]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [booksData, charactersData, housesData, spellsData] = await Promise.all([
        HarryPotterAPI.getAllBooks(),
        HarryPotterAPI.getAllCharacters(),
        HarryPotterAPI.getAllHouses(),
        HarryPotterAPI.getAllSpells(),
      ]);
      
      setBooks(booksData);
      setCharacters(charactersData);
      setHouses(housesData);
      setSpells(spellsData);
      
      // Load random items
      loadRandomItems();
      
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRandomItems = async () => {
    try {
      const [randomBookData, randomCharacterData, randomHouseData, randomSpellData] = await Promise.all([
        HarryPotterAPI.getRandomBook(),
        HarryPotterAPI.getRandomCharacter(),
        HarryPotterAPI.getRandomHouse(),
        HarryPotterAPI.getRandomSpell(),
      ]);
      
      setRandomBook(randomBookData);
      setRandomCharacter(randomCharacterData);
      setRandomHouse(randomHouseData);
      setRandomSpell(randomSpellData);
    } catch (error) {
      console.error('Failed to load random items:', error);
    }
  };

  const handleItemClick = (item: Book | Character | House | Spell, type: 'book' | 'character' | 'house' | 'spell') => {
    setModalData(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const renderTabContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    switch (activeTab) {
      case 'books':
        return (
          <div className="space-y-6">
            {randomBook && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Shuffle className="w-5 h-5 text-purple-600" />
                    <span>Random Book</span>
                  </h2>
                  <button
                    onClick={loadRandomItems}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    New Random
                  </button>
                </div>
                <BookCard
                  book={randomBook}
                  onClick={() => handleItemClick(randomBook, 'book')}
                />
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">All Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book, index) => (
                  <BookCard
                    key={index}
                    book={book}
                    onClick={() => handleItemClick(book, 'book')}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'characters':
        return (
          <div className="space-y-6">
            {randomCharacter && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Shuffle className="w-5 h-5 text-purple-600" />
                    <span>Random Character</span>
                  </h2>
                  <button
                    onClick={loadRandomItems}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    New Random
                  </button>
                </div>
                <CharacterCard
                  character={randomCharacter}
                  onClick={() => handleItemClick(randomCharacter, 'character')}
                />
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">All Characters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character, index) => (
                  <CharacterCard
                    key={index}
                    character={character}
                    onClick={() => handleItemClick(character, 'character')}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'houses':
        return (
          <div className="space-y-6">
            {randomHouse && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Shuffle className="w-5 h-5 text-purple-600" />
                    <span>Random House</span>
                  </h2>
                  <button
                    onClick={loadRandomItems}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    New Random
                  </button>
                </div>
                <HouseCard
                  house={randomHouse}
                  onClick={() => handleItemClick(randomHouse, 'house')}
                />
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hogwarts Houses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {houses.map((house, index) => (
                  <HouseCard
                    key={index}
                    house={house}
                    onClick={() => handleItemClick(house, 'house')}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'spells':
        return (
          <div className="space-y-6">
            {randomSpell && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Shuffle className="w-5 h-5 text-purple-600" />
                    <span>Random Spell</span>
                  </h2>
                  <button
                    onClick={loadRandomItems}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    New Random
                  </button>
                </div>
                <SpellCard
                  spell={randomSpell}
                  onClick={() => handleItemClick(randomSpell, 'spell')}
                />
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">All Spells</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spells.map((spell, index) => (
                  <SpellCard
                    key={index}
                    spell={spell}
                    onClick={() => handleItemClick(spell, 'spell')}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Wand2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Wizarding World Explorer
                </h1>
                <p className="text-purple-200 text-sm hidden md:block">
                  Discover the magic of Harry Potter
                </p>
              </div>
            </div>
            
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        {renderTabContent()}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
        type={modalType}
      />

      {/* Floating Action Button for Random */}
      <button
        onClick={loadRandomItems}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-30"
        title="Get Random Items"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    </div>
  );
}

export default App;