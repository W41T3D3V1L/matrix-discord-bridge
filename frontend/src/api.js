const API = process.env.REACT_APP_API;

export async function login(email, password) {
  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function register(email, password) {
  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getMappings() {
  const res = await fetch(API + "/mappings");
  return res.json();
}

export async function addMapping(roomId, channelId) {
  const res = await fetch(API + "/mappings", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ roomId, channelId })
  });
  return res.json();
}

export async function deleteMapping(id) {
  await fetch(API + "/mappings/" + id, {
    method: "DELETE"
  });
}
