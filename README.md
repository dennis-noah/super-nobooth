# Super NoBooth

A retro arcade game about booking meetings at a conference when you have no booth.
Built in under an hour at Fable 5.1 Build Day, Tel Aviv (Delight track).

You wake up on the expo floor with 0 meetings and 90 seconds. Walk up to prospects, pick the comeback
that books the meeting (the other two get you roasted), and dodge the booth reps who trap you in
"a quick demo", the badge scanner who adds you to 14 newsletters, and the guy who follows you all
round pitching his startup. Hummus makes you fast.

## What Fable 5.1 does

1. **It built the game** from a five-line brief, no engine, no assets. See [PROMPT.md](PROMPT.md).
2. **It runs inside the game.** Type any conference name and Fable 5.1 invents the whole cast live:
   satirical people and companies, objections, one comeback that works and two funny bad ones,
   streamed into the running game one character at a time.
3. **It writes the ending.** The cringe LinkedIn post a prospect publishes about you, based on what
   actually happened in your run.

## Run it

```bash
bun install
echo "ANTHROPIC_API_KEY=your-key" > .env
bun server.ts
```

Open http://localhost:3000. Arrows or WASD to run, 1/2/3 to answer, SPACE to escape demos, M for music.
If the API is unreachable the game falls back to a built-in cast.

## Files

- `index.html` the whole game: canvas, vanilla JS, generated chiptune music
- `server.ts` Bun server, two streaming endpoints on `claude-fable-5-1`
- `PROMPT.md` the brief and the in-game prompt
