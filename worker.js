export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {

      if (request.method !== "POST") {
        return Response.json(
          {
            error: "POST required"
          },
          {
            status: 405
          }
        );
      }

      try {

        const text = await request.text();

        if (!text) {
          return Response.json(
            {
              error: "No request body received"
            },
            {
              status: 400
            }
          );
        }

        const body = JSON.parse(text);

        const prompt =
          body.prompt || "Hello";

        const response =
          await fetch(
            "https://inference.dahl.global/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Authorization":
                  `Bearer ${env.DAHL_API_KEY}`,
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify({
                model: "gpt-oss-120b",
                messages: [
                  {
                    role: "user",
                    content: prompt
                  }
                ]
              })
            }
          );

        const data =
          await response.json();

        return Response.json(data);

      }
      catch (err) {

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

    if (
      url.pathname === "/" ||
      url.pathname === "/index.html"
    ) {

      return new Response(
        await env.ASSETS.fetch(request).then(
          r => r.text()
        ),
        {
          headers: {
            "Content-Type":
              "text/html;charset=utf-8"
          }
        }
      );

    }

    return env.ASSETS.fetch(request);

  }
};