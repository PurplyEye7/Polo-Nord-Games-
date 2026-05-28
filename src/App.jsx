import React, { useState, useEffect } from "react";
import { 
  Menu, 
  Search, 
  Sparkles, 
  Flame, 
  Grid,
  AlertCircle,
  Snowflake
} from "lucide-react";

import gamesData from "./data/games.json";
import Sidebar, { CATEGORIES } from "./components/Sidebar.jsx";
import GameCard from "./components/GameCard.jsx";
import GamePlayer from "./components/GamePlayer.jsx";
import SuggestGameModal from "./components/SuggestGameModal.jsx";
import Clock from "./components/Clock.jsx";
import SnowBackground from "./components/SnowBackground.jsx";

export default function App() {
  const [games, setGames] = useState([]);
  const [activeSection, setActiveSection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGame, setActiveGame] = useState(null);
  
  // Custom modals & responsiveness
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Lists held in LocalStorage for continuous offline unblocked state persistence
  const [favorites, setFavorites] = useState([]);
  const [recentPlays, setRecentPlays] = useState([]);

  // 1. Initial Data Loading & Synchronization
  useEffect(() => {
    // Sync default games
    const baseGames = gamesData;

    // Sync any user-added custom unblocked games from localStorage
    const savedCustom = localStorage.getItem("custom-games");
    let customGames = [];
    if (savedCustom) {
      try {
        customGames = JSON.parse(savedCustom);
      } catch (err) {
        console.error("Failed to parse custom games localstorage array", err);
      }
    }

    // Set combined state list (custom items are marked, and can be deleted)
    // Mark first elements as Hot or New dynamically if missing
    const combined = [...baseGames, ...customGames].map((gm, i) => {
      if (i === 1 || i === 2 || i === 5) gm.isHot = true;
      if (i === 3 || i === 6 || i === 9) gm.isNew = true;
      return gm;
    });
    setGames(combined);

    // Sync favorites
    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (_) {}
    }

    // Sync recently played
    const savedRecents = localStorage.getItem("recent-plays");
    if (savedRecents) {
      try {
        setRecentPlays(JSON.parse(savedRecents));
      } catch (_) {}
    }
  }, []);

  // 2. Play game - tracking recently played items
  const handlePlayGame = (game) => {
    setActiveGame(game);
    
    // Add game ID to recently played tracking list (bring to top, max 12 unique items)
    const updatedRecents = [game.id, ...recentPlays.filter((id) => id !== game.id)].slice(0, 12);
    setRecentPlays(updatedRecents);
    localStorage.setItem("recent-plays", JSON.stringify(updatedRecents));

    // Simulate playCount increments just for current session metrics
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, playCount: g.playCount + 1 } : g))
    );
  };

  // 3. Toggle Bookmark Favorite status
  const handleToggleFavorite = (gameId, event) => {
    if (event) {
      event.stopPropagation(); // Avoid triggering card play action on overlay click
    }
    
    const isFav = favorites.includes(gameId);
    let updated;
    if (isFav) {
      updated = favorites.filter((id) => id !== gameId);
    } else {
      updated = [...favorites, gameId];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // 4. Custom Iframe embed adding
  const handleAddCustomGame = (newGame) => {
    // Save to State
    const updatedGames = [newGame, ...games];
    setGames(updatedGames);

    // Filter only custom items and persist in localstorage
    const savedCustomRaw = localStorage.getItem("custom-games");
    let currentCustom = [];
    if (savedCustomRaw) {
      try {
        currentCustom = JSON.parse(savedCustomRaw);
      } catch (_) {}
    }
    const updatedCustom = [newGame, ...currentCustom];
    localStorage.setItem("custom-games", JSON.stringify(updatedCustom));

    setIsSuggestModalOpen(false);
    // Auto switch to custom games section to display the newly loaded piece!
    setActiveSection("custom");
  };

  // 5. Trigger picking a completely random unblocked game from list
  const handleTriggerRandomGame = () => {
    if (games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * games.length);
    handlePlayGame(games[randomIndex]);
  };

  // 6. Filtering Logic
  const filteredGames = games.filter((g) => {
    // Section filters
    if (activeSection === "hot" && !g.isHot) return false;
    if (activeSection === "new" && !g.isNew) return false;
    if (activeSection === "favorites" && !favorites.includes(g.id)) return false;
    if (activeSection === "recent" && !recentPlays.includes(g.id)) return false;
    if (activeSection === "custom" && !g.isCustom) return false;
    if (
      activeSection !== "all" &&
      activeSection !== "hot" &&
      activeSection !== "new" &&
      activeSection !== "favorites" &&
      activeSection !== "recent" &&
      activeSection !== "custom" &&
      g.category !== activeSection
    ) {
      return false;
    }

    // Search keyword filters
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchTitle = g.title.toLowerCase().includes(q);
      const matchCategory = g.category.toLowerCase().includes(q);
      const matchTags = g.tags.some((t) => t.toLowerCase().includes(q));
      const matchDesc = g.description.toLowerCase().includes(q);
      return matchTitle || matchCategory || matchTags || matchDesc;
    }

    return true;
  });

  // Calculate counts for Sidebar user stats
  const favoritesCount = favorites.length;
  const recentCount = recentPlays.length;
  const customCount = games.filter((g) => g.isCustom).length;

  // Header and Hero Visual Mapping (Game of the Week)
  // Let's use HexGL or 2048 as the cinematic banner
  const heroGame = games.find((g) => g.id === "hexgl") || games[0];

  return (
    <div id="unblocked-games-hub" className="min-h-screen flex text-slate-100 font-sans selection:bg-cyan-500 selection:text-white pb-12 relative overflow-hidden">
      
      {/* Dynamic atmospheric drifting snow */}
      <SnowBackground />
      
      {/* Sidebar Navigation Panel wrapper */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          setSearchQuery(""); // Clear search on category clicks
          setActiveGame(null); // Return to grid listing
        }}
        favoritesCount={favoritesCount}
        recentCount={recentCount}
        customCount={customCount}
        onOpenSuggestModal={() => setIsSuggestModalOpen(true)}
        onTriggerRandomGame={handleTriggerRandomGame}
        isOpenMobile={isMobileSidebarOpen}
        setIsOpenMobile={setIsMobileSidebarOpen}
      />

      {/* Main Content Pane area */}
      <main id="main-content-layout" className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Core navigation header row */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          {/* Branding Toggle for Mobile viewports */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-805 text-zinc-300 hover:text-cyan-404 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                <h2 className="font-display font-bold text-lg text-white font-sans sm:text-xl tracking-tight leading-tight">
                  {activeSection === "all" ? "Arcade Dashboard" : `${activeSection} Hub`}
                </h2>
                <p className="text-[11px] text-zinc-400">
                  {filteredGames.length} unblocked game{filteredGames.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            {/* Injected Local Clock widget inside standard responsive flow */}
            <div className="sm:hidden">
              <Clock />
            </div>
          </div>

          {/* Search bar & Live Clock widget */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Elegant Search Container */}
            <div className="relative w-full sm:w-64 max-w-sm">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                maxLength={30}
                placeholder="Search games, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#09101b]/80 border border-[#1e2f47]/50 focus:border-cyan-500 text-white placeholder-zinc-400 outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-medium backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white text-xs font-bold leading-none"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Digital Clock aligned to edge */}
            <div className="hidden sm:block">
              <Clock />
            </div>
          </div>
        </header>

        {/* Dynamic Inner UI View routing (Playing a game vs displaying catalogs) */}
        {activeGame ? (
          <GamePlayer
            game={activeGame}
            onClose={() => setActiveGame(null)}
            allGames={games}
            onPlayRecommended={(g) => handlePlayGame(g)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={(id) => handleToggleFavorite(id)}
          />
        ) : (
          <div className="space-y-6">
                       {/* 1. Hero Spotlight weekly block - Only render when viewing All catalog and no search is entered */}
            {activeSection === "all" && !searchQuery && heroGame && (
              <div
                id="hero-banner-weekly"
                className="relative bg-[#09111e]/40 rounded-3xl overflow-hidden border border-[#1e2f47]/50 shadow-2xl flex flex-col md:flex-row p-5 sm:p-7 items-center justify-between gap-6 backdrop-blur-md"
              >
                {/* Background ambient particles */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-[#0e1726]/10 to-blue-500/10 pointer-events-none" />

                <div className="space-y-4 max-w-lg relative z-10 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider text-cyan-300 select-none animate-pulse">
                      <Snowflake className="w-3.5 h-3.5 stroke-[2] text-cyan-405" />
                      GIOCO SOTTOZERO DELLA SETTIMANA
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-none text-shadow-sm">
                      {heroGame.title}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed max-w-prose">
                      {heroGame.description}
                    </p>
                  </div>

                  {/* Horizontal small tags list */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                    {heroGame.tags.slice(0, 4).map((tg) => (
                      <span key={tg} className="px-2 py-0.5 rounded bg-zinc-950/80 text-[10px] text-zinc-305 border border-[#1e324c]/40 font-medium">
                        #{tg}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => handlePlayGame(heroGame)}
                      className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs tracking-wider transition-all hover:scale-[1.03] shadow-lg shadow-cyan-600/15 uppercase cursor-pointer"
                    >
                      PLAY FULLSCREEN NOW
                    </button>
                  </div>
                </div>

                {/* Hero showcase design image */}
                <div className="relative w-full md:w-[280px] lg:w-[350px] aspect-video rounded-2xl overflow-hidden border border-[#1e2f47]/50 shadow-md">
                  <img
                    src={heroGame.thumbnail}
                    alt="Featured gameplay presentation"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
                </div>
              </div>
            )}

            {/* Quick Horizontal filters list row matching CrazyGames style */}
            <div id="quick-categories-pill-row" className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin select-none">
              <button
                onClick={() => {
                  setActiveSection("all");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  activeSection === "all"
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                All Arcade
              </button>

              <button
                onClick={() => {
                  setActiveSection("hot");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  activeSection === "hot"
                    ? "bg-amber-600 border-amber-550 text-white"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                Hot Busters
              </button>

              <button
                onClick={() => {
                  setActiveSection("new");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  activeSection === "new"
                    ? "bg-blue-600/20 border-blue-400 alt-indigo text-blue-400"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 whitespace-nowrap" />
                New Releases
              </button>

              <div className="w-[1px] h-4 bg-zinc-800" />

              {CATEGORIES.map((cat) => {
                const active = activeSection === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveSection(cat.id);
                      setSearchQuery("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                      active
                        ? "bg-blue-600/10 border-blue-500 text-blue-400"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-805"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* 2. Primary Games Grid */}
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-xs tracking-widest text-zinc-500 uppercase pl-1 select-none">
                {activeSection === "all" 
                  ? "Standard Unblocked Catalog" 
                  : activeSection === "hot"
                  ? "Top Rated Trending Playables"
                  : activeSection === "new"
                  ? "Brand New Retro Embeds"
                  : activeSection === "favorites"
                  ? "Bookmarked Favorites Directory"
                  : activeSection === "recent"
                  ? "History - Recently Played"
                  : activeSection === "custom"
                  ? "Player's Self-Added Sandbox Embeds"
                  : `${activeSection} Category Games`}
              </h3>

              {filteredGames.length === 0 ? (
                /* No games found placeholder wrapper */
                <div className="p-12 text-center rounded-2xl bg-[#09111e]/40 border border-[#1e2f47]/40 space-y-4 max-w-lg mx-auto select-none backdrop-blur-md">
                  <div className="inline-flex p-3 rounded-full bg-zinc-950 text-cyan-300">
                    <AlertCircle className="w-8 h-8 text-cyan-405" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display font-bold text-white text-base">No unblocked games found</h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      No game elements match your filter parameter or search input &ldquo;{searchQuery}&rdquo;.
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={() => {
                        setActiveSection("all");
                        setSearchQuery("");
                      }}
                      className="px-4 py-2 text-xs rounded-xl bg-[#0c1624] border border-[#1e324c]/40 hover:bg-[#112136] text-white font-semibold cursor-pointer"
                    >
                      Reset Searches
                    </button>
                    <button
                      onClick={() => setIsSuggestModalOpen(true)}
                      className="px-4 py-2 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer shadow-md shadow-cyan-600/10"
                    >
                      Embed a Game
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredGames.map((g) => (
                    <GameCard
                      key={g.id}
                      game={g}
                      onPlay={(selectedGroup) => handlePlayGame(selectedGroup)}
                      isFavorite={favorites.includes(g.id)}
                      onToggleFavorite={(id, event) => handleToggleFavorite(id, event)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Unblocked Gaming Tips Accordion block below */}
            <div id="unblocked-faq-pane" className="border-t border-[#1e2f47]/40 pt-8 space-y-4">
              <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                <Snowflake className="w-4 h-4 text-cyan-400 animate-pulse" /> Polo Nord Unblocked Games FAQs &amp; Consigli
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-400 max-w-5xl leading-relaxed">
                <div className="space-y-1.5 p-4 bg-[#09111e]/40 rounded-xl border border-[#1e2f47]/30 backdrop-blur-sm">
                  <span className="font-semibold text-cyan-200 block">Il portale è sicuro?</span>
                  <span>Sì! Tutti i giochi unblocked operano esclusivamente all'interno di iframe sandbox sicuri. Polo Nord Games garantisce zero download esterni e massime performance termiche sottozero per il tuo computer!</span>
                </div>
                <div className="space-y-1.5 p-4 bg-[#09111e]/40 rounded-xl border border-[#1e2f47]/30 backdrop-blur-sm">
                  <span className="font-semibold text-cyan-200 block">Posso davvero inserire giochi personalizzati?</span>
                  <span>Certamente! Clicca su &quot;Aggiungi Gioco Embed&quot; inserendo qualsiasi URL di gioco HTML5 HTTPS (come siti GitHub Pages, itch.io, ecc.). Apparirà istantaneamente nella tua dashboard polare salvato localmente!</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 3. Suggest custom Game Modal popup */}
      {isSuggestModalOpen && (
        <SuggestGameModal
          onClose={() => setIsSuggestModalOpen(false)}
          onAddCustomGame={handleAddCustomGame}
        />
      )}

    </div>
  );
}
