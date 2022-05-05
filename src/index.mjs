import { default as plugin } from 'tailwindcss/plugin.js'

const alias_list = Object.entries({
    ">": ['children', 'child'],
    " ": ['heir', 'descendant'],
    "~": ['sibling', 'twin'],
    })

// list of elements from https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const elements = [
    // general selector
    '',

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
    ];

let variants = elements.flatMap((element) =>
    alias_list.flatMap(([selector, aliases]) =>
        aliases.map(alias => {
            // eg. element == 'div', selector == ':where(&) >' alias == 'child'
            
            const variant = alias + (element ? `-${element}` : '');
            const base = `:where(&) ${selector} ${element}:where(:not(.not-${variant}))`;
            const added = {
                '~': `:where(&:not(.not-${variant}))`,
                ' ': `:where(&) ${selector} :where(:not(.not-${variant})) ${element}`
                }[selector];
                
            return [variant, added ? [base, added] : base];
            })))

// console.log(variants)

export default plugin(({ addVariant }) =>
    variants.forEach(v => addVariant(...v)));

