import React, { useState } from "react";
import { Link2, Sparkles, FolderPlus, X } from "lucide-react";

export default function SuggestGameModal({
  onClose,
  onAddCustomGame,
}) {
  const [title, setTitle] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [category, setCategory] = useState("Arcade");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !iframeUrl.trim()) {
      setErrorMsg("Title and Game Iframe URL are required!");
      return;
    }

    // Basic Iframe URL sanity checking - must start with HTTPS to load securely inside the App
    if (!iframeUrl.toLowerCase().startsWith("https://")) {
      setErrorMsg("For security reasons, standard browser iframes require secure HTTPS URLs starting with 'https://'!");
      return;
    }

    // Split tags
    const finalTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // If no tags specified, default to Category
    if (finalTags.length === 0) {
      finalTags.push(category, "Custom");
    }

    // Choose visual thumbnail placeholder based on category
    let finalThumbnail = thumbnailUrl.trim();
    if (!finalThumbnail) {
      if (category === "Driving") {
        finalThumbnail = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80";
      } else if (category === "Puzzle") {
        finalThumbnail = "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=500&auto=format&fit=crop&q=80";
      } else if (category === "Shooting") {
        finalThumbnail = "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=500&auto=format&fit=crop&q=80";
      } else if (category === "Action") {
        finalThumbnail = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=80";
      } else {
        finalThumbnail = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80";
      }
    }

    const customGame = {
      id: "custom-" + Date.now().toString(),
      title: title.trim(),
      thumbnail: finalThumbnail,
      iframeUrl: iframeUrl.trim(),
      category: category,
      description: description.trim() || "A custom embedded unblocked game added by the player.",
      instructions: instructions.trim() || "Follow the default game menus and controls.",
      rating: 4.5,
      likes: 12,
      dislikes: 1,
      playCount: 42,
      tags: finalTags,
      isCustom: true,
      isNew: true,
    };

    onAddCustomGame(customGame);
  };

  return (
    <div
      id="suggest-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div
        id="suggest-modal-content"
        className="w-full max-w-lg bg-[#0a121e]/95 border border-[#1e2f47]/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transition-all transform duration-305"
      >
        {/* Header container */}
        <div className="flex items-center justify-between p-4 bg-[#050910] border-b border-[#1e2f47]/40">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display font-bold text-base text-white tracking-wide">
              Embed Custom Unblocked Game
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-1.5 rounded-lg bg-zinc-850 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Quick instructions banner */}
          <div className="p-3 text-[11px] text-zinc-350 leading-relaxed bg-[#050910] rounded-xl border border-[#1e2f47]/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 inline mr-1.5 align-middle" />
            Any standard HTML5 game hosted on pages like GitHub, itch.io (embedded games), or game portals that support iframe embeds can be added here!
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Game Title *
              </label>
              <input
                type="text"
                required
                maxLength={40}
                placeholder="e.g. My Favorite Runner"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrorMsg("");
                }}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 focus:border-cyan-500 text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-[34px] px-3 py-1.5 text-xs rounded-xl bg-zinc-950 border border-zinc-800 focus:border-cyan-500 text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              >
                <option value="Arcade">Arcade</option>
                <option value="Action">Action</option>
                <option value="Driving">Driving</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Shooting">Shooting</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Iframe Game Embed URL *
              </label>
              <span className="text-[9px] text-cyan-400 font-mono flex items-center gap-0.5">
                <Link2 className="w-3 h-3" /> Secure HTTPS
              </span>
            </div>
            <input
              type="url"
              required
              placeholder="e.g. https://gabrielecirulli.github.io/2048/"
              value={iframeUrl}
              onChange={(e) => {
                setIframeUrl(e.target.value);
                setErrorMsg("");
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 focus:border-cyan-500 text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Thumbnail URL (Optional)
            </label>
            <input
              type="url"
              placeholder="e.g. https://images.unsplash.com/... (Leaves empty for category defaults)"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 focus:border-cyan-500 text-white outline-none focus:ring-1 focus:ring-cyan-510 transition-all font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Description
              </label>
              <textarea
                placeholder="A brief description of this game..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 focus:border-cyan-500 text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Gameplay Controls
              </label>
              <textarea
                placeholder="e.g. Use WASD keys or click screen..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 focus:border-cyan-505 text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Gameplay Tags (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="e.g. singleplayer, sandbox, retro, 2D"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 focus:border-cyan-505 text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
            />
          </div>

          {/* Buttons action bar */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-semibold text-xs text-white transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs text-white transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-600/10 text-center"
            >
              Embed Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
