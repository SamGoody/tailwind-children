import { default as plugin } from 'tailwindcss/plugin'

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

// console.log(variants)

export default plugin(({ addVariant }) =>
    variants.forEach(v => addVariant(...v)));

// More complete list of Psuedo
// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
