export const config = {
  runtime: "edge",
  regions: ["sin1"],
};

export default (req) => new Response(JSON.stringify({ message: "OK" }), {
  headers: { "Content-Type": "application/json" },
});
