export default {
  async fetch(request, env) {

    return Response.json({
      hasSecret: !!env.DAHL_API_KEY,
      first10: env.DAHL_API_KEY
        ? env.DAHL_API_KEY.substring(0,10)
        : null,
      length: env.DAHL_API_KEY
        ? env.DAHL_API_KEY.length
        : 0
    });

  }
}
