export async function getServerState() {
  const mod = await import("./server/store.js");
  const store = mod.default || mod;
  return store.getState();
}
