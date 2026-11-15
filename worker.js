export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {

      try {

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
      catch(err) {

        return Response.json(
          {
            error: err.message
          },
          {
            status: 500
          }
        );

      }
    }

    return new Response(
      "Agent Anna Worker Online"
    );

  }
};