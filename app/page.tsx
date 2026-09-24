'use client';

import { useMemo, useState } from "react";

type Intent = "dating" | "friends" | "creative" | "music";
type Artifact = { symbol: string; name: string };
type Choice = { text: string; artifact: Artifact; keys?: number };
type Scene = { place: string; title: string; copy: string; object: string; choices: Choice[] };

const intents: Record<Intent, { label: string; world: string; mark: string; intro: string; match: string; trace: string }> = {
  dating: {
    label: "Someone to date",
    world: "The After-Hours City",
    mark: "♥",
    intro: "Chemistry, intimacy, boundaries, and the peculiar logistics of letting another person matter.",
    match: "Mara",
    trace: "Left a handwritten confession in the arcade, then pretended it was no big deal.",
  },
  friends: {
    label: "A real friend",
    world: "The Impossible Road Trip",
    mark: "✦",
    intro: "Loyalty, humor, depth, and who you want beside you when the plans become useless.",
    match: "Casey",
    trace: "Turned the wrong exit into the best part of the trip.",
  },
  creative: {
    label: "A creative collaborator",
    world: "The Museum of Unfinished Things",
    mark: "✎",
    intro: "Taste, ambition, criticism, experimentation, and the statistically unusual event of finishing something.",
    match: "Rowan",
    trace: "Rebuilt an exhibit everyone else had already declared finished.",
  },
  music: {
    label: "A musician",
    world: "The Studio After Midnight",
    mark: "♫",
    intro: "Instinct, collaboration, reliability, ego, and who remembered the cables.",
    match: "Nico",
    trace: "Kept the wrong chord and wrote the bridge around it.",
  },
};

const scenes: Scene[] = [
  {
    place: "THE CROSSROADS",
    title: "Four doors. One of them is humming.",
    copy: "There is no map. A brass plaque says: TAKE ONLY WHAT YOU NOTICE.",
    object: "◉",
    choices: [
      { text: "Open the humming door.", artifact: { symbol: "◉", name: "Brass Token" }, keys: 1 },
      { text: "Knock on every door first.", artifact: { symbol: "🔔", name: "Tiny Bell" } },
      { text: "Look behind the plaque.", artifact: { symbol: "⌁", name: "Folded Map" }, keys: 1 },
      { text: "Sit down and wait for something strange to happen.", artifact: { symbol: "〰", name: "Red Thread" } },
    ],
  },
  {
    place: "THE ROOM WITH NO CLOCKS",
    title: "A telephone rings once.",
    copy: "It is an old rotary phone. Beside it is a note: SOMEONE ANSWERED THIS BEFORE YOU.",
    object: "☎",
    choices: [
      { text: "Pick it up immediately.", artifact: { symbol: "☎", name: "Receiver" } },
      { text: "Read the note again for clues.", artifact: { symbol: "✎", name: "Marginalia" }, keys: 1 },
      { text: "Let it ring.", artifact: { symbol: "●", name: "Quiet Coin" } },
      { text: "Answer using a completely invented identity.", artifact: { symbol: "◐", name: "False Name" } },
    ],
  },
  {
    place: "THE ARCADE",
    title: "One machine still works.",
    copy: "INSERT ONE TRUE THING ABOUT YOURSELF, the screen says. Apparently the machine has been to therapy.",
    object: "▣",
    choices: [
      { text: "Give it something vulnerable.", artifact: { symbol: "♡", name: "Glass Heart" }, keys: 1 },
      { text: "Give it something funny but true.", artifact: { symbol: "◇", name: "Laughing Ticket" } },
      { text: "Tell it something nobody expects.", artifact: { symbol: "★", name: "Black Star" }, keys: 1 },
      { text: "Refuse and inspect the machine instead.", artifact: { symbol: "⌾", name: "Loose Screw" } },
    ],
  },
  {
    place: "THE HIDDEN LANDING",
    title: "A locked drawer is built into the wall.",
    copy: "It has no keyhole. The inscription asks what you would rather know about another person.",
    object: "▤",
    choices: [
      { text: "What they are afraid of.", artifact: { symbol: "♧", name: "Moth" }, keys: 1 },
      { text: "What makes them lose track of time.", artifact: { symbol: "⌛", name: "Hourglass" } },
      { text: "How they behave when angry.", artifact: { symbol: "✦", name: "Match" }, keys: 1 },
      { text: "What they secretly want their life to become.", artifact: { symbol: "✧", name: "Compass" }, keys: 1 },
    ],
  },
  {
    place: "THE ROOFTOP",
    title: "Someone has left a chair beside yours.",
    copy: "On the empty chair is an envelope addressed: TO WHOEVER GETS HERE NEXT.",
    object: "✉",
    choices: [
      { text: "Open it.", artifact: { symbol: "✉", name: "Open Letter" } },
      { text: "Leave your own letter beside it.", artifact: { symbol: "▱", name: "Second Letter" }, keys: 1 },
      { text: "Do both. Fair trade.", artifact: { symbol: "⇄", name: "Exchange" }, keys: 1 },
      { text: "Leave it untouched.", artifact: { symbol: "◆", name: "Wax Seal" } },
    ],
  },
];

