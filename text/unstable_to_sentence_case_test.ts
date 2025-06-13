// Copyright 2018-2025 the Deno authors. MIT license.
import { assertEquals } from "@std/assert";
import { toSentenceCase } from "./unstable_to_sentence_case.ts";
import { toTitleCase } from "./unstable_to_title_case.ts";

Deno.test("toSentenceCase() converts a string to title case", () => {
  const input = "hello world";
  assertEquals(toSentenceCase(input), "Hello world");
});

Deno.test("toSentenceCase() respects special title-case mappings", () => {
  const input = "ﬆrange ﬂoating aﬃrmation";
  const expected = "Strange ﬂoating aﬃrmation";
  assertEquals(toSentenceCase(input), expected);
});

Deno.test("toSentenceCase() works with punctuation", () => {
  const input = "“hello, world!”";
  assertEquals(toSentenceCase(input), "“Hello, world!”");
});

Deno.test("toSentenceCase() works the same as toTitleCase() filtering words on index == 0", () => {
  const str = "hello world";

  assertEquals(
    toSentenceCase(str),
    toTitleCase(str, { exclude: (_, i) => i > 0 }),
  );
});

Deno.test("toSentenceCase() can be customized with options", async (t) => {
  await t.step("`keepTrailingCase`", async (t) => {
    const input = "hELLO wOrLd";

    await t.step("defaults to `false`", () => {
      assertEquals(toSentenceCase(input), "Hello world");
    });

    await t.step("explicitly passing `false`", () => {
      assertEquals(
        toSentenceCase(input, { keepTrailingCase: false }),
        "Hello world",
      );
    });

    await t.step("enabled by passing `true`", () => {
      assertEquals(
        toSentenceCase(input, { keepTrailingCase: true }),
        "HELLO wOrLd",
      );
    });
  });

  await t.step("`locale`", async (t) => {
    const input = "irrIgation";

    await t.step('defaults to `false`, using locale-agnostic "und"', () => {
      assertEquals(toSentenceCase(input), "Irrigation");
    });

    await t.step("supports passing a specific locale", () => {
      assertEquals(toSentenceCase(input, { locale: "tr-TR" }), "İrrıgation");
    });
  });
});

Deno.test("toSentenceCase() leaves later words lower-case even if the first word is case-agnostic", () => {
  const input = "文字 word";
  assertEquals(toSentenceCase(input), input);
});
