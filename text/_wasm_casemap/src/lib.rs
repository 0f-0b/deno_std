// Copyright 2018-2025 the Deno authors. MIT license.
use icu_casemap::CaseMapper;
use icu_casemap::options::{TitlecaseOptions, TrailingCase};
use icu_locale_core::{LanguageIdentifier, langid};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(skip_typescript)]
#[derive(Clone, Copy, Debug)]
pub enum Language {
  Turkish = "tr",
  Azeri = "az",
  Lithuanian = "lt",
  Greek = "el",
  Dutch = "nl",
  Armenian = "hy",
}

impl Language {
  pub fn to_langid(self) -> LanguageIdentifier {
    match self {
      Language::Turkish => langid!("tr"),
      Language::Azeri => langid!("az"),
      Language::Lithuanian => langid!("lt"),
      Language::Greek => langid!("el"),
      Language::Dutch => langid!("nl"),
      Language::Armenian => langid!("hy"),
      _ => langid!("und"),
    }
  }
}

#[wasm_bindgen(typescript_custom_section)]
const LANGUAGE_TYPE: &'static str = "type Language = string";

#[wasm_bindgen]
pub fn titlecase_segment(
  input: &str,
  language: Language,
  force: bool,
) -> String {
  let mut options = TitlecaseOptions::default();
  options.trailing_case = Some(if force {
    TrailingCase::Lower
  } else {
    TrailingCase::Unchanged
  });
  const { CaseMapper::new() }
    .titlecase_segment_with_only_case_data_to_string(
      input,
      &language.to_langid(),
      options,
    )
    .into_owned()
}

#[wasm_bindgen]
pub fn lowercase(input: &str, language: Language) -> String {
  const { CaseMapper::new() }
    .lowercase_to_string(input, &language.to_langid())
    .into_owned()
}
