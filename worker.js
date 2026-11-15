export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "POST required" }), { status: 405, headers: corsHeaders });
      }

      try {
        const body = await request.json();
        const prompt = body.prompt || "Hello";

        const response = await fetch(
          "https://inference.dahl.global/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${env.DAHL_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "MiniMaxAI/MiniMax-M2.7",
              messages: [
                { role: "system", content: "You are Agent Anna. Reply directly, warmly, and concisely. Never output <think> tags or internal reasoning." },
                { role: "user", content: prompt }
              ]
            })
          }
        );

        const data = await response.json();
        let raw = data?.choices?.[0]?.message?.content || "";

        if (raw.includes("</think>")) {
          raw = raw.split("</think>").pop();
        }
        const cleanReply = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/<\/?think>/gi, "").trim();

        return new Response(
          JSON.stringify({ reply: cleanReply || "Online." }),
          { headers: corsHeaders }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    if (url.pathname === "/api/tts") {
      try {
        const text = (url.searchParams.get("text") || "Hello Martin.").slice(0, 800);
        const voice = url.searchParams.get("voice") || "Joanna";

        const ttsUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${encodeURIComponent(voice)}&text=${encodeURIComponent(text)}`;
        const audioRes = await fetch(ttsUrl, {
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (!audioRes.ok) {
          return new Response(JSON.stringify({ error: "TTS error" }), { status: 502, headers: corsHeaders });
        }

        return new Response(audioRes.body, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store"
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === "/api/memory") {
      try {
        return env.ASSETS.fetch(new Request(new URL("/memory.json", request.url)));
      } catch (err) {
        return new Response(JSON.stringify([]), { headers: corsHeaders });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
