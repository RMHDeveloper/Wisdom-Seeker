
import React, { useState, useEffect, useRef } from 'react';
import { Philosopher, PhilosophyResponse, HistoryItem } from './types';
import { getStoicPerspective } from './services/geminiService';
import { 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon, 
  AdjustmentsHorizontalIcon,
  AcademicCapIcon,
  ScaleIcon,
  ShieldCheckIcon,
  BoltIcon,
  ClockIcon,
  TrashIcon,
  ArrowPathIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [situation, setSituation] = useState('');
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher>(Philosopher.RAJINIKANTH);
  const [response, setResponse] = useState<PhilosophyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [view, setView] = useState<'consult' | 'history'>('consult');
  
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wisdom_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (sit: string, resp: PhilosophyResponse, phil: Philosopher) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      situation: sit,
      response: resp.advice,
      philosopher: phil
    };
    const newHistory = [newItem, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('wisdom_history', JSON.stringify(newHistory));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;

    setLoading(true);
    setResponse(null);
    try {
      const data = await getStoicPerspective(situation, selectedPhilosopher);
      setResponse(data);
      saveToHistory(situation, data, selectedPhilosopher);
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      alert("The Sage is silent. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Erase your past reflections?")) {
      setHistory([]);
      localStorage.removeItem('wisdom_history');
    }
  };

  const philosophers = [
    { 
      id: Philosopher.RAJINIKANTH, 
      name: "Rajinikanth", 
      title: "The Superstar", 
      color: "bg-orange-800",
      description: "Charisma and spirituality.",
      image: "https://m.media-amazon.com/images/I/81JJ4GoWAmL._AC_UF894,1000_QL80_.jpg" 
    },
    { 
      id: Philosopher.ABDUL_KALAM, 
      name: "Abdul Kalam", 
      title: "People's President", 
      color: "bg-blue-800",
      description: "Igniting minds and dreaming big.",
      image: "https://i0.wp.com/apeejay.news/wp-content/uploads/2024/11/071124-APJ-Abdul-Kalam.jpg?resize=740%2C629&ssl=1"
    },
    { 
      id: Philosopher.THIRUVALLUVAR, 
      name: "Thiruvalluvar", 
      title: "The Divine Poet", 
      color: "bg-amber-800",
      description: "Sacred universal ethics.",
      image: "https://cdn.dribbble.com/userupload/10989094/file/original-5477184df705e63826ebb64e77786814.jpg?format=webp&resize=400x300&vertical=center"
    }
  ];

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-6 md:py-10">
      {/* Header */}
      <header className="text-center mb-8 md:mb-10">
        <h1 className="font-serif text-3xl md:text-5xl text-stone-900 mb-2 tracking-tight">Bunny Seeks Wisdom</h1>
        <p className="text-stone-600 text-sm md:text-base max-w-xl mx-auto px-4">
          "A drop of wisdom from the ocean of greatness."
        </p>
        
        <nav className="flex justify-center mt-6 space-x-2 md:space-x-4">
          <button 
            onClick={() => setView('consult')}
            className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-sm md:text-base flex items-center transition ${view === 'consult' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 md:w-5 md:h-5 mr-1.5" />
            Seek Wisdom
          </button>
          <button 
            onClick={() => setView('history')}
            className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-sm md:text-base flex items-center transition ${view === 'history' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            <ClockIcon className="w-4 h-4 md:w-5 md:h-5 mr-1.5" />
            Reflection Log
          </button>
        </nav>
      </header>

      {view === 'consult' ? (
        <main className="space-y-8 md:space-y-12">
          {/* Philosopher Selection */}
          <section className="fade-in">
            <h2 className="font-serif text-xl md:text-2xl text-stone-800 mb-4 text-center">Whose Guidance Do You Need?</h2>
            <div className="grid grid-cols-3 gap-3 md:gap-6">
              {philosophers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPhilosopher(p.id)}
                  className={`relative overflow-hidden rounded-xl md:rounded-2xl transition-all duration-300 transform group ${
                    selectedPhilosopher === p.id 
                    ? 'ring-2 md:ring-4 ring-amber-500 scale-105 z-10 shadow-lg' 
                    : 'grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                  }`}
                >
                  <img src={p.image} alt={p.name} className="w-full h-24 md:h-40 object-cover" />
                  <div className={`absolute inset-0 ${p.color} bg-opacity-40 flex flex-col justify-end p-2 md:p-4 text-left`}>
                    <p className="text-[10px] md:text-xs uppercase tracking-tighter md:tracking-widest text-amber-200 font-bold hidden sm:block">{p.title}</p>
                    <h3 className="font-serif text-sm md:text-lg text-white font-bold leading-tight">{p.name}</h3>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-center mt-3 text-stone-500 italic text-xs md:text-sm px-4">
              {philosophers.find(p => p.id === selectedPhilosopher)?.description}
            </p>
          </section>

          {/* Input Area */}
          <section className="fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="parchment p-5 md:p-8 rounded-xl">
              <h2 className="font-serif text-lg md:text-2xl text-stone-800 mb-3">Your Current Challenge</h2>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="What troubles your mind today?"
                  className="w-full h-24 md:h-32 bg-transparent border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm md:text-lg resize-none p-2 placeholder-stone-400 text-stone-800"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    disabled={loading || !situation.trim()}
                    className={`flex items-center px-6 py-2 md:px-8 md:py-3 rounded-lg font-bold text-sm md:text-lg transition-all ${
                      loading || !situation.trim() 
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                      : 'bg-stone-900 text-amber-50 hover:bg-stone-800 active:scale-95 shadow-md'
                    }`}
                  >
                    {loading ? (
                      <><ArrowPathIcon className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" /> Thinking...</>
                    ) : (
                      <><BookOpenIcon className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Receive Wisdom</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Response Section */}
          <div ref={responseRef}>
            {response && (
              <section className="fade-in space-y-6 md:space-y-8">
                <div className="parchment p-6 md:p-10 rounded-xl relative shadow-xl overflow-hidden border-stone-200">
                  <div className="absolute top-0 left-0 w-12 h-12 md:w-24 md:h-24 border-t-2 md:border-t-4 border-l-2 md:border-l-4 border-stone-400 opacity-20 -mt-1 -ml-1 rounded-tl-xl"></div>
                  
                  <div className="flex items-center mb-6 md:mb-8 border-b border-stone-200 pb-4">
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-stone-800 flex items-center justify-center text-amber-400 mr-3 md:mr-4 shadow-inner shrink-0">
                      {selectedPhilosopher === Philosopher.RAJINIKANTH ? <StarIcon className="w-6 h-6 md:w-8 md:h-8" /> : <AcademicCapIcon className="w-6 h-6 md:w-8 md:h-8" />}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg md:text-2xl text-stone-900 leading-tight">{selectedPhilosopher}'s Counsel</h3>
                      <p className="text-stone-500 text-[10px] md:text-sm italic">Wisdom tailored for you</p>
                    </div>
                  </div>

                  {response.kural && (
                    <div className="mb-6 md:mb-8 p-4 md:p-6 bg-amber-50 border-l-4 md:border-l-8 border-amber-600 rounded-r-lg shadow-sm">
                      <h4 className="text-amber-800 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-2">Sacred Couplet</h4>
                      <p className="font-serif text-base md:text-xl text-stone-900 leading-relaxed italic whitespace-pre-line">
                        {response.kural}
                      </p>
                    </div>
                  )}

                  <div className="text-stone-800 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 italic whitespace-pre-line border-l-2 border-stone-200 pl-4">
                    "{response.advice}"
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 md:pt-6 border-t border-stone-200">
                    <div>
                      <h4 className="flex items-center font-bold text-stone-900 mb-2 md:mb-3 uppercase tracking-wider text-[10px] md:text-sm">
                        <AdjustmentsHorizontalIcon className="w-4 h-4 md:w-5 md:h-5 mr-1.5 text-stone-700" />
                        Key Insights
                      </h4>
                      <ul className="space-y-1.5 md:space-y-2">
                        {response.principles.map((p, idx) => (
                          <li key={idx} className="flex items-start text-stone-600 text-xs md:text-sm">
                            <span className="text-stone-800 mr-2">•</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="flex items-center font-bold text-stone-900 mb-2 md:mb-3 uppercase tracking-wider text-[10px] md:text-sm">
                        <ScaleIcon className="w-4 h-4 md:w-5 md:h-5 mr-1.5 text-stone-700" />
                        Core Value
                      </h4>
                      <p className="text-stone-600 text-[11px] md:text-sm bg-stone-100 p-2 md:p-3 rounded-lg border-l-2 md:border-l-4 border-stone-800">
                        {response.virtueFocus}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 md:mt-10 bg-stone-900 text-amber-50 p-4 md:p-6 rounded-lg shadow-md">
                    <h4 className="flex items-center font-bold mb-2 uppercase tracking-wider text-[10px] md:text-sm text-amber-400">
                      <ShieldCheckIcon className="w-4 h-4 md:w-5 md:h-5 mr-1.5" />
                      Historical Anchor
                    </h4>
                    <p className="italic text-sm md:text-lg">"{response.historicalContext}"</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      ) : (
        <section className="fade-in space-y-4 md:space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl md:text-3xl text-stone-800">Reflection Log</h2>
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-red-600 hover:text-red-800 flex items-center text-[10px] md:text-xs font-bold uppercase"
              >
                <TrashIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12 md:py-20 bg-stone-100 rounded-xl border-2 border-dashed border-stone-300">
              <BoltIcon className="w-8 h-8 md:w-12 md:h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 italic text-sm md:text-base">Your scroll of reflections is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <div key={item.id} className="parchment p-4 md:p-5 rounded-lg hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] md:text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-[9px] md:text-[10px] bg-stone-800 text-amber-50 px-1.5 py-0.5 rounded">
                      {item.philosopher}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-800 text-sm md:text-base mb-1 truncate">"{item.situation}"</h4>
                  <p className="text-stone-600 line-clamp-2 italic text-[11px] md:text-xs">
                    {item.response}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="mt-16 md:mt-20 pt-8 border-t border-stone-200 text-center text-stone-400 italic text-[10px] md:text-sm">
        <p>"Learning is a treasure that will follow its owner everywhere."</p>
        <div className="mt-3 font-sans not-italic">
          Developed by <a href="https://rabbitmarketinghouse.in" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-amber-700 font-semibold underline decoration-amber-200 underline-offset-4">Rabbit Marketing House</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
