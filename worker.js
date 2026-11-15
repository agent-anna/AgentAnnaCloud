export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {

      if (request.method !== "POST") {
        return Response.json({
          error: "POST required"
        }, {
          status: 405
        });
      }

      const body = await request.json();

      const response = await fetch(
        "https://inference.dahl.global/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.DAHL_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-oss-120b",
            messages: [
              {
                role: "user",
                content: body.prompt
              }
            ]
          })
        }
      );

      const data = await response.json();

      return Response.json(data);
    }

    return new Response("Agent Anna Cloud Brain");
  }
};
