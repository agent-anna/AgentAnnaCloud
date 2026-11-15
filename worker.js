export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {

      if (request.method !== "POST") {
        return new Response(
          JSON.stringify({
            status: "online",
            message: "POST required"
          }),
          {
            status: 405,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
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
                {
                  role: "user",
                  content: prompt
                }
              ]
            })
          }
        );

        const data = await response.json();

        return new Response(
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

      } catch (error) {

        return new Response(
          JSON.stringify({
            error: error.message
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

      }

    }

    return env.ASSETS.fetch(request);

  }
};
