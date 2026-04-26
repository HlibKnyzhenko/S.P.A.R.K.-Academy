export async function getServerState() {
  const mod = await import("../api/_lib/store.js");
  const store = mod.default || mod;
  return store.getState();
}

