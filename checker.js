// The web client's public identifier is not a secret or an OAuth credential.
// This internal Twitch API is unsupported and may change or refuse requests.
const ENDPOINT = "https://gql.twitch.tv/gql";
const CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";

export function normalizeUsername(value) {
  return value.trim().replace(/^@/, "").toLowerCase();
}

export function validateUsername(username) {
  if (!username) return "Enter a username to check.";
  if (!/^[a-z0-9_]+$/.test(username))
    return "Use only letters (a–z), numbers and underscores (_).";
  if (username.length < 4 || username.length > 25)
    return "The username must be between 4 and 25 characters.";
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
  if (!response.ok) throw new Error("Could not query Twitch.");
  const payload = await response.json();
  return { username, state: classifyResponse(payload), checkedAt: Date.now() };
}

export function parseUsernames(value) {
  const names = value
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(normalizeUsername);
  if (!names.length) throw new Error("Enter at least one username.");
  if (names.length > 100) throw new Error("Use up to 100 names per list.");
  for (const name of names) {
    const error = validateUsername(name);
    if (error) throw new Error(`@${name}: ${error}`);
  }
  return [...new Set(names)];
}

// A user-started queue: one request at a time, no retries, stop on failure.
export async function checkUsernames(
  value,
  { signal, onResult = () => {}, fetcher = fetch } = {},
) {
  const names = parseUsernames(value);
  let completed = 0;
  for (const username of names) {
    if (signal?.aborted)
      return { reason: "cancelled", completed, total: names.length };
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener("abort", abort, { once: true });
    const timeout = setTimeout(abort, 12000);
    let item;
    try {
      item = await checkUsername(username, {
        fetcher,
        signal: controller.signal,
      });
    } catch {
      item = { username, state: "error", checkedAt: Date.now() };
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abort);
    }
    if (signal?.aborted)
      return { reason: "cancelled", completed, total: names.length };
    completed++;
    onResult(item, completed, names.length);
    if (item.state === "error" || item.state === "rate-limited")
      return { reason: item.state, completed, total: names.length };
  }
  return { reason: "complete", completed, total: names.length };
}
