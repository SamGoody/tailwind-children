var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_plugin = __toESM(require("tailwindcss/plugin.js"), 1);
const aliases = Object.entries({
  "& >": ["children", "child"],
  "&": ["heir", "descendant"],
  "& ~": ["sibling", "twin"]
});
const psuedo = [
  ...[
    "active",
    "focus",
    "focus-within",
    "focus-visible",
    "hover",
    "disabled",
    "first-of-type",
    "last-of-type",
    "only-of-type",
    "autofill",
    "checked",
    "default",
    "indeterminate",
    "placeholder-shown",
    "required",
    "valid",
    "invalid",
    "in-range",
    "out-of-range",
    "read-only",
    "empty",
    "visited",
    "target"
  ].map((v) => [v, v]),
  ...[
    "before",
    "after",
    "first-letter",
    "first-line",
    "marker",
    "selection",
    "placeholder"
  ].map((v) => [v, `:${v}`]),
  ...[
    ["open", "open"],
    ["rtl", 'dir="rtl"'],
    ["ltr", 'dir="ltr"']
  ].map((v) => [v[0], "", `[${v[1]}]`]),
  ...[
    ["first", "first-child"],
    ["last", "last-child"],
    ["only", "only-child"],
    ["odd", "nth-child(odd)"],
    ["even", "nth-child(even)"],
    ["not-first", "not(:first-child)"],
    ["not-last", "not(:last-child)"],
    ["file", "file-selector-button"]
  ]
];
let variants = psuedo.flatMap(([pstate, pclass, pselector]) => aliases.flatMap(([prefix, newvariants]) => newvariants.map((newvariant) => [
  `${newvariant}-${pstate}`,
  `${prefix} .${newvariant}` + (pselector || `:${pclass}`)
])));
let basic = aliases.flatMap(([k, v]) => v.map((i) => [i, `${k} .${i}`]));
variants.unshift(...basic);
const els = [
  "address",
  "article",
  "aside",
  "footer",
  "header",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "main",
  "nav",
  "section",
  "blockquote",
  "dd",
  "div",
  "dl",
  "dt",
  "figcaption",
  "figure",
  "hr",
  "li",
  "menu",
  "ol",
  "p",
  "pre",
  "ul",
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "br",
  "cite",
  "code",
  "data",
  "dfn",
  "em",
  "i",
  "kbd",
  "mark",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr",
  "area",
  "audio",
  "img",
  "map",
  "track",
  "video",
  "embed",
  "iframe",
  "object",
  "param",
  "picture",
  "portal",
  "source",
  "svg",
  "math"
].map((v) => [v, v]);
let children = els.flatMap(([pstate, pclass, pselector]) => aliases.flatMap(([prefix, newvariants]) => newvariants.map((newvariant) => [
  `${newvariant}-${pstate}`,
  `${prefix} ${pclass}`
])));
variants.unshift(...children);
var src_default = (0, import_plugin.default)(({ addVariant }) => variants.forEach((v) => addVariant(...v)));
module.exports = src_default;