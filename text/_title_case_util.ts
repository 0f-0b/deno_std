// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
import {
  lowercase,
  titlecase_segment,
} from "./_wasm_casemap/lib/deno_std_wasm_casemap.mjs";

/** Base options for title-case functions */
export interface BaseTitleCaseOptions {
  /**
   * Uses localized case formatting. If it is set to `true`, uses default
   * locale on the system. If it's set to a specific locale, uses that locale.
   *
   * @default {false}
   */
  locale?: boolean | NonNullable<Intl.LocalesArgument>;
  /**
   * If `false`, lowercases the rest of the characters in the string, even if
   * they were previously capitalized. If `true`, keeps the original casing of
   * the rest of the characters in the string.
   *
   * @default {false}
   */
  keepTrailingCase?: boolean;
}

type ResolvedOptions = {
  force: boolean;
  language: string;
  segmenter: Intl.Segmenter;
};

const defaultSegmenter = new Intl.Segmenter("en-US", { granularity: "word" });

export function resolveOptions(
  options: undefined | BaseTitleCaseOptions,
): ResolvedOptions {
  const force = !options?.keepTrailingCase;
  const locale = options?.locale;

  let segmenter = defaultSegmenter;
  let language = "und";
  if (locale !== undefined && locale !== false) {
    segmenter = new Intl.Segmenter(
      locale === true ? undefined : locale,
      { granularity: "word" },
    );
    language = segmenter.resolvedOptions().locale.split("-", 1)[0]!;
  }

  return { force, language, segmenter };
}

export function titleCaseWord(word: string, opts: ResolvedOptions): string {
  return titlecase_segment(word, opts.language, opts.force);
}

export function lowerCaseRest(str: string, opts: ResolvedOptions): string {
  return opts.force ? lowercase(str, opts.language) : str;
}
