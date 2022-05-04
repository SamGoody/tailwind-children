import { default as plugin } from 'tailwindcss/plugin.js'

const aliases = Object.entries({
    ":where(&) > ": ['children', 'child'],
    ":where(&)   ": ['heir', 'descendant'],
    ":where(&) ~ ": ['sibling', 'twin'],
    })

let variants = aliases
    .flatMap(([k, v]) => v.map(i => [i, `${k} :where(:not(.not-${i}))`]));

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
            `${prefix} ${pclass}:where(:not(.not-${newvariant}-${pstate}))`
            ])))

variants.unshift(...children);
// console.log(variants)

export default plugin(({ addVariant }) =>
    variants.forEach(v => addVariant(...v)));

// More complete list of Psuedo
// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
