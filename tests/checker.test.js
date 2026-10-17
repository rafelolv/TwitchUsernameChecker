import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeUsername,
  validateUsername,
  classifyResponse,
  checkUsername,
} from "../checker.js";

test("normalizes an @ and rejects invalid Twitch usernames before requesting", async () => {
  assert.equal(normalizeUsername("  @Rafelolv  "), "rafelolv");
  for (const name of [
    "",
    "abc",
    "a".repeat(26),
    "café",
    "two words",
    "<script>",
    "abc.def",
  ])
    assert.ok(validateUsername(name));
  for (const name of ["abcd", "rafelolv_123", "a".repeat(25)])
    assert.equal(validateUsername(name), "");
  await assert.rejects(
    checkUsername("abc", {
      fetcher: () => assert.fail("Must not call network"),
    }),
  );
});

test("only reports available or unavailable for an explicit boolean and absent user", () => {
  assert.equal(
    classifyResponse({ data: { user: null, isUsernameAvailable: true } }),
    "available",
  );
  assert.equal(
    classifyResponse({ data: { user: null, isUsernameAvailable: false } }),
    "unavailable",
  );
  assert.equal(
    classifyResponse({
      data: { user: { id: "12826" }, isUsernameAvailable: null },
      errors: [
        { path: ["isUsernameAvailable"], message: "failed integrity check" },
      ],
    }),
    "taken",
  );
});

test("integrity challenges and malformed responses never become false availability", () => {
  assert.equal(
    classifyResponse({
      data: { user: null, isUsernameAvailable: null },
      errors: [{ path: ["isUsernameAvailable"] }],
    }),
    "unknown",
  );
  assert.equal(
    classifyResponse({
      data: { user: null, isUsernameAvailable: true },
      errors: [{ path: ["isUsernameAvailable"] }],
    }),
    "unknown",
  );
  for (const payload of [
    null,
    {},
    { data: {} },
    { data: { isUsernameAvailable: true } },
    { data: { user: null }, errors: [{ path: ["user"] }] },
    {
      data: { user: null, isUsernameAvailable: true },
      errors: [{ message: "Unauthorized" }],
    },
  ])
    assert.equal(classifyResponse(payload), "error");
});

test("reported nonexistent username preserves a successful profile lookup when availability is blocked", async () => {
  const username = "falsiqdsaadsddsfffdsgdfg";
  const result = await checkUsername(username, {
    fetcher: async () =>
      Response.json({
        errors: [
          {
            message: "failed integrity check",
            path: ["isUsernameAvailable"],
            extensions: { code: "IntegrityCheckFailed" },
          },
        ],
        data: { user: null, isUsernameAvailable: null },
      }),
  });
  assert.equal(result.username, username);
  assert.equal(result.state, "unknown");
  assert.equal(validateUsername(username), "");
});

test("handles rate limits, HTTP errors, bad JSON and aborted connections", async () => {
  const limited = await checkUsername("twitch", {
    fetcher: async () => new Response("", { status: 429 }),
  });
  assert.equal(limited.state, "rate-limited");
  await assert.rejects(
    checkUsername("twitch", {
      fetcher: async () => new Response("", { status: 503 }),
    }),
  );
  await assert.rejects(
    checkUsername("twitch", { fetcher: async () => new Response("not json") }),
  );
  await assert.rejects(
    checkUsername("twitch", {
      fetcher: async () => {
        throw new DOMException("Aborted", "AbortError");
      },
    }),
  );
});

test("passes username as a variable, omits credentials, and propagates cancellation", async () => {
  const controller = new AbortController();
  const item = await checkUsername("rafelolv", {
    signal: controller.signal,
    fetcher: async (url, options) => {
      assert.equal(url, "https://gql.twitch.tv/gql");
      assert.equal(options.credentials, "omit");
      assert.equal(options.signal, controller.signal);
      assert.deepEqual(JSON.parse(options.body).variables, {
        login: "rafelolv",
      });
      return Response.json({
        data: { user: { id: "123" }, isUsernameAvailable: false },
      });
    },
  });
  assert.equal(item.state, "taken");
  assert.equal(item.username, "rafelolv");
});
