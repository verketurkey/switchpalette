'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type Room = { id:string; floor:string; title:string; kicker:string; description:string; ideas:string[]; tone:string; active?:boolean };

const rooms: Room[] = [
 {id:'curiosity',floor:'Attic',title:'The Curiosity Attic',kicker:'Odd ideas live longer up here.',description:'A tucked-away place for prompts, experiments, strange materials, unfinished thoughts, and whatever does not fit neatly downstairs.',ideas:['Art prompts','Tiny experiments','Material swaps'],tone:'mustard'},
 {id:'gallery',floor:'Second Floor',title:'The Gallery Bedroom',kicker:'Walls are meant to have opinions.',description:'A possible rotating space for local artists, works in progress, small exhibitions, and conversations about making things.',ideas:['Local artist walls','Works in progress','Artist talks'],tone:'rose'},
 {id:'drawing',floor:'Second Floor',title:'The Drawing Room',kicker:'Yes, we took the name literally.',description:'A future room for figure drawing, sketch nights, collage, printmaking, and low-pressure ways to get marks onto paper.',ideas:['Figure drawing','Collage','Sketch nights'],tone:'olive'},
 {id:'kids',floor:'Second Floor',title:'The Little Studio',kicker:'Small people. Serious glue-stick policy.',description:'A possible kids art room built around curiosity, color, mess, and projects that do not require making a perfect refrigerator masterpiece.',ideas:['Kids art','Family workshops','Open making'],tone:'blue'},
 {id:'living',floor:'Main Floor',title:'The Living Room',kicker:'The house heart.',description:'A gathering room for meeting people, seeing what is happening, talking about ideas, and occasionally doing absolutely nothing productive together.',ideas:['Creative gatherings','Community nights','Idea swaps'],tone:'orange',active:true},
 {id:'paint',floor:'Main Floor',title:'The Paint Room',kicker:'Subtlety may wait outside.',description:'A possible home for pour painting, color experiments, mixed media, tie-dye, and other projects where the table deserves a drop cloth.',ideas:['Pour painting','Tie-dye','Mixed media'],tone:'tomato',active:true},
 {id:'music',floor:'Main Floor',title:'The Listening Den',kicker:'Occasional noise encouraged.',description:'A cozy corner for occasional music, listening sessions, tiny performances, and creative evenings that wander beyond visual art.',ideas:['Small performances','Listening nights','Song swaps'],tone:'teal'},
 {id:'kitchen',floor:'Main Floor',title:'The Kitchen Table',kicker:'Where every good idea eventually ends up.',description:'A communal table for jewelry, small crafts, planning, talking, and possible BYOB evenings for grown-ups.',ideas:['Jewelry','BYOB evenings','Craft circles'],tone:'gold'},
 {id:'ceramics',floor:'Basement',title:'The Clay Cellar',kicker:'Dirt, but with ambition.',description:'A future ceramics and hand-building zone with room for imperfect pots, strange little sculptures, and learning from one another.',ideas:['Ceramics','Hand-building','Sculpture'],tone:'clay'},
 {id:'workshop',floor:'Basement',title:'The Workshop',kicker:'For things requiring tools and unreasonable confidence.',description:'A possible making room for wood, epoxy, repairs, upcycling, and projects that begin with “I think I can make that.”',ideas:['Wood + epoxy','Upcycling','Build nights'],tone:'green',active:true},
 {id:'shop',floor:'Basement',title:'The Odd Shop',kicker:'Future shelves. Excellent hypothetical objects.',description:'A future shop for unusual handmade work, artist consignment, studio-made pieces, and objects worth stopping to stare at.',ideas:['Handmade goods','Artist consignment','Studio pieces'],tone:'plum'},
 {id:'wildcard',floor:'Basement',title:'The Room We Haven’t Thought Of Yet',kicker:'Please interfere with the plan.',description:'Switch Palette should have room to change. This one belongs to ideas visitors bring that are better than the original list.',ideas:['Your suggestion','Unexpected classes','New collaborations'],tone:'cream'}
];

const floors=['Attic','Second Floor','Main Floor','Basement'];
const mockAvatars=['✿','☻','★','◉'];

