/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "mld",

  rules: {
    source_file: ($) => repeat($._item),
    _other_item: ($) =>
      choice(
        $.table,
        $.tr,
        $.th,
        $.td,
        $.table_light,
        $.text,
        $.code,
        $.link,
        $.html,
        $.bold,
        $.italic,
        $.emphasized,
        $.subscript,
        $.superscript,
        $.ul,
        $.li,
        $.ol,
        $.verbatim,
        $.math_inline,
        $.math_display,
        $.inline_code,
        $.comment,
      ),
    _doc: ($) => repeat1($._item), // XXX other_item?
    _item: ($) => choice($._other_item, $.section0),
    _item0: ($) => choice($._other_item, $.section1),
    _item1: ($) => choice($._other_item, $.section2),
    _item2: ($) => choice($._other_item, $.section3),
    _item3: ($) => choice($._other_item, $.section4),
    _item4: ($) => choice($._other_item, $.section5),
    _item5: ($) => $._other_item,
    section0: ($) => prec.right(seq($.heading0, repeat($._item0))),
    section1: ($) => prec.right(seq($.heading1, repeat($._item1))),
    section2: ($) => prec.right(seq($.heading2, repeat($._item2))),
    section3: ($) => prec.right(seq($.heading3, repeat($._item3))),
    section4: ($) => prec.right(seq($.heading4, repeat($._item4))),
    section5: ($) => prec.right(seq($.heading5, repeat($._item5))),
    heading0: ($) => seq("{0", /[^}]+/, "}"),
    heading1: ($) => seq("{1", /[^}]+/, "}"),
    heading2: ($) => seq("{2", /[^}]+/, "}"),
    heading3: ($) => seq("{3", /[^}]+/, "}"),
    heading4: ($) => seq("{4", /[^}]+/, "}"),
    heading5: ($) => seq("{5", /[^}]+/, "}"),
    text: ($) => /[^{}\[]+/,
    table: ($) => seq("{table", $._doc, "}"),
    tr: ($) => seq("{tr", $._doc, "}"),
    th: ($) => seq("{th", $._doc, "}"),
    td: ($) => seq("{td", $._doc, "}"),
    code: ($) =>
      choice(
        seq(
          "{",
          optional(field("language", seq("@", $.language_name))),
          "[",
          $.code_contents,
          "]}",
        ),
        seq("{foo@text[", $._foo_string, "]foo}"),
      ),
    code_contents: ($) => repeat1(choice(/[^\]]/, /][^}]/)),
    // hardcode for "foo" delimiter - see tree-sitter-ocaml for how to implement
    _foo_string: ($) => repeat1(choice(/[^]]+/, /\][^f]/)),
    language_name: ($) => /\w+/,
    link: ($) => choice($.link_target, seq("{", $.link_target, $._doc, "}")),
    link_target: ($) => seq(choice("{!", "{:"), /[^}]+/, "}"),
    html: ($) => seq("{%html:", $.html_content, "%}"),
    html_content: ($) => /[^%]+/,
    bold: ($) => seq("{b", $._doc, "}"),
    italic: ($) => seq("{i", $._doc, "}"),
    emphasized: ($) => seq("{e", $._doc, "}"),
    verbatim: ($) => seq("{v", $._doc, "}"),
    subscript: ($) => seq("{_", $._doc, "}"),
    superscript: ($) => seq("{^", $._doc, "}"),
    ul: ($) => seq("{ul", $._doc, "}"),
    ol: ($) => seq("{ol", $._doc, "}"),
    li: ($) => seq(choice("{li", "{-"), $._doc, "}"),
    math_inline: ($) => seq("{m ", $._doc, "}"),
    math_display: ($) => seq("{math ", $._doc, "}"),
    table_light: ($) => seq("{t", $._doc, "}"),
    inline_code: ($) => seq("[", /[^]]+/, "]"),
    // not really an odoc comment but used in the highlight test suite
    comment: ($) => seq("{%%", /[^%]+/, "%}"),
  },
});
