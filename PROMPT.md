# The brief I gave Fable 5.1 (in Claude Code)

> I want to create a computer game. I want to try something funny.
>
> It can be a conference style game, **Super NoBooth**, where the user needs to hit as many prospects as possible to meet.
>
> Or Skyrim at a conference: you wake up in a conference with 0 meetings and need to go out of your way to get leads.
>
> Use our NoBooth style. Really focus on the judging criteria.

That's it. No spec, no assets, no game engine. ~40 minutes later:

- Fable 5.1 designed and wrote the whole game (one HTML file + a 90-line server).
- **Inside** the game, Fable 5.1 invents the entire cast live for whatever conference you type: names, satire companies, objections, one comeback that works and two that get you roasted. They stream into the running game one by one.
- At the end it writes the cringe LinkedIn post a prospect publishes about you, from what actually happened in your run.

## The in-game prompt (what Fable gets each round)

> Invent prospects for the conference the user names. One JSON object per line.
> The company and title are absurd but recognisable satire of the tech/conference world.
> Exactly one reply is good: short, specific, human, gets to the point.
> The two bad replies are funny in different ways: one is buzzword soup or throat-clearing
> ("Quick one...", "I hope this finds you well"), the other is desperate or weird.

Run it: `bun server.ts` then open http://localhost:3000
