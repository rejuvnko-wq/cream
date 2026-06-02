export default async (req, res) => {
  const { reqHandler } = await import('../dist/cream/server/server.mjs');
  return reqHandler(req, res);
};
