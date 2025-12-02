const BACKEND =
  import.meta.env.VITE_BACKEND_URL ||
  process?.env?.BACKEND_URL ||
  "http://localhost:8000/api/v1";

async function request(path, opts = {}) {
  const url = `${BACKEND}${path}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  try {
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function health() {
  return request("/health");
}

export async function listUsers() {
  return request("/users");
}

export async function createUser(payload) {
  return request("/users", { method: "POST", body: JSON.stringify(payload) });
}

export async function generateSlides(payload) {
  // placeholder for slide generation API
  return request("/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export default { health, listUsers, createUser, generateSlides };