export default function Home() {
  const [name, setName] = useState("");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [step, setStep] = useState(0);
  const [keys, setKeys] = useState(0);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [hiddenFound, setHiddenFound] = useState<number[]>([]);
  const [phase, setPhase] = useState<"home" | "world" | "cabinet" | "door" | "person" | "quest">("home");
  const [sealed, setSealed] = useState(false);

  const config = intent ? intents[intent] : null;
  const scene = scenes[step];

  const pathTitle = useMemo(() => {
    if (!config) return "";
    return config.world;
  }, [config]);

  function start(kind: Intent) {
    setIntent(kind);
    setStep(0);
    setKeys(0);
    setArtifacts([]);
    setHiddenFound([]);
    setSealed(false);
    setPhase("world");
  }

  function choose(choice: Choice) {
    setArtifacts((old) => [...old, choice.artifact]);
    setKeys((old) => old + (choice.keys || 0));
    if (step === scenes.length - 1) setPhase("door");
    else setStep((old) => old + 1);
  }

  function inspect() {
    if (hiddenFound.includes(step)) return;
    setHiddenFound((old) => [...old, step]);
    setKeys((old) => old + 1);
  }

  function reset() {
    setIntent(null);
    setPhase("home");
    setStep(0);
    setKeys(0);
    setArtifacts([]);
    setHiddenFound([]);
    setSealed(false);
  }

  return (
    <main className="shell">
      <div className="noise" aria-hidden="true" />
      <header className="brandbar">
        <button className="brand" onClick={reset} aria-label="Return to Elsewhere home">
          <span className="brand-mark">◇</span>
          <span>ELSEWHERE</span>
        </button>
        {phase !== "home" && (
          <div className="hud">
            <button className="hud-button" onClick={() => setPhase("cabinet")}>Cabinet <b>{artifacts.length}</b></button>
            <span className="keycount">🗝 {keys}</span>
          </div>
        )}
      </header>

      {phase === "home" && (
        <section className="home">
          <div className="eyebrow">A SOCIAL ADVENTURE</div>
          <h1>There are people here you haven&apos;t met yet.</h1>
          <p className="lead">
            You won&apos;t find them by swiping. Explore rooms. Make choices. Collect strange things.
            Leave traces of yourself behind. The paths you take determine whose paths cross yours.
          </p>
          <label className="namebox">
            <span>WHAT SHOULD WE CALL YOU?</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" maxLength={30} />
          </label>
          <div className="choose-label">I CAME HERE HOPING TO FIND…</div>
          <div className="intent-grid">
            {(Object.keys(intents) as Intent[]).map((kind) => {
              const item = intents[kind];
              return (
                <button className="intent-card" key={kind} onClick={() => start(kind)}>
                  <span className="intent-mark">{item.mark}</span>
                  <span className="intent-copy"><b>{item.label}</b><small>{item.intro}</small></span>
                  <span className="arrow">↗</span>
                </button>
              );
            })}
          </div>
          <div className="footer-note">No swiping. No public score. No “hot singles in your area” catastrophe.</div>
        </section>
      )}

      {phase === "world" && config && (
        <section className="world">
          <div className="world-meta">
            <div><span>{name.trim() || "Traveler"}</span><small>{pathTitle}</small></div>
            <div className="stepper">{String(step + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}</div>
          </div>
          <div className="progress"><span style={{ width: `${((step + 1) / scenes.length) * 100}%` }} /></div>
          <article className="scene-card">
            <div className="ring ring-one" />
            <div className="ring ring-two" />
            <div className="scene-place">{scene.place}</div>
            <h2>{scene.title}</h2>
            <p>{scene.copy}</p>
            <button className={"object " + (hiddenFound.includes(step) ? "found" : "")} onClick={inspect} aria-label="Inspect the object">
              {hiddenFound.includes(step) ? "🗝" : scene.object}
            </button>
            <div className="inspect-note">{hiddenFound.includes(step) ? "You found something hidden." : "Some things respond when you touch them."}</div>
          </article>
          <div className="choices">
            {scene.choices.map((choice) => (
              <button key={choice.text} onClick={() => choose(choice)}>{choice.text}<span>→</span></button>
            ))}
          </div>
        </section>
      )}

      {phase === "cabinet" && (
        <section className="cabinet">
          <button className="back" onClick={() => setPhase(intent && step >= scenes.length - 1 ? "door" : "world")}>← RETURN TO THE PATH</button>
          <div className="eyebrow">CABINET OF CURIOSITIES</div>
          <h2>Things you found instead of points.</h2>
          <p className="lead small">Artifacts remember how you moved through the world. Some future rooms will require particular combinations.</p>
          <div className="artifact-grid">
            {Array.from({ length: 12 }).map((_, index) => {
              const item = artifacts[index];
              return item ? (
                <div className="artifact" key={index}><span>{item.symbol}</span><small>{item.name}</small></div>
              ) : (
                <div className="artifact locked" key={index}><span>?</span><small>UNDISCOVERED</small></div>
              );
            })}
          </div>
        </section>
      )}

      {phase === "door" && config && (
        <section className="door-section">
          <div className="door-card">
            <div className="door-glyph">▥</div>
            <div className="eyebrow">A DOOR APPEARS</div>
            <h2>Someone else has been walking nearby.</h2>
            <p>
              Your trail intersects with another person&apos;s. The door does not care whether you have the same favorite movie.
              It cares how you moved through the world.
            </p>
            <div className="tally"><span>{artifacts.length} artifacts</span><span>{keys} keys</span></div>
            <button className="primary" disabled={keys < 1} onClick={() => { setKeys((k) => k - 1); setPhase("person"); }}>
              {keys > 0 ? "USE A KEY ON THE DOOR" : "YOU NEED A KEY"}
            </button>
          </div>
        </section>
      )}

      {phase === "person" && config && (
        <section className="person-section">
          <div className="eyebrow">BEHIND THE DOOR</div>
          <h2>Someone else has been here.</h2>
          <p className="lead small">You get evidence of a person before you get a résumé disguised as a dating profile.</p>
          <article className="person-card">
            <div className="person-top">
              <div><small>PARTIALLY REVEALED</small><h3>{config.match}</h3></div>
              <span>{config.mark}</span>
            </div>
            <blockquote>“{config.trace}”</blockquote>
            <div className="intersections">
              <div><b>WHERE YOU INTERSECT</b><p>You both chose curiosity over certainty when the story became uncomfortable.</p></div>
              <div><b>WHERE YOU DIVERGE</b><p>They moved faster. You stopped to inspect what everyone else walked past.</p></div>
            </div>
            <div className="profile-lock">Their photo and full profile stay hidden until you both choose to connect.</div>
          </article>
          <div className="action-row">
            <button className="primary" onClick={() => setPhase("quest")}>BEGIN A SHARED QUEST</button>
            <button className="secondary" onClick={reset}>RETURN TO THE CROSSROADS</button>
          </div>
        </section>
      )}

      {phase === "quest" && config && (
        <section className="quest">
          <div className="eyebrow">SHARED QUEST UNLOCKED</div>
          <h2>The Two-Key Room</h2>
          <div className="quest-card">
            <div className="quest-symbol">🗝 ◇ 🗝</div>
            <p>A room that opens only after both people answer independently. Your answer stays hidden until {config.match} chooses too.</p>
            <h3>You find one envelope. What do you put inside?</h3>
            <div className="quest-options">
              {["A question I genuinely want answered", "A tiny piece of advice", "A ridiculous hypothetical", "One true thing about me"].map((option) => (
                <button disabled={sealed} key={option} onClick={() => setSealed(true)}>{option}</button>
              ))}
            </div>
            {sealed && <div className="sealed">SEALED. The room opens when the other person answers. No desperate refreshing required.</div>}
          </div>
        </section>
      )}
    </main>
  );
}
