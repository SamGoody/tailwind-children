const plugin = require('tailwindcss/plugin');

const aliases = ['children', 'child'];

let variants = [
    ...aliases.map(v => [v, '& > *'])
    ]

module.exports = plugin(({ addVariant }) =>
    variants.forEach(v => addVariant.apply(null, v)));
