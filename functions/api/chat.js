export async function onRequestPost(context) {

  return Response.json({

    status: "ONLINE",

    system: "Agent Anna",

    message: "Cloudflare Function Working",

    time: new Date().toISOString()

  });

}