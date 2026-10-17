import test from "node:test";
import assert from "node:assert/strict";
import { parseUsernames, checkUsernames } from "../checker.js";

const absent = () => ({
  ok: true,
  json: async () => ({ data: { user: null } }),
});

test("list input normalizes and deduplicates without silently truncating names", () => {
  assert.deepEqual(parseUsernames("@FirstName, SECONDNAME\nfirstname"), [
    "firstname",
    "secondname",
  ]);
  for (const value of [
    "",
    "abc",
    "a".repeat(26),
    "fine_name bad-name",
    Array(101).fill("name").join("\n"),
  ]) {
    assert.throws(() => parseUsernames(value));
  }
});

test("100 names run sequentially and preserve unconfirmed availability", async () => {
  let active = 0;
  let peak = 0;
  let calls = 0;
  const results = [];
  const summary = await checkUsernames(
    Array.from({ length: 100 }, (_, i) => `name${i}`).join("\n"),
    {
      intervalMs: 0,
      fetcher: async () => {
        calls++;
        active++;
        peak = Math.max(peak, active);
        await Promise.resolve();
        active--;
        return absent();
      },
      onResult: (item) => results.push(item),
    },
  );
  assert.equal(calls, 100);
  assert.equal(peak, 1);
  assert.equal(results.length, 100);
  assert.ok(results.every((item) => item.state === "unknown"));
  assert.deepEqual(summary, { reason: "complete", completed: 100, total: 100 });
});

test("all validation happens before any list request", async () => {
  let calls = 0;
  await assert.rejects(
    checkUsernames("validname invalid-name", {
      fetcher: () => {
        calls++;
      },
    }),
  );
  assert.equal(calls, 0);
});

test("rate limits and failed lookups stop the queue without retries", async () => {
  for (const [response, expected] of [
    [{ status: 429 }, "rate-limited"],
    [{ ok: false }, "error"],
    [
      { ok: true, json: async () => ({ errors: [{ message: "blocked" }] }) },
      "error",
    ],
  ]) {
    let calls = 0;
    const results = [];
    const summary = await checkUsernames("first_name second_name", {
      intervalMs: 0,
      fetcher: async () => {
        calls++;
        return response;
      },
      onResult: (item) => results.push(item),
    });
    assert.equal(calls, 1);
    assert.equal(summary.reason, expected);
    assert.equal(results[0].state, expected);
    assert.equal(summary.completed, 1);
  }
});

test("stopping aborts an active lookup and leaves remaining names unchecked", async () => {
  const controller = new AbortController();
  const results = [];
  const summary = await checkUsernames("first_name second_name", {
    signal: controller.signal,
    fetcher: async (_url, { signal }) =>
      new Promise((resolve, reject) => {
        signal.addEventListener("abort", () => reject(new Error("aborted")), {
          once: true,
        });
        controller.abort();
      }),
    onResult: (item) => results.push(item),
  });
  assert.equal(summary.reason, "cancelled");
  assert.equal(summary.completed, 0);
  assert.equal(results.length, 0);
});

test("stopping between lookups preserves results and sends no next request", async () => {
  const controller = new AbortController();
  let calls = 0;
  const summary = await checkUsernames("first_name second_name", {
    signal: controller.signal,
    fetcher: async () => {
      calls++;
      return absent();
    },
    onResult: () => controller.abort(),
  });
  assert.equal(calls, 1);
  assert.equal(summary.reason, "cancelled");
  assert.equal(summary.completed, 1);
});
