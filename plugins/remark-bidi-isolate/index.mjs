/**
 * @file remark-bidi-isolate
 *
 * Remark plugin that solves the Unicode BiDi (Bidirectional Text) problem
 * for Arabic-heavy educational content.
 *
 * The Problem (most visible in Safari iPhone and Google Chrome with mixed
 * Arabic/English phrases inside one sentence):
 *
 *   المستخدم كتب في سطر الأوامر cd /home, Linux ثم...
 *
 * The browser sees the first strong Arabic char as the paragraph direction
 * but then struggles to order the embedded English words correctly.
 *
 * The Fix:
 *   لكل نص `text` node في mdast، نفّذ tokenization عند حدود Arabic/English
 *   واستبدل بـ sequence من nodes:
 *     - `{type: 'text', value: 'السحابة على '}` → نص عربي عادي
 *     - `{type: 'mdxJsxTextElement', name: 'bdi', children: [{type: 'text', value: 'Linux'}]}`
 *       → لف الكلمة الإنجليزية في `<bdi dir="ltr">` ليعزلها عن السياق العربي
 *
 * CSS:
 *   bdi { unicode-bidi: isolate; display: inline-block }
 *
 * لمسة إضافية عن `mdxJsxTextElement`:
 *   MDX 3 (المستخدم في Docusaurus v3.10.2) يعامل عقد `html` التي تفتح/تُغلق
 *   عبر nodes منفصلة على أنها بناء مكسور. لذلك نستخدم `mdxJsxTextElement`
 *   الذي يولّد JSX صحيح: `<bdi>...</bdi>`.
 *
 * @example
 *   Input:  "السحابة تُبنى على Linux."
 *   Output: text("السحابة تُبنى على ") + <bdi>Linux</bdi> + text(".")
 *
 * @author ARES EDU PLATFORM Engineering
 */

import { visit } from "unist-util-visit";

/**
 * Arabic Unicode blocks:
 *   - Arabic (U+0600–U+06FF)
 *   - Arabic Supplement (U+0750–U+077F) — rare
 *   - Arabic Presentation Forms-A (U+FB50–U+FDFF)
 *   - Arabic Presentation Forms-B (U+FE70–U+FEFF)
 */
const ARABIC_RE = /[\u0600-\u06FF\uFB50-\uFEFF]/;

/**
 * English-char classifier:
 *   - Core ASCII letters A–Z, a–z
 *   - Digits 0–9
 *   - Allowed separators inside English words/paths: . _ + - / : # @ & ~ =
 *   - Versions like v1.2.3 — fully covered
 */
const EN_CORE_RE = /[A-Za-z0-9]/;
const EN_SEP_RE = /[._+\-/:#@&~=]/;

/**
 * Classify a single character as Arabic, English-attachable, or neutral.
 *
 * @param {string} ch
 * @returns {'ar' | 'en' | null}
 */
function classify(ch) {
  if (ARABIC_RE.test(ch)) return "ar";
  if (EN_CORE_RE.test(ch) || EN_SEP_RE.test(ch)) return "en";
  return null; // punctuation / whitespace / emoji
}

/**
 * Split a raw text node value into language-tagged tokens.
 *
 * Algorithm:
 *   - Walk character by character.
 *   - Maintain an active language (lang: 'ar' | 'en').
 *   - On language switch, flush the current buffer into a token.
 *   - Neutral chars (space, punctuation, Arabic comma, etc.) attach to the
 *     currently active language without breaking the run.
 *
 * @param {string} text
 * @returns {Array<{ lang: 'ar' | 'en', text: string }>}
 */
function tokenize(text) {
  const tokens = [];
  let buf = "";
  let lang = null;

  const flush = () => {
    if (buf.length > 0) {
      tokens.push({ lang: lang || "ar", text: buf });
      buf = "";
    }
  };

  for (const ch of text) {
    const c = classify(ch);
    if (c === null) {
      // Neutral character — keep it attached to the current run.
      buf += ch;
    } else if (lang === c) {
      buf += ch;
    } else {
      // Language switch — flush and start a new run.
      flush();
      lang = c;
      buf = ch;
    }
  }
  flush();

  return tokens;
}

/**
 * Ensure a token really contains English content (not just a stray separator).
 * Separators like "." alone shouldn't trigger wrapping.
 *
 * @param {string} text
 * @returns {boolean}
 */
function hasEnglishCore(text) {
  return EN_CORE_RE.test(text);
}

/**
 * Build an `mdxJsxTextElement` node representing `<bdi dir="ltr">…</bdi>`.
 *
 * @param {string} text
 * @returns {object}
 */
function buildBdiNode(text) {
  return {
    type: "mdxJsxTextElement",
    name: "bdi",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "dir",
        value: "ltr",
      },
    ],
    children: [{ type: "text", value: text }],
  };
}

/**
 * Decide whether to skip processing the current `text` node.
 *
 * Reasons to skip:
 *   - Parent is `inlineCode` or `code` (already LTR-correct inside backticks).
 *   - Parent is an existing `<bdi>` or `<span dir="ltr">` wrapper (avoid
 *     double-wrapping).
 *   - Text is pure-Arabic or pure-English (no mixed content to fix).
 *
 * @param {object} parent
 * @param {string} originalValue
 * @returns {boolean}
 */
function shouldSkip(parent, originalValue) {
  if (!parent) return true;
  if (parent.type === "inlineCode" || parent.type === "code") return true;

  if (parent.type === "mdxJsxTextElement" && (parent.name === "bdi" || parent.name === "span")) {
    return true;
  }

  const tokens = tokenize(originalValue);
  const hasAr = tokens.some((t) => t.lang === "ar");
  const hasEn = tokens.some((t) => t.lang === "en" && hasEnglishCore(t.text));
  if (!hasAr || !hasEn) return true;

  return false;
}

/**
 * Docusaurus/Vite-compatible remark plugin (CommonJS interop friendly).
 *
 * @returns {(tree: import('mdast').Root) => void}
 */
export default function remarkBidiIsolate() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (parent === null || parent === undefined || index === null || index === undefined) {
        return;
      }
      if (shouldSkip(parent, node.value)) return;

      const tokens = tokenize(node.value);
      const newChildren = tokens.map((tok) => {
        if (tok.lang === "en" && hasEnglishCore(tok.text)) {
          return buildBdiNode(tok.text);
        }
        return { type: "text", value: tok.text };
      });

      // Splice the new node sequence in place of the original text node.
      parent.children.splice(index, 1, ...newChildren);

      // Continue traversal past the inserted nodes to avoid infinite revisit.
      return index + newChildren.length;
    });
  };
}
