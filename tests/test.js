import { readFileSync } from 'fs';
import { resolve } from 'path';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import children from '../src/index.mjs';

import cssMatch from 'jest-matcher-css';
expect.extend({ cssMatch })

test('variants', async () => {

    let config = {
        plugins: [children],
        content: [resolve('./tests/test.html')],
        }

    let input = '@tailwind utilities'

    let result = await postcss(tailwind(config)).process(input, {from: undefined})

    // console.log(result.css, 'result.css')
    let expected = readFileSync(resolve('./tests/test.css'), 'utf8')
    expect(result.css).cssMatch(expected)
    })