export default function Home(){
 const [open,setOpen]=useState<Room|null>(null);
 const [votes,setVotes]=useState<Record<string,boolean>>({});
 const [suggestion,setSuggestion]=useState('');
 const [saved,setSaved]=useState(false);
 const [menu,setMenu]=useState(false);
 useEffect(()=>{try{setVotes(JSON.parse(localStorage.getItem('switch-palette-votes')||'{}'));setSuggestion(localStorage.getItem('switch-palette-suggestion')||'')}catch{}},[]);
 const voteCount=useMemo(()=>Object.values(votes).filter(Boolean).length,[votes]);
 function toggleVote(id:string){const next={...votes,[id]:!votes[id]};setVotes(next);localStorage.setItem('switch-palette-votes',JSON.stringify(next));}
 function saveFeedback(){localStorage.setItem('switch-palette-suggestion',suggestion);setSaved(true);setTimeout(()=>setSaved(false),1800);}
 function scrollTo(id:string){document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)}
 return <main>
  <header className="topbar">
   <button className="brand" onClick={()=>scrollTo('top')}>SWITCH <i>Palette</i></button>
   <nav className={menu?'open':''}>
    <button onClick={()=>scrollTo('house')}>Explore the house</button><button onClick={()=>scrollTo('possibilities')}>Possibilities</button><button onClick={()=>scrollTo('feedback')}>Have a say</button>
   </nav>
   <button className="menu" onClick={()=>setMenu(!menu)} aria-label="Menu">☰</button>
  </header>

  <section className="hero" id="top">
   <div className="hero-copy"><span className="stamp">PROSPECTIVE CREATIVE STUDIO · JONESTOWN, PA</span><h1>A house full of<br/><em>possible things.</em></h1><p>Switch Palette is an <strong>idea in progress</strong>, not an open business. We’re imagining an old house where people make art, learn from one another, show local work, find unusual handmade things, and gather for creative events.</p><div className="hero-actions"><button className="primary" onClick={()=>scrollTo('house')}>WANDER INSIDE ↓</button><button className="paper" onClick={()=>scrollTo('feedback')}>HELP SHAPE IT</button></div></div>
   <div className="hero-art"><div className="sun"/><div className="mini-house"><div className="roof"/><div className="window w1"/><div className="window w2"/><div className="door"/></div><span>NOT OPEN YET.<br/>VERY MUCH THINKING ABOUT IT.</span></div>
  </section>

  <section className="house-intro" id="house"><small>THE UNOFFICIAL FLOOR PLAN</small><h2>Scroll through the house.</h2><p>Hover over a room to see who else might be poking around. Tap or click to enter. None of these rooms are promises yet. They’re possibilities with wallpaper.</p></section>

  <div className="house">
   {floors.map((floor,fi)=><section className={'floor floor-'+fi} id={'floor-'+fi} key={floor}>
    <div className="floor-label"><b>{floor}</b><span>0{fi+1}</span></div>
    <div className="hall">
     {rooms.filter(r=>r.floor===floor).map((r,ri)=><button key={r.id} className={'room '+r.tone} onClick={()=>setOpen(r)}>
       <div className="wall-pattern"/><div className="lamp"/><div className="rug"/><div className="frame">{r.id==='living'?<Image src="/de35fb2f-605e-4993-89b2-8e4a72a97174%20(1).png" alt="Switch Palette supplied room inspiration" fill sizes="240px"/>:<span>{['✦','❋','◌','✎','♫','✿'][ri%6]}</span>}</div>
       <div className="room-copy"><small>{r.kicker}</small><h3>{r.title}</h3><span>ENTER ROOM →</span></div>
       <div className="visitors" aria-label="Prototype visitor profiles">{mockAvatars.slice(0,3+(ri%2)).map((a,i)=><i key={i}>{a}</i>)}</div>
      </button>)}
    </div>
    {fi<floors.length-1&&<button className="stairs" onClick={()=>scrollTo('floor-'+(fi+1))}>take the stairs ↓</button>}
   </section>)}
  </div>

  <section className="possibilities" id="possibilities"><div><small>ROOM TO CHANGE OUR MINDS</small><h2>Things that <em>might</em> live here.</h2><p>No schedules, invented instructors, suspiciously specific grand openings, or other internet theater. These are simply directions Switch Palette could grow.</p></div><div className="future-grid">{['Classes','Teachers','Exhibitions','Events','Shop','Community'].map((x,i)=><article key={x}><span>0{i+1}</span><h3>{x}</h3><p>{['Possible workshops and messy experiments.','Future local makers sharing what they know.','Possible walls for local work and small shows.','Creative gatherings, occasional music and BYOB nights.','Future handmade work and artist consignment.','Ideas, collaborations and reasons to leave the house.'][i]}</p><b>BEING DEVELOPED</b></article>)}</div></section>

  <section className="feedback" id="feedback"><div className="feedback-head"><small>THIS PART ACTUALLY DOES SOMETHING</small><h2>What would get you through the door?</h2><p>Pick anything you’d genuinely be interested in. Your choices stay in this browser prototype. They are <strong>not sent anywhere</strong>.</p></div>
   <div className="ballot">{rooms.filter(r=>r.id!=='wildcard').map(r=><button className={votes[r.id]?'selected':''} onClick={()=>toggleVote(r.id)} key={r.id}><span>{votes[r.id]?'✓':'+'}</span>{r.title}</button>)}</div>
   <div className="suggest"><label htmlFor="idea">Something missing?</label><textarea id="idea" value={suggestion} onChange={e=>setSuggestion(e.target.value)} placeholder="A class, event, weird room, useful thing, unreasonable idea…"/><button className="primary" onClick={saveFeedback}>{saved?'SAVED IN THIS BROWSER ✓':'SAVE MY NOTE PRIVATELY'}</button><small>{voteCount} interest {voteCount===1?'pick':'picks'} saved locally.</small></div>
  </section>

  <footer><div className="footer-logo">SWITCH <i>Palette</i></div><p>Prospective creative studio · Jonestown, Pennsylvania<br/>An idea in progress. No opening hours because, inconveniently, we are not open.</p><button onClick={()=>scrollTo('top')}>BACK TO THE ATTIC ↑</button></footer>

  {open&&<div className="modal-backdrop" onClick={()=>setOpen(null)}><article className={'modal '+open.tone} onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setOpen(null)}>×</button><small>{open.floor} · A POSSIBLE ROOM</small><h2>{open.title}</h2><h4>{open.kicker}</h4><p>{open.description}</p><div className="idea-chips">{open.ideas.map(x=><span key={x}>{x}</span>)}</div><div className="modal-vote"><button onClick={()=>toggleVote(open.id)} className={votes[open.id]?'voted':''}>{votes[open.id]?'✓ I’D SHOW UP FOR THIS':'＋ I’M INTERESTED'}</button><small>Saved only in this browser.</small></div></article></div>}
 </main>
}