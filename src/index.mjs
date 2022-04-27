import { default as plugin } from 'tailwindcss/plugin.js'

const aliases = Object.entries({
    "& >": ['children', 'child'],
    "&"  : ['heir', 'descendant'],
    "& ~": ['sibling', 'twin'],
    })

// Handle all tailwind psuedoclasses, see:
// https://tailwindcss.com/docs/hover-focus-and-other-states#quick-reference
const psuedo = [
    ... [
        'active', 'focus', 'focus-within', 'focus-visible', 'hover', 'disabled',  // Interactive
        'first-of-type', 'last-of-type', 'only-of-type',                          // Positional
        'autofill', 'checked', 'default', 'indeterminate', 'placeholder-shown',   // Forms
        'required', 'valid', 'invalid', 'in-range', 'out-of-range', 'read-only',  // Forms
        'empty', 'visited', 'target',                                             // State
        ].map(v => [v, v]),
    ... [ // Pseudo-elements
        'before', 'after', 'first-letter', 'first-line', 'marker', 'selection', 'placeholder'
        ].map(v => [v, `:${v}`]),
    ... [ // Attributes
        ['open', 'open'],
        ['rtl', 'dir="rtl"'],
        ['ltr', 'dir="ltr"'],
        ].map(v => [v[0], '', `[${v[1]}]`]),
    ... [ // Positional
        ['first', 'first-child'],
        ['last', 'last-child'],
        ['only', 'only-child'],
        ['odd', 'nth-child(odd)'],
        ['even', 'nth-child(even)'],
        ['not-first', 'not(:first-child)'],
        ['not-last', 'not(:last-child)'],
        ['file', 'file-selector-button'],
        ],
    ]

// convert ['hover', 'hover'] -> ['children-hover', '& > .children:hover']
let variants = psuedo.flatMap(([pstate, pclass, pselector]) =>
    aliases.flatMap(([prefix, newvariants]) =>
        newvariants.map(newvariant => [
            `${newvariant}-${pstate}`,
            `${prefix} .${newvariant}` + (pselector || `:${pclass}`)
            ])))

let basic = aliases
    .flatMap(([k, v]) => v.map(i => [i, `${k} .${i}`]));

variants.unshift(...basic);

// list of elements from https://developer.mozilla.org/en-US/docs/Web/HTML/Element
// For each of these we do not need explicit sign-in
const els = [
    // content
    'address', 'article', 'aside', 'footer', 'header',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'main', 'nav', 'section',

    // Text content
    'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure',
    'hr', 'li', 'menu', 'ol', 'p', 'pre', 'ul',

    // Inline text semantics
    'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark',
    'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u',
    'var', 'wbr',

    // Image and multimedia
    'area', 'audio', 'img', 'map', 'track', 'video',

    // Embedded content
    'embed', 'iframe', 'object', 'param', 'picture', 'portal', 'source',

    // SVG and MathML
    'svg', 'math',
    ].map(v => [v, v]);

let children = els.flatMap(([pstate, pclass, pselector]) =>
    aliases.flatMap(([prefix, newvariants]) =>
        newvariants.map(newvariant => [
            `${newvariant}-${pstate}`,
            `${prefix} ${pclass}`
            ])))

variants.unshift(...children);
// console.log(variants)

export default plugin(({ addVariant }) =>
    variants.forEach(v => addVariant(...v)));

// More complete list of Psuedo
// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
