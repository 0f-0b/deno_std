// Copyright 2018-2025 the Deno authors. MIT license.
// Copyright (c) Jason Campbell. MIT license
// This module is browser compatible.

/**
 * Extracts
 * {@link https://daily-dev-tips.com/posts/what-exactly-is-frontmatter/ | front matter}
 * from strings. Adapted from
 * {@link https://github.com/jxson/front-matter/blob/36f139ef797bd9e5196a9ede03ef481d7fbca18e/index.js | jxson/front-matter}.
 *
 * ## Supported formats
 *
 * ### JSON
 *
 * ```ts
 * import { test, extractJson } from "@std/front-matter";
 * import { assertEquals } from "@std/assert";
 *
 * const str = "---json\n{\"and\": \"this\"}\n---\ndeno is awesome";
 *
 * assertEquals(test(str), true);
 * assertEquals(extractJson(str), {
 *   frontMatter: "{\"and\": \"this\"}",
 *   body: "deno is awesome",
 *   attrs: { and: "this" }
 * });
 * ```
 *
 * {@linkcode extractJson | extract} and {@linkcode test} support the following
 * delimiters.
 *
 * ```markdown
 * ---json
 * {
 *   "and": "this"
 * }
 * ---
 * ```
 *
 * ```markdown
 * {
 *   "is": "JSON"
 * }
 * ```
 *
 * ### TOML
 *
 * ```ts
 * import { test, extractToml } from "@std/front-matter";
 * import { assertEquals } from "@std/assert";
 *
 * const str = "---toml\nmodule = 'front_matter'\n---\ndeno is awesome";
 *
 * assertEquals(test(str), true);
 * assertEquals(extractToml(str), {
 *   frontMatter: "module = 'front_matter'",
 *   body: "deno is awesome",
 *   attrs: { module: "front_matter" }
 * });
 * ```
 *
 * {@linkcode extractToml | extract} and {@linkcode test} support the following
 * delimiters.
 *
 * ```markdown
 * ---toml
 * this = 'is'
 * ---
 * ```
 *
 * ```markdown
 * = toml =
 * parsed = 'as'
 * toml = 'data'
 * = toml =
 * ```
 *
 * ```markdown
 * +++
 * is = 'that'
 * not = 'cool?'
 * +++
 * ```
 *
 * ### YAML
 *
 * ```ts
 * import { test, extractYaml } from "@std/front-matter";
 * import { assertEquals } from "@std/assert";
 *
 * const str = "---yaml\nmodule: front_matter\n---\ndeno is awesome";
 *
 * assertEquals(test(str), true);
 * assertEquals(extractYaml(str), {
 *   frontMatter: "module: front_matter",
 *   body: "deno is awesome",
 *   attrs: { module: "front_matter" }
 * });
 * ```
 *
 * {@linkcode extractYaml | extract} and {@linkcode test} support the following
 * delimiters.
 *
 * ```front_matter
 * ---
 * these: are
 * ---
 * ```
 *
 * ```markdown
 * ---yaml
 * all: recognized
 * ---
 * ```
 *
 * ```markdown
 * = yaml =
 * as: yaml
 * = yaml =
 * ```
 *
 * @module
 */
import { extract as extractJson } from "./json.ts";
import { extract as extractToml } from "./toml.ts";
import { extract as extractYaml } from "./yaml.ts";

export * from "./test.ts";
export * from "./types.ts";

export { extractJson, extractToml, extractYaml };
