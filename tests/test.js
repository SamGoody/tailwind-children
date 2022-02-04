const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const children = require('../src/index.js');

const cssMatch = require('jest-matcher-css')
expect.extend({ cssMatch })

test('variants', async () => {

    let config = {
        content: [path.resolve(__dirname, './test.html')],
        plugins: [children],
        }

    let input = '@tailwind utilities'

    let result = await postcss(tailwind(config)).process(input, {from: undefined})

    // console.log(result.css, 'result.css')
    let expected = fs.readFileSync(path.resolve(__dirname, './test.css'), 'utf8')
    expect(result.css).cssMatch(expected)
    })
