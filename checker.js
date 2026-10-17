// The web client's public identifier is not a secret or an OAuth credential.
// This internal Twitch API is unsupported and may change or refuse requests.
const ENDPOINT = "https://gql.twitch.tv/gql";
const CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";

export function normalizeUsername(value) {
  return value.trim().replace(/^@/, "").toLowerCase();
}

export function validateUsername(username) {
  if (!username) return "Digite o nickname que você quer consultar.";
  if (!/^[a-z0-9_]+$/.test(username))
    return "Use apenas letras sem acento, números e underline (_).";
  if (username.length < 4 || username.length > 25)
    return "O nickname precisa ter entre 4 e 25 caracteres.";
  return "";
}

export function classifyResponse(payload) {
  const data = payload?.data;
  const errors = payload?.errors;
  const userFailed =
    Array.isArray(errors) &&
    errors.some((error) => !error.path || error.path[0] === "user");
  if (data?.user && typeof data.user.id === "string" && !userFailed)
    return "taken";
  // A missing/failed user lookup is never evidence of an absent profile.
  if (!data || !Object.hasOwn(data, "user") || data.user !== null || userFailed)
    return "error";
  const availabilityFailed =
    Array.isArray(errors) &&
    errors.some(
      (error) => !error.path || error.path[0] === "isUsernameAvailable",
    );
  if (!availabilityFailed && data.isUsernameAvailable === true)
    return "available";
  if (!availabilityFailed && data.isUsernameAvailable === false)
    return "unavailable";
  return "unknown";
}

export async function checkUsername(
  username,
  { fetcher = fetch, signal } = {},
) {
  const validation = validateUsername(username);
  if (validation) throw new Error(validation);
  const response = await fetcher(ENDPOINT, {
    method: "POST",
    headers: { "Client-ID": CLIENT_ID, "Content-Type": "application/json" },
    credentials: "omit",
    signal,
    body: JSON.stringify({
      operationName: "CheckUsername",
      query:
        "query CheckUsername($login: String!) { user(login: $login) { id login displayName } isUsernameAvailable(username: $login) }",
      variables: { login: username },
    }),
  });
  if (response.status === 429)
    return { username, state: "rate-limited", checkedAt: Date.now() };
  if (!response.ok) throw new Error("Não foi possível consultar a Twitch.");
  const payload = await response.json();
  return { username, state: classifyResponse(payload), checkedAt: Date.now() };
}
