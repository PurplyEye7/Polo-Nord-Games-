import { 
  Gamepad2, 
  Flame, 
  Sparkles, 
  Heart, 
  History, 
  Puzzle as PuzzleIcon, 
  Car, 
  Crosshair, 
  Zap, 
  Sparkle,
  Shuffle, 
  PlusCircle,
  Snowflake
} from "lucide-react";

// Standard gaming categories matching our games.json
export const CATEGORIES = [
  { id: "Action", name: "Action", icon: "Zap", description: "Fast-paced adrenaline triggers" },
  { id: "Arcade", name: "Arcade", icon: "Gamepad2", description: "Retro-style score-chasers" },
  { id: "Driving", name: "Driving", icon: "Car", description: "Adrenaline high-speed racers" },
  { id: "Puzzle", name: "Puzzle", icon: "PuzzleIcon", description: "Brain-bending mental testing" },
  { id: "Shooting", name: "Shooting", icon: "Crosshair", description: "Target-hitting direct defense" },
];

export default function Sidebar({
  activeSection,
  onSelectSection,
  favoritesCount,
  recentCount,
  customCount,
  onOpenSuggestModal,
  onTriggerRandomGame,
  isOpenMobile,
  setIsOpenMobile,
}) {

  const renderIcon = (iconName, active) => {
    const cls = `w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-cyan-300'}`;
    switch (iconName) {
      case "Zap": return <Zap className={cls} />;
      case "Gamepad2": return <Gamepad2 className={cls} />;
      case "Car": return <Car className={cls} />;
      case "PuzzleIcon": return <PuzzleIcon className={cls} />;
      case "Crosshair": return <Crosshair className={cls} />;
      default: return <Gamepad2 className={cls} />;
    }
  };

  const navItems = [
    { id: "all", label: "All Games", icon: <Gamepad2 className="w-5 h-5" /> },
    { id: "hot", label: "Hot Games", icon: <Flame className="w-5 h-5 text-amber-500 animate-pulse" /> },
    { id: "new", label: "New Games", icon: <Sparkles className="w-5 h-5 text-cyan-300" /> },
  ];

  const userItems = [
    { id: "favorites", label: "My Favorites", count: favoritesCount, icon: <Heart className="w-5 h-5 text-cyan-400 fill-cyan-400/10" /> },
    { id: "recent", label: "Recently Played", count: recentCount, icon: <History className="w-5 h-5 text-cyan-300" /> },
    { id: "custom", label: "Custom Games", count: customCount, icon: <Sparkle className="w-5 h-5 text-emerald-300" /> },
  ];

  return (
    <aside
      id="sidebar-navigation"
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950/60 backdrop-blur-md border-r border-[#1e2f47]/40 flex flex-col justify-between p-4 transition-transform duration-300 md:translate-x-0 md:static md:h-auto
        ${isOpenMobile ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="space-y-6">
        {/* Playable site header branding */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1e2f47]/40 md:block">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg shadow-lg shadow-cyan-500/10 flex items-center justify-center font-bold text-lg text-white">
              <Snowflake className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <h1 className="font-display font-black tracking-tight text-[13px] bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-transparent">
                POLO NORD GAMES
              </h1>
              <p className="text-[9px] font-bold text-cyan-400 tracking-[0.2em] font-display uppercase leading-none">
                Giochi Sottozero
              </p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsOpenMobile(false)}
            className="md:hidden p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="space-y-2">
          <button
            id="btn-random-game"
            onClick={() => {
              onTriggerRandomGame();
              setIsOpenMobile(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all duration-200 shadow-md shadow-cyan-600/20 active:scale-95 cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
            PLAY RANDOM GAME
          </button>
          
          <button
            id="btn-suggest-game"
            onClick={() => {
              onOpenSuggestModal();
              setIsOpenMobile(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a111a] hover:bg-[#0f1b29] border border-[#1e2f47]/40 text-zinc-200 font-medium text-xs transition-all duration-200 hover:border-cyan-500/40 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            ADD EMBED GAME
          </button>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5 animate-fade-in">
          <h2 className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest pl-2 mb-2">
            Explore
          </h2>
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  setIsOpenMobile(false);
                }}
                className={`w-full group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  active 
                    ? "bg-cyan-500/10 text-cyan-300 border-l-4 border-cyan-400 shadow-inner" 
                    : "text-zinc-300 hover:bg-[#0c1624]/40 hover:text-white"
                }`}
              >
                <span className={active ? "text-cyan-400" : "text-zinc-400 group-hover:text-cyan-300"}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* User Collections */}
        <div className="space-y-1.5">
          <h2 className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest pl-2 mb-2">
            My Hub
          </h2>
          {userItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  setIsOpenMobile(false);
                }}
                className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  active 
                    ? "bg-cyan-500/10 text-cyan-300 border-l-4 border-cyan-400 shadow-inner" 
                    : "text-zinc-300 hover:bg-[#0c1624]/40 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? "text-cyan-400 animate-pulse" : "text-zinc-400 group-hover:text-cyan-300"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                    active ? "bg-cyan-500/20 text-cyan-350" : "bg-[#060a10] text-zinc-400 group-hover:bg-zinc-800"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Categories Section */}
        <div className="space-y-1.5">
          <h2 className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest pl-2 mb-2">
            Categories
          </h2>
          {CATEGORIES.map((cat) => {
            const active = activeSection === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectSection(cat.id);
                  setIsOpenMobile(false);
                }}
                className={`w-full group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  active 
                    ? "bg-cyan-500/10 text-cyan-300 border-l-4 border-cyan-400 shadow-inner" 
                    : "text-zinc-300 hover:bg-[#0c1624]/40 hover:text-white"
                }`}
              >
                {renderIcon(cat.icon, active)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Branding section */}
      <div id="sidebar-footer" className="mt-6 pt-3 border-t border-[#1e2f47]/40 space-y-1 text-center">
        <p className="text-[10px] text-cyan-300/60 font-medium">polonordgames.it &copy; 2026</p>
        <p className="text-[8px] text-cyan-400/60 uppercase font-mono tracking-wider">I Giochi Più Freddi del Web</p>
      </div>
    </aside>
  );
}
