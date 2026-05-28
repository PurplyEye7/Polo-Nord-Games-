import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Maximize2, 
  Monitor, 
  Volume2, 
  Info, 
  Keyboard, 
  MessageSquare,
  Sparkles,
  User,
  Star,
  Snowflake
} from "lucide-react";

export default function GamePlayer({
  game,
  onClose,
  allGames,
  onPlayRecommended,
  isFavorite,
  onToggleFavorite,
}) {
  const [likes, setLikes] = useState(game.likes);
  const [dislikes, setDislikes] = useState(game.dislikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState("about");
  
  // Custom Reviews and Comments (saved client-side with localStorage)
  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);

  const playerContainerRef = useRef(null);
  const iframeRef = useRef(null);

  // Load and cache comments for this specific game
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments-${game.id}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      // Default initial mock comment for natural unblocked community feel
      const initialComments = [
        {
          id: "initial-1",
          gameId: game.id,
          username: "ProGamer99",
          comment: `This unblocked version of ${game.title} is absolutely perfect! Frame rate is smooth.`,
          rating: 5,
          createdAt: new Date(Date.now() - 3600000 * 4).toLocaleDateString(),
        },
        {
          id: "initial-2",
          gameId: game.id,
          username: "NoodBuster",
          comment: "I love playing this during my free study hours. Controls work perfectly.",
          rating: 4,
          createdAt: new Date(Date.now() - 3600000 * 24).toLocaleDateString(),
        }
      ];
      setComments(initialComments);
      localStorage.setItem(`comments-${game.id}`, JSON.stringify(initialComments));
    }

    // Reset reaction states when swapping games
    setLikes(game.likes);
    setDislikes(game.dislikes);
    setHasLiked(false);
    setHasDisliked(false);
  }, [game]);

  // Handle standard browser fullscreen API for the iframe container
  const handleToggleFullscreen = () => {
    if (playerContainerRef.current) {
      if (!document.fullscreenElement) {
        playerContainerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Handle like vote
  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      if (hasDisliked) {
        setDislikes((prev) => prev - 1);
        setHasDisliked(false);
      }
    }
  };

  // Handle dislike vote
  const handleDislike = () => {
    if (hasDisliked) {
      setDislikes((prev) => prev - 1);
      setHasDisliked(false);
    } else {
      setDislikes((prev) => prev + 1);
      setHasDisliked(true);
      if (hasLiked) {
        setLikes((prev) => prev - 1);
        setHasLiked(false);
      }
    }
  };

  // Add Comment review
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment = {
      id: "comment-" + Date.now().toString(),
      gameId: game.id,
      username: commentName.trim(),
      comment: commentText.trim(),
      rating: commentRating,
      createdAt: new Date().toLocaleDateString(),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`comments-${game.id}`, JSON.stringify(updated));
    setCommentText("");
    setCommentName("");
    setCommentRating(5);
  };

  // Get game recommendations lists: Games of the same category, excluding the current game
  const recommendations = allGames
    .filter((g) => g.id !== game.id)
    .sort((a, b) => {
      // Prioritize same category, then playCount
      if (a.category === game.category && b.category !== game.category) return -1;
      if (a.category !== game.category && b.category === game.category) return 1;
      return b.playCount - a.playCount;
    })
    .slice(0, 6);

  // Render instruction keyboard key visualizer helpers
  const renderControlBadge = (keyText) => {
    return (
      <kbd className="px-2 py-1 mx-0.5 rounded-md bg-zinc-800 border-b-2 border-zinc-950 text-[11px] font-mono text-cyan-400 font-bold shadow-sm">
        {keyText}
      </kbd>
    );
  };

  return (
    <div id="game-player-route-view" className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
      
      {/* Play Area (Main Column takes 3/4 layout blocks on wide viewports) */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Navigation Action header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="group flex items-center gap-2 text-zinc-350 hover:text-white font-semibold text-xs py-1.5 px-3 rounded-xl bg-[#09111e]/45 border border-[#1e2f47]/50 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-cyan-400" />
            TORNA ALLA DASHBOARD
          </button>

          {/* Display tags */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-zinc-400 font-medium select-none">Stato Gioco:</span>
            <span className="px-2.5 py-1 rounded-full bg-cyan-600/10 text-cyan-300 font-bold border border-cyan-500/20 flex items-center gap-1 backdrop-blur-sm">
              <Snowflake className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              Sottozero {game.category} Play
            </span>
          </div>
        </div>

        {/* Central Iframe Container with Full controls wrapped */}
        <div 
          ref={playerContainerRef} 
          id="iframe-player-wrapper"
          className={`relative bg-black rounded-2xl overflow-hidden border border-[#1e2f47]/60 shadow-2xl transition-all duration-300 ${
            isTheaterMode ? "max-h-[85vh] aspect-[18/9]" : "aspect-video"
          }`}
        >
          <iframe
            ref={iframeRef}
            src={game.iframeUrl}
            title={game.title}
            allow="fullscreen; autoplay; gamepad; keyboard"
            sandbox="allow-scripts allow-same-origin allow-forms"
            className="w-full h-full border-0 absolute inset-0 bg-slate-950"
          />

          {/* Fullscreen Overlay Controls (visible if HTML5 elements request fullscreen directly) */}
          <div className="absolute top-3 left-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-bold text-white uppercase tracking-wider shadow">
              {game.title}
            </span>
          </div>
        </div>

        {/* Dynamic Controls action-button rail */}
        <div id="player-action-rail" className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#09111e]/40 border border-[#1e2f47]/45 rounded-2xl shadow-xl backdrop-blur-md">
          {/* Reaction states */}
          <div className="flex items-center gap-3">
            {/* Likes */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                hasLiked 
                  ? "bg-cyan-600/25 border-cyan-500/50 text-cyan-300" 
                  : "bg-[#0d1624] border-[#1e2f47]/40 hover:border-[#2b4260]/60 text-zinc-300 hover:text-white"
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
              <span className="font-mono text-[11px]">{likes.toLocaleString()}</span>
            </button>

            {/* Dislikes */}
            <button
              onClick={handleDislike}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                hasDisliked 
                  ? "bg-rose-500/25 border-rose-500/50 text-rose-450" 
                  : "bg-[#0d1624] border-[#1e2f47]/40 hover:border-[#2b4260]/60 text-zinc-300 hover:text-white"
              }`}
            >
              <ThumbsDown className={`w-4 h-4 ${hasDisliked ? "fill-current" : ""}`} />
              <span className="font-mono text-[11px]">{dislikes.toLocaleString()}</span>
            </button>

            {/* Favorite check */}
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isFavorite 
                  ? "bg-cyan-600 border-cyan-505 text-white" 
                  : "bg-[#0d1624] border-[#1e2f47]/40 hover:border-cyan-500/40 text-zinc-305 hover:text-white"
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Technical and framing actions */}
          <div className="flex items-center gap-3">
            {/* Quick unblocked tip */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-zinc-350 bg-[#0d1624]/60 px-2.5 py-1.5 rounded-lg border border-[#1e2f47]/30 font-semibold uppercase tracking-wider">
              <Volume2 className="w-3.5 h-3.5 text-cyan-405" /> Audio Stereo Attivo
            </span>

            {/* Theater mode */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isTheaterMode 
                  ? "bg-cyan-600/20 border-cyan-405/50 text-cyan-301" 
                  : "bg-[#0d1624] border-[#1e2f47]/40 hover:border-cyan-505/30 text-zinc-300 hover:text-white"
              }`}
              title="Expand browser viewport"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden md:inline">Theater Mode</span>
            </button>

            {/* Browser Full Screen */}
            <button
              onClick={handleToggleFullscreen}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer border border-[#1e2f47]/40"
              title="Full Screen gaming"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Full Screen</span>
            </button>
          </div>
        </div>

        {/* Info, Instructions, and Community Tabulation Menu */}
        <div className="bg-[#09111e]/40 border border-[#1e2f47]/45 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          {/* Tabs bar */}
          <div className="flex border-b border-[#1e2f47]/40 bg-[#050910]/80 px-2 select-none">
            {[
              { id: "about", label: "Descrizione", icon: <Info className="w-4 h-4" /> },
              { id: "controls", label: "Tasti & Comandi", icon: <Keyboard className="w-4 h-4" /> },
              { id: "comments", label: "Recensioni & Opinioni", icon: <MessageSquare className="w-4 h-4" /> },
            ].map((tab) => {
              const active = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    active 
                      ? "border-cyan-400 text-cyan-300 font-extrabold" 
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab active panel container */}
          <div className="p-5">
            {/* Tab: About */}
            {selectedTab === "about" && (
              <div className="space-y-4 animate-fade-in text-xs leading-relaxed text-zinc-300">
                <div className="space-y-1.5">
                  <h3 className="font-display font-semibold text-sm text-zinc-100 uppercase tracking-wide">
                    {game.title} - Dettagli Gioco
                  </h3>
                  <p>{game.description}</p>
                </div>
                
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-cyan-600/10 border border-cyan-500/20 text-cyan-300 rounded-md">
                    Categoria: {game.category}
                  </span>
                  {game.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-[10px] font-bold bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-zinc-805 text-zinc-400 text-[11px] font-medium font-mono">
                  <div>
                    <span className="block text-zinc-500 uppercase text-[9px] font-bold font-sans">Engine Gioco</span>
                    <span className="text-white">HTML5 Web Player</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 uppercase text-[9px] font-bold font-sans">Unblocked Status</span>
                    <span className="text-cyan-400 animate-pulse">100% Sempre Disponibile</span>
                  </div>
                  <div>
                    <span className="block text-zinc-550 uppercase text-[9px] font-bold font-sans">Porting</span>
                    <span className="text-white">Polo Nord Sandbox</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 uppercase text-[9px] font-bold font-sans">Developer Rating</span>
                    <span className="text-yellow-400 font-bold">★ {game.rating} / 5</span>
                  </div>
                </div>
              </div>
            )}            {/* Tab: Controls */}
            {selectedTab === "controls" && (
              <div className="space-y-4 animate-fade-in text-xs leading-relaxed text-slate-300">
                <div className="space-y-1.5">
                  <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wide">
                    Istruzioni di gioco per {game.title}
                  </h3>
                  <p>{game.instructions}</p>
                </div>

                {/* Keyboard and inputs visualization based on category or content metadata */}
                <div className="p-4 bg-[#050910]/50 border border-[#1e2f47]/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-semibold text-white block">Schema d&apos;Input Consigliato</span>
                    <span className="text-[10px] text-zinc-400 leading-snug">Usa la tastiera standard per giocare. Assicurati di cliccare all&apos;interno dello schermo di gioco per attivare i comandi!</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 sm:pt-0">
                    {game.category === "Driving" ? (
                      <>
                        <div className="flex flex-col items-center gap-1">
                          {renderControlBadge("W / ↑")}
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Gas</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {renderControlBadge("A / L-Arrow")}
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Sinistra</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {renderControlBadge("D / R-Arrow")}
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Destra</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {renderControlBadge("S / Space")}
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Freno</span>
                        </div>
                      </>
                    ) : game.category === "Puzzle" ? (
                      <>
                        <div className="flex flex-col items-center gap-1">
                          {renderControlBadge("Arrow Keys")}
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Muovi</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {renderControlBadge("Spacebar")}
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Ruota</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {renderControlBadge("Left-Click")}
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Interact</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center gap-1">
                          {renderControlBadge("WASD / Arrows")}
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Movimento</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {renderControlBadge("Spacebar")}
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Azione</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {renderControlBadge("Mouse Cursor")}
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Punta / Clicca</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Comments */}
            {selectedTab === "comments" && (
              <div className="space-y-6 animate-fade-in text-xs">
                
                {/* Submit Comment Form */}
                <form onSubmit={handleAddComment} className="p-4 bg-[#050910] border border-[#1e2f47]/40 rounded-xl space-y-3.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">Lascia una recensione polare</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        maxLength={25}
                        placeholder="Nome Utente (es. AlpacaPolare)"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-[#1e2f47]/50 text-white outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-805 justify-between">
                      <span className="text-zinc-400 font-medium font-bold">Rating:</span>
                      <div className="flex gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setCommentRating(star)}
                            className="hover:scale-125 focus:outline-none transition-transform"
                          >
                            <Star className={`w-3.5 h-3.5 ${star <= commentRating ? "fill-current" : "text-zinc-650"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <textarea
                    required
                    maxLength={200}
                    placeholder={`Cosa ne pensi di ${game.title}? Scrivi qui la tua opinione (Max 200 caratteri)...`}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-805 text-white outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white transition-all duration-150 text-[11px] cursor-pointer"
                    >
                      PUBBLICA OPINIONE
                    </button>
                  </div>
                </form>

                {/* Comments Stream lists */}
                <div className="space-y-3.5">
                  <h4 className="font-display font-semibold text-zinc-300 uppercase tracking-widest text-[10px] pl-1">
                    Opinioni di Polo Nord ({comments.length})
                  </h4>

                  {comments.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500 font-medium">
                      Ancora nessuna opinione per questo gioco. Rompi il ghiaccio e scrivi la prima!
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {comments.map((cmt) => (
                        <div key={cmt.id} className="p-3 bg-[#09111e]/40 border border-[#1e2f47]/30 rounded-xl flex items-start gap-3">
                          <div className="bg-[#0d1624] p-2 rounded-lg text-cyan-400">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-bold text-zinc-200">{cmt.username}</span>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-0.5 text-yellow-405 text-[10px]">
                                  {Array.from({ length: cmt.rating }).map((_, i) => (
                                    <span key={i}>★</span>
                                  ))}
                                  {Array.from({ length: 5 - cmt.rating }).map((_, i) => (
                                    <span key={i} className="text-zinc-650">★</span>
                                  ))}
                                </div>
                                <span className="text-[10px] font-mono text-zinc-500 font-bold">{cmt.createdAt}</span>
                              </div>
                            </div>
                            <p className="text-zinc-300 text-xs italic">
                              &ldquo;{cmt.comment}&rdquo;
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recommended Games Sidebar Column (1/4 space) */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-sm tracking-tight text-white uppercase flex items-center gap-2 pl-1 select-none">
          <Snowflake className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          PROXIME GIOCABILI
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {recommendations.map((recGame) => (
            <div
              key={recGame.id}
              onClick={() => onPlayRecommended(recGame)}
              className="group relative flex bg-[#09111e]/40 border border-[#1e2f47]/45 hover:border-cyan-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 p-2.5 items-center gap-3.5 backdrop-blur-md"
            >
              {/* Image side */}
              <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-950 border border-[#1e2f47]/30">
                <img
                  src={recGame.thumbnail}
                  alt={recGame.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Text metadata */}
              <div className="flex-1 min-w-0 pr-1 select-none">
                <span className="text-[9px] uppercase font-bold text-cyan-400 tracking-wider block leading-none mb-1">
                  {recGame.category}
                </span>
                <h4 className="font-display font-bold text-xs text-white truncate group-hover:text-cyan-300 transition-colors leading-tight">
                  {recGame.title}
                </h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-yellow-405 text-[10px] font-bold">★</span>
                  <span className="font-mono text-[9px] font-extrabold text-zinc-350">{recGame.rating.toFixed(1)}</span>
                  <span className="text-[8px] text-zinc-500 font-semibold">• {(recGame.playCount / 1000).toFixed(0)}K plays</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
