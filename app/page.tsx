'use client';

import { useMemo, useState } from "react";

type Intent = "dating" | "friends" | "creative" | "music";
type Artifact = { symbol: string; name: string };
type Choice = { text: string; artifact: Artifact; keys?: number };
type Scene = { place: string; title: string; copy: string; object: string; choices: Choice[] };
type World = { station: string; scenes: Scene[] };

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

const worlds: Record<Intent, World> = {
  dating: {
    station: "Platform 13 · Last train unknown",
    scenes: [
      { place: "THE LAST PLATFORM", title: "The final train is waiting with its doors open.", copy: "The board lists no destination. Someone under the clock is deciding whether to board too.", object: "◷", choices: [
        { text: "Get on before you can overthink it.", artifact: { symbol: "▥", name: "Unmarked Ticket" }, keys: 1 },
        { text: "Ask the stranger where they think it goes.", artifact: { symbol: "☂", name: "Borrowed Umbrella" } },
        { text: "Study the departure board for a pattern.", artifact: { symbol: "⌁", name: "Night Map" }, keys: 1 },
        { text: "Miss the train on purpose.", artifact: { symbol: "◐", name: "Last Train Token" } },
      ]},
      { place: "THE DINER · 1:38 AM", title: "There is one open booth and two menus.", copy: "The waitress pours water for two without asking. The jukebox is playing something almost familiar.", object: "♬", choices: [
        { text: "Sit down and see who arrives.", artifact: { symbol: "☾", name: "Diner Moon" } },
        { text: "Put your favorite terrible song on the jukebox.", artifact: { symbol: "♫", name: "Jukebox Coin" }, keys: 1 },
        { text: "Write a question on the paper placemat.", artifact: { symbol: "✎", name: "Placemat Note" } },
        { text: "Order dessert first.", artifact: { symbol: "◇", name: "Cherry Stem" }, keys: 1 },
      ]},
      { place: "THE CLOSED CINEMA", title: "Someone left the side door unlocked.", copy: "Inside, one projector is still running. The film shows two people having an argument with no sound.", object: "▣", choices: [
        { text: "Invent the dialogue.", artifact: { symbol: "❝", name: "Missing Dialogue" } },
        { text: "Watch how they repair it afterward.", artifact: { symbol: "∞", name: "Spliced Film" }, keys: 1 },
        { text: "Leave before the ending.", artifact: { symbol: "◒", name: "Half Reel" } },
        { text: "Stay through the credits.", artifact: { symbol: "★", name: "Closing Credit" }, keys: 1 },
      ]},
      { place: "THE APARTMENT STAIRWELL", title: "A voice above you says, “Tell me something difficult.”", copy: "You cannot see who is speaking. The light between floors flickers like it has opinions.", object: "⌂", choices: [
        { text: "Answer plainly.", artifact: { symbol: "♡", name: "Glass Heart" }, keys: 1 },
        { text: "Ask them to go first.", artifact: { symbol: "⇄", name: "Fair Exchange" } },
        { text: "Make a joke, then answer for real.", artifact: { symbol: "✦", name: "Bent Match" } },
        { text: "Say you need time before answering.", artifact: { symbol: "⌛", name: "Small Boundary" }, keys: 1 },
      ]},
      { place: "THE ROOFTOP", title: "There are two chairs and one envelope.", copy: "The envelope says: FOR SOMEONE I HAVE NOT MET YET.", object: "✉", choices: [
        { text: "Open it.", artifact: { symbol: "✉", name: "Open Letter" } },
        { text: "Leave your own beside it.", artifact: { symbol: "▱", name: "Second Letter" }, keys: 1 },
        { text: "Trade one honest sentence for another.", artifact: { symbol: "⇄", name: "Exchange" }, keys: 1 },
        { text: "Leave it sealed.", artifact: { symbol: "◆", name: "Wax Seal" } },
      ]},
    ],
  },
  friends: {
    station: "Gate B · The road that is not on the map",
    scenes: [
      { place: "THE WRONG EXIT", title: "The sign definitely did not say this five minutes ago.", copy: "Your route has vanished. Ahead: a roadside attraction shaped like an enormous peach.", object: "↝", choices: [
        { text: "Follow the ridiculous sign.", artifact: { symbol: "◎", name: "Peach Sticker" }, keys: 1 },
        { text: "Stop and actually ask someone.", artifact: { symbol: "☏", name: "Local Number" } },
        { text: "Keep driving. Wrong can be interesting.", artifact: { symbol: "⌁", name: "Bad Map" }, keys: 1 },
        { text: "Pull over and regroup.", artifact: { symbol: "□", name: "Rest Stop Receipt" } },
      ]},
      { place: "THE GAS STATION", title: "You have twelve dollars and an unreasonable snack aisle.", copy: "A handwritten sign offers FREE ADVICE with every purchase. This feels legally questionable.", object: "¤", choices: [
        { text: "Buy snacks for everybody.", artifact: { symbol: "✺", name: "Snack Crown" } },
        { text: "Ask for the free advice.", artifact: { symbol: "?", name: "Receipt Prophecy" }, keys: 1 },
        { text: "Choose the weirdest regional food.", artifact: { symbol: "◇", name: "Mystery Snack" } },
        { text: "Make a playlist instead.", artifact: { symbol: "♫", name: "Road Tape" }, keys: 1 },
      ]},
      { place: "THE MOTEL", title: "The vending machine ate your last dollar.", copy: "Room 8 is laughing. Room 11 is arguing about a board game. The ice machine sounds haunted.", object: "▦", choices: [
        { text: "Knock on Room 8.", artifact: { symbol: "☺", name: "Inside Joke" }, keys: 1 },
        { text: "Help settle the board-game dispute.", artifact: { symbol: "⚄", name: "Loaded Die" } },
        { text: "Investigate the haunted ice machine.", artifact: { symbol: "❄", name: "Ghost Ice" } },
        { text: "Sit outside and talk until 3 AM.", artifact: { symbol: "☾", name: "Motel Moon" }, keys: 1 },
      ]},
      { place: "THE BROKEN-DOWN CAR", title: "The engine makes a noise no engine should make.", copy: "Nobody has signal. Somebody has to decide whether this is a crisis or a story.", object: "⚙", choices: [
        { text: "Start troubleshooting.", artifact: { symbol: "⚙", name: "Greasy Bolt" }, keys: 1 },
        { text: "Keep everyone laughing.", artifact: { symbol: "✦", name: "Emergency Joke" } },
        { text: "Walk for help with whoever volunteers.", artifact: { symbol: "↟", name: "Mile Marker" }, keys: 1 },
        { text: "Make sure everyone is okay first.", artifact: { symbol: "♡", name: "First-Aid Pin" } },
      ]},
      { place: "THE SUNRISE OVERLOOK", title: "Nobody planned to end up here.", copy: "There are four folding chairs and the kind of silence that does not need fixing.", object: "☼", choices: [
        { text: "Say what made the trip worth it.", artifact: { symbol: "☼", name: "Sun Token" }, keys: 1 },
        { text: "Take the group photo.", artifact: { symbol: "▣", name: "Blurry Photo" } },
        { text: "Plan another trip immediately.", artifact: { symbol: "↝", name: "Next Exit" } },
        { text: "Just sit there together.", artifact: { symbol: "○", name: "Quiet Mile" }, keys: 1 },
      ]},
    ],
  },
  creative: {
    station: "West Wing · Exhibition permanently unfinished",
    scenes: [
      { place: "THE BLANK GALLERY", title: "The wall says: PUT SOMETHING HERE OR LEAVE IT EMPTY.", copy: "There is paint, wire, a hammer, and a pristine white pedestal begging to be ruined.", object: "▱", choices: [
        { text: "Make something before deciding what it is.", artifact: { symbol: "✺", name: "Wet Paint" }, keys: 1 },
        { text: "Plan the whole piece first.", artifact: { symbol: "⌗", name: "Graph Paper" } },
        { text: "Alter the pedestal itself.", artifact: { symbol: "▥", name: "Chipped Plinth" }, keys: 1 },
        { text: "Leave the wall empty on purpose.", artifact: { symbol: "□", name: "Blank Label" } },
      ]},
      { place: "THE ARCHIVE", title: "Every drawer contains an abandoned idea.", copy: "Some are brilliant. Some should remain evidence in a sealed investigation.", object: "▤", choices: [
        { text: "Rescue the strangest one.", artifact: { symbol: "✧", name: "Orphan Idea" }, keys: 1 },
        { text: "Combine two failures.", artifact: { symbol: "∞", name: "Spliced Sketch" } },
        { text: "Find out why one was abandoned.", artifact: { symbol: "?", name: "Margin Note" }, keys: 1 },
        { text: "Add one of your own.", artifact: { symbol: "✎", name: "Unfinished Card" } },
      ]},
      { place: "THE CRITIQUE ROOM", title: "A stranger says your favorite part is the weakest.", copy: "A red pencil waits on the table. So does the opportunity to become unbearable about art.", object: "✎", choices: [
        { text: "Ask them to explain.", artifact: { symbol: "◇", name: "Red Pencil" }, keys: 1 },
        { text: "Defend the choice.", artifact: { symbol: "◆", name: "Hard Edge" } },
        { text: "Try their suggestion once.", artifact: { symbol: "↻", name: "Revision Strip" }, keys: 1 },
        { text: "Ignore it if it breaks the idea.", artifact: { symbol: "●", name: "Black Dot" } },
      ]},
      { place: "THE WORKSHOP", title: "The piece fails beautifully at 2:11 AM.", copy: "You can repair it, reinvent it, ask for help, or call the accident the point.", object: "⚒", choices: [
        { text: "Repair it meticulously.", artifact: { symbol: "⚒", name: "Tiny Clamp" } },
        { text: "Build around the failure.", artifact: { symbol: "↯", name: "Lucky Crack" }, keys: 1 },
        { text: "Ask someone else what they see.", artifact: { symbol: "◉", name: "Second Eye" }, keys: 1 },
        { text: "Start over.", artifact: { symbol: "○", name: "Clean Slate" } },
      ]},
      { place: "OPENING NIGHT", title: "People are finally standing in front of the thing.", copy: "One person understands it completely. Another understands something you never intended.", object: "✦", choices: [
        { text: "Talk to both of them.", artifact: { symbol: "❝", name: "Two Readings" }, keys: 1 },
        { text: "Hide near the snacks and observe.", artifact: { symbol: "◐", name: "Gallery Shadow" } },
        { text: "Already think about the next piece.", artifact: { symbol: "↝", name: "Next Label" } },
        { text: "Let yourself enjoy finishing it.", artifact: { symbol: "★", name: "Opening Star" }, keys: 1 },
      ]},
    ],
  },
  music: {
    station: "Studio B · Red light means keep playing",
    scenes: [
      { place: "THE LIVE ROOM", title: "Someone plays the wrong chord. It is better.", copy: "Everybody looks through the glass at everybody else. The tape keeps rolling.", object: "♫", choices: [
        { text: "Follow the wrong chord.", artifact: { symbol: "♯", name: "Wrong Chord" }, keys: 1 },
        { text: "Stop and figure out why it worked.", artifact: { symbol: "⌁", name: "Chord Note" } },
        { text: "Loop it until it becomes the song.", artifact: { symbol: "∞", name: "Tape Loop" }, keys: 1 },
        { text: "Finish the original take first.", artifact: { symbol: "●", name: "Take Marker" } },
      ]},
      { place: "THE CONTROL ROOM", title: "The mix has one thing too many.", copy: "Nobody agrees which thing. The engineer has wisely stopped making eye contact.", object: "≋", choices: [
        { text: "Mute your own part first.", artifact: { symbol: "○", name: "Muted Track" }, keys: 1 },
        { text: "Solo everything one by one.", artifact: { symbol: "▥", name: "Solo Button" } },
        { text: "Trust the person with the strongest reaction.", artifact: { symbol: "↯", name: "Fader Cap" } },
        { text: "Take a break and listen fresh.", artifact: { symbol: "☾", name: "Room Tone" }, keys: 1 },
      ]},
      { place: "THE BROKEN TAPE MACHINE", title: "The reel stops halfway through the best take.", copy: "There is a screwdriver, an old manual, and one person who claims they can fix anything.", object: "◉", choices: [
        { text: "Open the machine.", artifact: { symbol: "⚙", name: "Tape Gear" }, keys: 1 },
        { text: "Read the manual first.", artifact: { symbol: "▤", name: "Dog-Eared Manual" } },
        { text: "Let the confident person try.", artifact: { symbol: "✦", name: "Trust Token" } },
        { text: "Record the next take another way.", artifact: { symbol: "↝", name: "Backup Cable" }, keys: 1 },
      ]},
      { place: "THE 2 AM ARGUMENT", title: "Two good ideas cannot both be the chorus.", copy: "Everyone is tired enough to mistake volume for evidence.", object: "!", choices: [
        { text: "Play both versions back-to-back.", artifact: { symbol: "⇄", name: "A/B Tape" }, keys: 1 },
        { text: "Ask what the song actually needs.", artifact: { symbol: "?", name: "Question Mark" } },
        { text: "Combine the strongest parts.", artifact: { symbol: "∞", name: "Splice" }, keys: 1 },
        { text: "Sleep before deciding.", artifact: { symbol: "☾", name: "2 AM Moon" } },
      ]},
      { place: "THE FINAL TAKE", title: "The red light comes on.", copy: "For four minutes nobody can edit, explain, optimize, or send a paragraph about it. Mercifully.", object: "●", choices: [
        { text: "Play it exactly as rehearsed.", artifact: { symbol: "◆", name: "Clean Take" } },
        { text: "Leave room for something unexpected.", artifact: { symbol: "✧", name: "Open Measure" }, keys: 1 },
        { text: "Watch the other players, not the clock.", artifact: { symbol: "◉", name: "Eye Line" }, keys: 1 },
        { text: "Go for the dangerous take.", artifact: { symbol: "↯", name: "Red Light" } },
      ]},
    ],
  },
};
