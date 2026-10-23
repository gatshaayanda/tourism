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
  const [reaction, setReaction] = useState("idle");
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [recentActions, setRecentActions] = useState(0);
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
  useEffect(() => {
    const timer = window.setInterval(() => setCooldownLeft(Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))), 500);
    return () => window.clearInterval(timer);
  }, [cooldownUntil]);
  useEffect(() => {
    if (cooldownUntil > 0 && cooldownLeft === 0) setReaction("idle");
  }, [cooldownLeft, cooldownUntil]);
  function commit(next: CompanionState, feedback: string, pose = "happy") {
    setReaction(pose);
    const saved = { ...next, lastSeenAt: Date.now(), journal: [{ id: Date.now(), message: feedback }, ...next.journal].slice(0, 5) };
    setPet(saved);
    setMessage(feedback);
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(saved)); } catch { setMessage("Your browser could not save this visit. Keep this tab open while you play."); }
  }
  function act(action: "feed" | "water" | "play" | "rest" | "explore") {
    if (!pet) return;
    const now = Date.now();
    if (now < cooldownUntil) {
      setReaction("sleepy");
      setMessage(`Pula has had enough excitement for a moment. Let your buddy have ${Math.ceil((cooldownUntil - now) / 1000)} seconds of quiet.`);
      return;
    }
    if (action === "feed" && pet.hunger <= 8) {
      setReaction("full");
      setMessage(["Pula is already full and gently turns away from the treats.", "Tiny burp! No more snacks for now.", "Pula sniffs the treats, then gives a satisfied little bleat."][Math.floor(Math.random() * 3)]);
      return;
    }
    if (action === "water" && pet.thirst <= 8) {
      setReaction("content");
      setMessage(["Pula has had plenty of water and noses the bowl aside.", "All hydrated! Pula gives the water bowl a curious sniff.", "Pula takes one polite lick, then wanders off."][Math.floor(Math.random() * 3)]);
      return;
    }
    if ((action === "play" || action === "explore") && pet.energy < 18) {
      setReaction("sleepy");
      setMessage(["Pula's eyelids droop. A nap sounds much better than playing.", "Your buddy gives a tiny bleat, then flops down in the shade.", "Pula takes two sleepy steps and decides that's enough adventure."][Math.floor(Math.random() * 3)]);
      return;
    }
    if (action === "rest" && pet.energy >= 94) {
      setReaction("content");
      setMessage("Pula is already well-rested and would rather watch the birds for a while.");
      return;
    }
    const replies: Record<typeof action, string[]> = {
      feed: ["Pula munches happily, then licks a crumb from their nose.", "A favourite little snack! Pula's ears perk right up.", "Crunch, crunch. Pula gives you a pleased nuzzle.", "Pula takes the treat gently and does a tiny happy hop."],
      water: ["Pula drinks deeply, then flicks an ear at a nearby bird.", "A cool drink in the bush heat. Pula looks refreshed.", "Pula laps at the water and gives a contented little bleat.", "A few splashes later, Pula shakes their head dry."],
      play: ["Pula bounces sideways, then invites you to try again.", "A playful head tilt turns into a tiny happy hop.", "Pula chases a drifting leaf and trots proudly back.", "You play hide-and-seek behind the acacia. Pula found you!"],
      rest: ["Pula curls up in the shade and lets out a slow sigh.", "A peaceful pause. Pula's ears twitch at sounds in the grass.", "Pula settles into the warm sand and slowly recharges.", "A little doze later, Pula stretches all four legs."],
      explore: ["You follow tiny hoofprints to a new patch of wildflowers.", "Pula spots a bird at the waterhole and freezes in wonder.", "A fresh trail leads to an acacia grove. New sighting logged!", "You discover tracks near camp; Pula sniffs around excitedly."]
    };
    let feedback = replies[action][Math.floor(Math.random() * replies[action].length)];
    const nextCount = recentActions + 1;
    const gettingTired = nextCount >= 4;
    if (gettingTired) {
      const pause = 9000 + Math.floor(Math.random() * 9000);
      setCooldownUntil(now + pause);
      setCooldownLeft(Math.ceil(pause / 1000));
      setRecentActions(0);
      feedback += " Pula's had a busy little visit and is settling down for a quiet break.";
    } else {
      setRecentActions(nextCount);
    }
    if (action === "feed") commit({ ...pet, hunger: clamp(pet.hunger - (24 + Math.random() * 15)), trust: clamp(pet.trust + 2 + Math.random() * 3), visits: pet.visits + 1 }, feedback, gettingTired ? "sleepy" : ["happy", "eat", "bounce"][Math.floor(Math.random() * 3)]);
    if (action === "water") commit({ ...pet, thirst: clamp(pet.thirst - (29 + Math.random() * 16)), trust: clamp(pet.trust + 1 + Math.random() * 3), visits: pet.visits + 1 }, feedback, gettingTired ? "sleepy" : ["drink", "happy", "shake"][Math.floor(Math.random() * 3)]);
    if (action === "play") commit({ ...pet, energy: clamp(pet.energy - (12 + Math.random() * 12)), trust: clamp(pet.trust + 6 + Math.random() * 7), hunger: clamp(pet.hunger + 3 + Math.random() * 4), visits: pet.visits + 1 }, feedback, gettingTired ? "sleepy" : ["bounce", "play", "happy"][Math.floor(Math.random() * 3)]);
    if (action === "rest") commit({ ...pet, energy: clamp(pet.energy + (22 + Math.random() * 18)), thirst: clamp(pet.thirst + 2), visits: pet.visits + 1 }, feedback, gettingTired ? "sleepy" : ["sleepy", "stretch", "idle"][Math.floor(Math.random() * 3)]);
    if (action === "explore") commit({ ...pet, energy: clamp(pet.energy - (10 + Math.random() * 12)), hunger: clamp(pet.hunger + 3 + Math.random() * 4), sightings: pet.sightings + 1, worldDay: pet.worldDay + 1, visits: pet.visits + 1 }, feedback, gettingTired ? "sleepy" : ["curious", "bounce", "play"][Math.floor(Math.random() * 3)]);
  }
  const mood = !pet ? "Waking up" : pet.hunger > 75 || pet.thirst > 75 ? "Looking for a little care" : pet.energy < 30 ? "Ready for a nap" : pet.trust > 70 ? "Your bush buddy" : "Curious and watching";
  return <section className="safari-pet-section" aria-labelledby="safari-pet-title">
    <div className="safari-pet-intro">
      <p className="af-eyebrow">A LITTLE WORLD THAT KEEPS GOING</p>
      <h2 id="safari-pet-title">Meet your safari <em>buddy.</em></h2>
      <p>Pop in for a moment or come back tomorrow. Pula&apos;s little camp keeps changing while you&apos;re away, and you can help shape what happens next.</p>
      <div className="safari-pet-facts"><span>WORLD DAY <b>{pet?.worldDay ?? "—"}</b></span><span>WILDLIFE SIGHTINGS <b>{pet?.sightings ?? "—"}</b></span><span>VISITS <b>{pet?.visits ?? "—"}</b></span></div>
      <p className="safari-pet-note">Saved on this device · time advances between visits · no account required.</p>
    </div>
    <div className="safari-pet-card">
      <div className="safari-pet-landscape" aria-label="Pula's bush camp">
        <span className="pet-sun" /><span className="pet-hill pet-hill-back" /><span className="pet-hill pet-hill-front" />
        <span className="pet-acacia pet-acacia-one">♣</span><span className="pet-acacia pet-acacia-two">♣</span>
        <div className={`pet-animal pet-reaction-${reaction}`} role="img" aria-label={pet ? `${pet.name}, your safari companion` : "Safari companion"}><svg viewBox="0 0 120 150" aria-hidden="true"><ellipse cx="60" cy="137" rx="33" ry="7" fill="#163f30" opacity=".25"/><path d="M40 95 Q20 111 30 130 Q41 141 47 124 L51 108" fill="#b9844f" stroke="#6e472d" strokeWidth="3"/><ellipse cx="60" cy="102" rx="26" ry="35" fill="#d6ad77" stroke="#6e472d" strokeWidth="3"/><ellipse cx="60" cy="111" rx="13" ry="21" fill="#f1d7a9"/><circle cx="60" cy="53" r="29" fill="#d6ad77" stroke="#6e472d" strokeWidth="3"/><circle cx="38" cy="34" r="10" fill="#d6ad77" stroke="#6e472d" strokeWidth="3"/><circle cx="82" cy="34" r="10" fill="#d6ad77" stroke="#6e472d" strokeWidth="3"/><circle cx="49" cy="52" r="3.5" fill="#2c241b"/><circle cx="71" cy="52" r="3.5" fill="#2c241b"/><ellipse cx="60" cy="65" rx="8" ry="6" fill="#6e472d"/><path d="M53 71 Q60 77 67 71" fill="none" stroke="#6e472d" strokeWidth="2" strokeLinecap="round"/><path d="M39 86 Q60 77 81 86" fill="none" stroke="#f1d7a9" strokeWidth="4" strokeLinecap="round"/><path d="M44 130 L41 140 M76 130 L79 140" stroke="#6e472d" strokeWidth="5" strokeLinecap="round"/><circle cx="91" cy="90" r="5" fill="#e6c66c"/><path d="M86 90 L96 90 M91 85 L91 95" stroke="#6e472d" strokeWidth="1.5"/></svg></div>
        <span className="pet-camp-sign">BUSH CAMP · BW</span>
      </div>
      <div className="safari-pet-profile">
        <div><p className="af-eyebrow">YOUR COMPANION</p><h3>{pet?.name ?? "Pula"}</h3><p>{cooldownLeft > 0 ? "Taking a little quiet time…" : mood}</p></div>
        <span className="safari-pet-heart" aria-hidden="true">♥</span>
      </div>
      {pet ? <div className="safari-pet-meters"><Meter label="Fullness" value={pet.hunger} inverse/><Meter label="Hydration" value={pet.thirst} inverse/><Meter label="Energy" value={pet.energy}/><Meter label="Trust" value={pet.trust}/></div> : <p className="safari-pet-loading">Preparing your companion&apos;s world…</p>}
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
      {message && <p className="safari-pet-feedback" role="status">{message}</p>}{cooldownLeft > 0 && <p className="safari-pet-cooldown" role="status">Pula is resting. Back in {cooldownLeft}s.</p>}
      <p className="safari-pet-disclaimer">A small local-first companion prototype. Your save stays in this browser on this device; cloud sync is not enabled.</p>
    </div>
  </section>;
}
