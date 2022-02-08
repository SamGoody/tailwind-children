import { default as plugin } from 'tailwindcss/plugin'

const aliases = {
    "& > .": ['children', 'child'],
    "& ."  : ['heir', 'descendant'],
    "& ~ .": ['sibling'],
    }

const variants = Object.entries(aliases).
    flatMap(([k, v]) => v.map(i => [i, k + i]));

export default plugin(({ addVariant }) =>
    variants.forEach(v => addVariant.apply(null, v)));
