// Copyright 2018-2025 the Deno authors. MIT license.

import { assertEquals, assertThrows } from "@std/assert";
import { concat } from "@std/bytes";
import {
  calcSizeBase64,
  decodeBase64,
  encodeBase64,
  encodeIntoBase64,
} from "./unstable_base64.ts";

const inputOutput: [string | ArrayBuffer, string, string][] = [
  ["", "", ""],
  ["A", "QQ==", "QQ"],
  ["AA", "QUE=", "QUE"],
  ["AAA", "QUFB", "QUFB"],
  ["AAAA", "QUFBQQ==", "QUFBQQ"],
  [new Uint8Array(0).fill(255).buffer, "", ""],
  [new Uint8Array(1).fill(255).buffer, "/w==", "_w"],
  [new Uint8Array(2).fill(255).buffer, "//8=", "__8"],
  [new Uint8Array(3).fill(255).buffer, "////", "____"],
  [new Uint8Array(4).fill(255).buffer, "/////w==", "_____w"],
];

Deno.test("encodeBase64()", () => {
  for (const [input, base64, base64url] of inputOutput) {
    assertEquals(encodeBase64(input.slice(0), "Base64"), base64, "Base64");
    assertEquals(
      encodeBase64(input.slice(0), "Base64Url"),
      base64url,
      "Base64Url",
    );
  }
});

Deno.test("encodeBase64() subarray", () => {
  for (const [input, base64, base64url] of inputOutput) {
    if (typeof input === "string") continue;

    const buffer = new Uint8Array(10);
    buffer.set(new Uint8Array(input), 10 - input.byteLength);

    assertEquals(
      encodeBase64(buffer.slice().subarray(10 - input.byteLength), "Base64"),
      base64,
      "Base64",
    );
    assertEquals(
      encodeBase64(buffer.slice().subarray(10 - input.byteLength), "Base64Url"),
      base64url,
      "Base64Url",
    );
  }
});

Deno.test("encodeBase64Into()", () => {
  const prefix = new TextEncoder().encode("data:fake/url,");
  for (const [input, base64, base64url] of inputOutput) {
    if (typeof input === "string") continue;

    for (
      const [output, format] of [
        [concat([prefix, new TextEncoder().encode(base64)]), "Base64"],
        [concat([prefix, new TextEncoder().encode(base64url)]), "Base64Url"],
      ] as const
    ) {
      const buffer = new Uint8Array(
        prefix.length + calcSizeBase64(input.byteLength),
      );
      buffer.set(prefix);

      const o = prefix.length + encodeIntoBase64(
        input,
        buffer.subarray(prefix.length),
        format,
      );
      assertEquals(buffer.subarray(0, o), output, format);
    }
  }
});

Deno.test("encodeBase64Into() with too small buffer", () => {
  const prefix = new TextEncoder().encode("data:fake/url,");
  for (const [input] of inputOutput) {
    if (typeof input === "string" || input.byteLength === 0) continue;

    for (const format of ["Base64", "Base64Url"] as const) {
      const buffer = new Uint8Array(
        prefix.length + calcSizeBase64(input.byteLength) - 2,
      );
      buffer.set(prefix);

      assertThrows(
        () =>
          encodeIntoBase64(
            input,
            buffer.subarray(prefix.length),
            format,
          ),
        RangeError,
        "Cannot encode input as base64: Output too small",
        format,
      );
    }
  }
});

Deno.test("decodeBase64()", () => {
  for (const [input, base64, base64url] of inputOutput) {
    if (input instanceof ArrayBuffer) continue;
    const output = new TextEncoder().encode(input);

    assertEquals(decodeBase64(base64, "Base64"), output, "Base64");
    assertEquals(decodeBase64(base64url, "Base64Url"), output, "Base64Url");
  }
});

Deno.test("decodeBase64() invalid char after padding", () => {
  for (const [input, base64, base64url] of inputOutput) {
    if (input instanceof ArrayBuffer) continue;
    if (base64[base64.length - 2] !== "=") continue;

    for (
      const [input, format] of [
        [base64.substring(-1) + ".", "Base64"],
        [base64url.substring(-1) + ".", "Base64Url"],
      ] as const
    ) {
      assertThrows(
        () => decodeBase64(input, format),
        TypeError,
        "Cannot decode input as base64: Invalid character (.)",
        format,
      );
    }
  }
});

Deno.test("decodeBase64() invalid length", () => {
  for (const [input, base64, _base64url] of inputOutput) {
    if (input instanceof ArrayBuffer) continue;

    for (
      const [input, format] of [
        [base64.replaceAll("=", "b") + "a", "Base64"],
        [
          base64
            .replaceAll("+", "-")
            .replaceAll("/", "_")
            .replaceAll("=", "b") + "a",
          "Base64Url",
        ],
      ] as const
    ) {
      assertThrows(
        () => decodeBase64(input, format),
        RangeError,
        `Length (${input.length}), excluding padding, must not have a remainder of 1 when divided by 4`,
        format,
      );
    }
  }
});

Deno.test("decodeBase64() invalid char", () => {
  for (const [input, base64, base64url] of inputOutput) {
    if (input instanceof ArrayBuffer) continue;

    for (
      const [input, format] of [
        [".".repeat(4) + base64, "Base64"],
        [".".repeat(4) + base64url, "Base64Url"],
      ] as const
    ) {
      assertThrows(
        () => decodeBase64(input, format),
        TypeError,
        "Cannot decode input as base64: Invalid character (.)",
        format,
      );
    }
  }
});

Deno.test("decodeBase64() throws with invalid byte >= 128", () => {
  const input = new TextDecoder().decode(new Uint8Array(4).fill(200));
  assertThrows(
    () => decodeBase64(input),
    TypeError,
    "Cannot decode input as base64: Invalid character",
  );
});
