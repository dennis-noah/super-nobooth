import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const MODEL = "claude-fable-5-1";

const PROSPECT_SYSTEM = `You write content for "Super NoBooth", a funny arcade game. The player is a founder at a conference with NO booth who must book meetings by walking up to prospects on the expo floor.

Invent prospects for the conference the user names. Output NDJSON: exactly one compact JSON object per line, no markdown, no code fences, no commentary before or after.

Each line: {"name":"First Last","title":"...","company":"...","objection":"...","replies":[{"text":"...","good":true,"reaction":"..."},{"text":"...","good":false,"reaction":"..."},{"text":"...","good":false,"reaction":"..."}]}

Rules:
- The company and title are absurd but recognisable satire of the tech/conference world, fitted to the named conference and city.
- "objection" is what the prospect says when the player walks up (max 18 words). Classic brush-offs, made specific and funny.
- Exactly one reply has good:true. It is short, specific, human and gets to the point. The two bad replies are funny in different ways: one is buzzword soup or throat-clearing ("Quick one...", "I hope this finds you well"), the other is desperate or weird.
- Each reply "text" is max 16 words. Each "reaction" is the prospect's response, max 16 words: a roast for bad replies, a booked meeting for the good one.
- VARIETY IS THE WHOLE JOB. Every prospect uses a different brush-off archetype (too busy, send an email, not my department, already have a vendor, only here for swag, on a call, my agent handles it, budget frozen, just pivoted, in stealth, hungover, looking for the toilet, thinks you are staff, etc).
- Every good reply uses a different angle and different wording: a sharp question, a specific observation about them, a tiny offer, honesty, a well-judged joke, a time-boxed ask. Never reuse a phrase, a time ("15 minutes", "Thursday") or a structure across prospects. Do not keep mentioning booths.
- Every bad reply is a different flavour of bad across the set: buzzword soup, throat-clearing, fake familiarity, oversharing, begging, negging, reading from a script, pitching features nobody asked about, LinkedIn-influencer speak, "per my last email", AI-generated flattery. No two bad replies alike.
- Put the good reply at a random position. Vary the humour. No slurs, nothing mean about real people or real companies.`;

const LINKEDIN_SYSTEM = `You write the LinkedIn post a conference prospect publishes the evening after meeting the player of "Super NoBooth" (a founder who came to the conference with no booth and ran around the expo floor booking meetings).

Write it in peak cringe LinkedIn style: one-line paragraphs, a humblebrag, a forced lesson, "Agree?" at the end, 3 silly hashtags. Mention the player's actual result and one or two of the real encounters you are given. If the player did badly, the post is a polite public roast. If they did well, the post is awestruck. Max 75 words. Plain text only, no markdown.`;

function streamText(params: { system: string; user: string; maxTokens: number }) {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          const stream = client.messages.stream({
            model: MODEL,
            max_tokens: params.maxTokens,
            output_config: { effort: "low" },
            system: params.system,
            messages: [{ role: "user", content: params.user }],
          } as any);
          stream.on("text", (t: string) => controller.enqueue(encoder.encode(t)));
          const final = await stream.finalMessage();
          if (final.stop_reason === "refusal") {
            controller.enqueue(encoder.encode("\n"));
          }
        } catch (err) {
          console.error("API error:", err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
        } finally {
          controller.close();
        }
      },
    }),
    { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-cache" } },
  );
}

Bun.serve({
  port: 3000,
  idleTimeout: 255,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/api/prospects") {
      const { conference, product } = await req.json();
      return streamText({
        system: PROSPECT_SYSTEM,
        maxTokens: 8000,
        user: `Conference: ${String(conference).slice(0, 200)}\nWhat the player sells: ${String(product).slice(0, 200)}\n\nWrite 18 prospects.`,
      });
    }

    if (req.method === "POST" && url.pathname === "/api/linkedin") {
      const body = await req.json();
      return streamText({
        system: LINKEDIN_SYSTEM,
        maxTokens: 2000,
        user: JSON.stringify(body).slice(0, 4000),
      });
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(Bun.file(import.meta.dir + "/index.html"));
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log("Super NoBooth running at http://localhost:3000");
