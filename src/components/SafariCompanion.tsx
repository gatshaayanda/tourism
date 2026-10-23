"use client";

import { useEffect, useState } from "react";

type JournalEntry = { id: number; message: string };
type CompanionState = {
  version: 1;
  name: string;
  lastSeenAt: number;
  worldDay: number;
  hunger: number;
  thirst: number;
  energy: number;
  trust: number;
  sightings: number;
  visits: number;
  journal: JournalEntry[];
};
const SAVE_KEY = "botswana-safari-companion-v1";
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const initialState = (now: number): CompanionState => ({
  version: 1, name: "Pula", lastSeenAt: now, worldDay: 1,
  hunger: 28, thirst: 22, energy: 82, trust: 35, sightings: 0, visits: 1,
  journal: [{ id: now, message: "Pula arrived at the little bush camp. Your story together starts here." }]
});
function validState(value: unknown): value is CompanionState {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<CompanionState>;
  return v.version === 1 && typeof v.name === "string" && typeof v.lastSeenAt === "number"
    && Number.isFinite(v.lastSeenAt) && typeof v.worldDay === "number" && Number.isFinite(v.worldDay)
    && ["hunger", "thirst", "energy", "trust", "sightings", "visits"].every(k => typeof (v as unknown as Record<string, unknown>)[k] === "number")
    && Array.isArray(v.journal);
}
function resumeWorld(state: CompanionState, now: number): CompanionState {
  const elapsed = Math.max(0, Math.min(7 * 24 * 60 * 60 * 1000, now - state.lastSeenAt));
  const daysAway = elapsed / (8 * 60 * 60 * 1000);
  if (daysAway < 0.04) return { ...state, lastSeenAt: Math.max(state.lastSeenAt, now), visits: state.visits + 1 };
  const wholeDays = Math.floor(daysAway);
  const hunger = clamp(state.hunger + daysAway * 7);
  const thirst = clamp(state.thirst + daysAway * 8);
  const energy = clamp(state.energy + daysAway * 10);
  const needsCare = hunger > 72 || thirst > 72;
  const message = wholeDays > 0
    ? `While you were away for ${wholeDays} ${wholeDays === 1 ? "world day" : "world days"}, Pula explored the scrub, rested in the shade and found new tracks.${needsCare ? " Pula is ready for a snack and fresh water." : ""}`
    : `A little time passed at camp. Pula rested and watched the bush wake up.`;
  return {
    ...state, lastSeenAt: Math.max(state.lastSeenAt, now), worldDay: state.worldDay + wholeDays,
    hunger, thirst, energy, trust: clamp(state.trust - (needsCare ? Math.min(4, daysAway * 1.2) : 0)),
    sightings: state.sightings + Math.floor(daysAway / 1.5), visits: state.visits + 1,
    journal: [{ id: now, message }, ...state.journal].slice(0, 5)
  };
}
function Meter({ label, value, inverse = false }: { label: string; value: number; inverse?: boolean }) {
  const shown = inverse ? 100 - value : value;
  return <div className="safari-pet-meter"><div><span>{label}</span><strong>{shown}%</strong></div><div className="safari-pet-track"><span style={{ width: `${shown}%` }} /></div></div>;
}
export default function SafariCompanion() {
  const [pet, setPet] = useState<CompanionState | null>(null);
  const [message, setMessage] = useState("");
  const [rename, setRename] = useState("");
  useEffect(() => {
    const now = Date.now();
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      const saved: unknown = raw ? JSON.parse(raw) : null;
      const next = validState(saved) ? resumeWorld(saved, now) : initialState(now);
      setPet(next);
      setRename(next.name);
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
    } catch {
      const next = initialState(now);
      setPet(next);
      setRename(next.name);
    }
  }, []);
  function commit(next: CompanionState, feedback: string) {
    const saved = { ...next, lastSeenAt: Date.now(), journal: [{ id: Date.now(), message: feedback }, ...next.journal].slice(0, 5) };
    setPet(saved);
    setMessage(feedback);
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(saved)); } catch { setMessage("Your browser could not save this visit. Keep this tab open while you play."); }
  }
  function act(action: "feed" | "water" | "play" | "rest" | "explore") {
    if (!pet) return;
    if (action === "feed") commit({ ...pet, hunger: clamp(pet.hunger - 32), trust: clamp(pet.trust + 3), visits: pet.visits + 1 }, "Pula enjoyed a handful of safari-safe treats and is feeling cared for.");
    if (action === "water") commit({ ...pet, thirst: clamp(pet.thirst - 38), trust: clamp(pet.trust + 2), visits: pet.visits + 1 }, "Fresh water! Pula had a good drink at camp.");
    if (action === "play") commit({ ...pet, energy: clamp(pet.energy - 16), trust: clamp(pet.trust + 10), hunger: clamp(pet.hunger + 5), visits: pet.visits + 1 }, "You played a little tracking game together. Pula trusts you a bit more.");
    if (action === "rest") commit({ ...pet, energy: clamp(pet.energy + 28), thirst: clamp(pet.thirst + 3), visits: pet.visits + 1 }, "A quiet break in the shade. Pula is rested and ready to explore again.");
    if (action === "explore") commit({ ...pet, energy: clamp(pet.energy - 12), hunger: clamp(pet.hunger + 4), sightings: pet.sightings + 1, worldDay: pet.worldDay + 1, visits: pet.visits + 1 }, "You followed fresh tracks together and added a new wildlife sighting to the camp journal.");
  }
  const mood = !pet ? "Waking up" : pet.hunger > 75 || pet.thirst > 75 ? "Looking for a little care" : pet.energy < 30 ? "Ready for a nap" : pet.trust > 70 ? "Your bush buddy" : "Curious and watching";
  return <section className="safari-pet-section" aria-labelledby="safari-pet-title">
    <div className="safari-pet-intro">
      <p className="af-eyebrow">A LITTLE WORLD THAT KEEPS GOING</p>
      <h2 id="safari-pet-title">Meet your safari <em>buddy.</em></h2>
      <p>Pop in for a moment or come back tomorrow. Pula's little camp keeps changing while you're away, and you can help shape what happens next.</p>
      <div className="safari-pet-facts"><span>WORLD DAY <b>{pet?.worldDay ?? "—"}</b></span><span>WILDLIFE SIGHTINGS <b>{pet?.sightings ?? "—"}</b></span><span>VISITS <b>{pet?.visits ?? "—"}</b></span></div>
      <p className="safari-pet-note">Saved on this device · time advances between visits · no account required.</p>
    </div>
    <div className="safari-pet-card">
      <div className="safari-pet-landscape" aria-label="Pula's bush camp">
        <span className="pet-sun" /><span className="pet-hill pet-hill-back" /><span className="pet-hill pet-hill-front" />
        <span className="pet-acacia pet-acacia-one">♣</span><span className="pet-acacia pet-acacia-two">♣</span>
        <div className="pet-animal" role="img" aria-label={pet ? `${pet.name}, your safari companion` : "Safari companion"}><svg viewBox="0 0 120 150" aria-hidden="true"><ellipse cx="60" cy="137" rx="33" ry="7" fill="#163f30" opacity=".25"/><path d="M40 95 Q20 111 30 130 Q41 141 47 124 L51 108" fill="#b9844f" stroke="#6e472d" strokeWidth="3"/><ellipse cx="60" cy="102" rx="26" ry="35" fill="#d6ad77" stroke="#6e472d" strokeWidth="3"/><ellipse cx="60" cy="111" rx="13" ry="21" fill="#f1d7a9"/><circle cx="60" cy="53" r="29" fill="#d6ad77" stroke="#6e472d" strokeWidth="3"/><circle cx="38" cy="34" r="10" fill="#d6ad77" stroke="#6e472d" strokeWidth="3"/><circle cx="82" cy="34" r="10" fill="#d6ad77" stroke="#6e472d" strokeWidth="3"/><circle cx="49" cy="52" r="3.5" fill="#2c241b"/><circle cx="71" cy="52" r="3.5" fill="#2c241b"/><ellipse cx="60" cy="65" rx="8" ry="6" fill="#6e472d"/><path d="M53 71 Q60 77 67 71" fill="none" stroke="#6e472d" strokeWidth="2" strokeLinecap="round"/><path d="M39 86 Q60 77 81 86" fill="none" stroke="#f1d7a9" strokeWidth="4" strokeLinecap="round"/><path d="M44 130 L41 140 M76 130 L79 140" stroke="#6e472d" strokeWidth="5" strokeLinecap="round"/><circle cx="91" cy="90" r="5" fill="#e6c66c"/><path d="M86 90 L96 90 M91 85 L91 95" stroke="#6e472d" strokeWidth="1.5"/></svg></div>
        <span className="pet-camp-sign">BUSH CAMP · BW</span>
      </div>
      <div className="safari-pet-profile">
        <div><p className="af-eyebrow">YOUR COMPANION</p><h3>{pet?.name ?? "Pula"}</h3><p>{mood}</p></div>
        <span className="safari-pet-heart" aria-hidden="true">♥</span>
      </div>
      {pet ? <div className="safari-pet-meters"><Meter label="Fullness" value={pet.hunger} inverse/><Meter label="Hydration" value={pet.thirst} inverse/><Meter label="Energy" value={pet.energy}/><Meter label="Trust" value={pet.trust}/></div> : <p className="safari-pet-loading">Preparing your companion's world…</p>}
      <div className="safari-pet-actions">
        <button type="button" disabled={!pet} onClick={() => act("feed")}>🍃 Feed</button>
        <button type="button" disabled={!pet} onClick={() => act("water")}>💧 Water</button>
        <button type="button" disabled={!pet} onClick={() => act("play")}>♡ Play</button>
        <button type="button" disabled={!pet} onClick={() => act("rest")}>☾ Rest</button>
        <button type="button" disabled={!pet} onClick={() => act("explore")}>⌕ Explore</button>
      </div>
      <form className="safari-pet-rename" onSubmit={e => { e.preventDefault(); if (!pet) return; const name = rename.trim().slice(0, 18); if (!name) return; commit({ ...pet, name }, `You called your safari buddy ${name}. A new chapter begins!`); }}>
        <label htmlFor="safari-pet-name">Give your buddy a name</label><div><input id="safari-pet-name" maxLength={18} value={rename} onChange={e => setRename(e.target.value)} disabled={!pet}/><button type="submit" disabled={!pet || !rename.trim()}>Save name</button></div>
      </form>
      <div className="safari-pet-journal"><p className="af-eyebrow">WHILE YOU WERE AWAY</p>{pet?.journal.map(entry => <p key={entry.id}>{entry.message}</p>)}</div>
      {message && <p className="safari-pet-feedback" role="status">{message}</p>}
      <p className="safari-pet-disclaimer">A small local-first companion prototype. Your save stays in this browser on this device; cloud sync is not enabled.</p>
    </div>
  </section>;
}
