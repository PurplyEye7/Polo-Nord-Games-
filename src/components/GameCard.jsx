import React from "react";
import { Play, Flame, Sparkles, Heart, Users } from "lucide-react";

export default function GameCard({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) {
  
  // High fidelity visual counters formatted like CrazyGames (e.g., 245K)
  const formatPlays = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onPlay(game)}
      className="group relative aspect-video bg-[#0b121e]/40 rounded-2xl overflow-hidden cursor-pointer border border-[#1e2f47]/40 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1.5 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
    >
      {/* Background Thumbnail Image with overlay loaders */}
      <img
        src={game.thumbnail}
        alt={game.title}
        referrerPolicy="no-referrer"
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />
      
      {/* Dark gradient mapping to make absolute texts readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#02050b]/95 via-[#02050b]/40 to-transparent group-hover:via-[#02050b]/50 transition-all duration-300" />

      {/* Top-left score badge */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#02050b]/80 backdrop-blur-md border border-[#1e2f47]/40 text-xs font-bold text-yellow-500 select-none shadow-sm">
        <span>★</span>
        <span className="font-mono text-[11px] font-semibold">{game.rating.toFixed(1)}</span>
      </div>

      {/* Top-right badges (HOT, NEW, or Custom Game indicator) */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
        {game.isCustom ? (
          <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-md border border-emerald-400/40 text-[9px] font-bold uppercase tracking-wider text-emerald-100 shadow-sm">
            Custom
          </span>
        ) : (
          <>
            {game.isHot && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-500/90 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-md animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-current" />
                HOT
              </span>
            )}
            {game.isNew && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-cyan-500/95 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-200 fill-current" />
                NEW
              </span>
            )}
          </>
        )}

        {/* Dynamic Favorite Toggle Action */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
            isFavorite
              ? "bg-cyan-500 border-cyan-400 text-white"
              : "bg-[#02050b]/60 hover:bg-[#02050b]/95 border-[#1e2f47]/50 text-zinc-300 hover:text-white"
          }`}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Center Hover Action (Play vector) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="p-3.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full text-white shadow-lg shadow-cyan-500/30 transform scale-75 group-hover:scale-100 transition-transform duration-300 border-2 border-white/25">
          <Play className="w-6 h-6 fill-current stroke-[2]" />
        </div>
      </div>

      {/* Lower Label Section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end border-t border-transparent group-hover:border-white/5 bg-gradient-to-t from-[#02050b] to-transparent">
        <div className="space-y-1">
          {/* Primary category text */}
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest leading-none">
            {game.category}
          </span>
          {/* Main game item label */}
          <h3 className="font-display font-black text-sm tracking-wide text-white line-clamp-1 group-hover:text-cyan-300 transition-colors duration-200">
            {game.title}
          </h3>
        </div>

        {/* Transition Details (shows lists of tags + play count on hover) */}
        <div className="h-0 opacity-0 group-hover:h-5 group-hover:opacity-100 group-hover:mt-1.5 flex items-center justify-between text-[10px] text-zinc-400 duration-300 overflow-hidden leading-none select-none">
          <div className="flex gap-1.5 max-w-[70%] overflow-hidden text-clip whitespace-nowrap">
            {game.tags.slice(0, 2).map((t) => (
              <span key={t} className="px-1.5 py-0.5 rounded bg-zinc-850/90 text-zinc-300 font-medium">
                #{t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] font-semibold text-zinc-400">
            <Users className="w-3 h-3 text-cyan-400/80" />
            <span>{formatPlays(game.playCount)} plays</span>
          </div>
        </div>
      </div>
    </div>
  );
}
