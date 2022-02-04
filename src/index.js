import { default as plugin } from 'tailwindcss/plugin'

const aliases = ['children', 'child'];

let variants = [
    ...aliases.map(v => [v, '& > *'])
    ]

export default plugin(({ addVariant }) =>
    variants.forEach(v => addVariant.apply(null, v)));
