# Tailwind-children 

Repeat elements without repeating styles
	`*.child`, `.sibling`, and `.descendant*` variants for [TailwindCSS v3+](https://tailwindcss.com)

------

# Installation

1. Install package:
```sh
npm install tailwind-children --save
```

2. Add to tailwind.config.js
```js		
plugins: [
	require('tailwind-children'),
	]
```

3. Build tailwind:
```
npx tailwindcss -i ./src/input.css -o ./dist/output.css
```

## Usage: (beta - this *will* change!)


### Child variant
Styles in parent prefixed with `child` will apply to all children.  
Aliases: `children` can be used instead of `child`.  

```html
<!-- apply to all children with matching .child class -->
<div class="overflow-hidden child:ring-white">
	<p>I have a white ring...</p>
</div>
```

##### Rules can be limited or overridden, see below. 
##### Modifiers & Psuedo-classes (eg. :hover, :after)    

[Modifiers](https://tailwindcss.com/docs/hover-focus-and-other-states) such as :hover can be applied to children, but should be placed [*before*](https://tailwindcss.com/docs/hover-focus-and-other-states#ordering-stacked-modifiers) `child`.
```
<!-- apply to <p> elements, with shadow on hover -->
<div class="overflow-hidden
		child-p:ring-white hover:child-p:shadow">
	<p>I have a white ring and shadow.</p>
	<b>I am ignored!</b>
</div>
```

## Descendant variant
Same usage, but includes non-direct descendants.  
Aliases: `descendant` or `heir`.

```html
<div class="heir:ring-white descendant:heir:shadow">
	<div>
		<p>I have a white ring...</p>
	</div>
	<div>
		<p>And a shadow on hover!</p>
		<b>I am not a `p`, so am ignored.</b>
	</div>
</div>
```

## Sibling variant
Same basic usage, but is applied to first of the repeating elements.
For now, styles must be applied twice - once for itself and once with `sibling:` variant,  for siblings. (This has *some* duplication, but has an advantage that the styles are applied directly to the affected element and not to the parent). In the future, rules will be applied to both automatically to self and siblings.
Aliases: `twin`, `sibling`

```html
<div>
	<p class="
		ring-white hover:shadow
		sibling:ring-white hover:sibling:shadow">I have a white ring...</p>
	<p class="sibling">And a shadow on hover!</p>
</div>
```

# Rationale

TailwindCSS is a GREAT utility-first CSS framework. Instead of inline styles (`<p style='display:block'>`) or opinionated predefined classes (`<button class='btn'>`) you have classes that replace and enhance the inline styles (`<p class='block'>`).

Its biggest issue is that it is (to quote them) "ugly". Your page gets littered with hundreds or thousands of classes.
That ugliness is justified though, and once you start using TW you will never go back.

But there is one case where the ugliness is not just extreme, it also slows dev, adds complexity and introduces errors. It is such an issue, that it is referred to again and again in the official docs, [has a page to itself](https://tailwindcss.com/docs/reusing-styles) - and the suggested solutions are pretty poor; use an editor plugin or rely on JS.

The issue is that of repeating elements (such as `<li>'s`) that use the same styles.
And its an issue which is surprising, as Tailwind's class based nature should make it really easy to fix.

This, then, is an attempt to solve the issue of reusing styles through a plugin, and maybe @adam will see this and make it official :)

## The Issue

To copy the example loosely from https://tailwindcss.com/docs/reusing-styles.
Let's say you want to experiment with adding a shadow to all your `<img>`s.
Manually copying it in each one is slowly and buggy. What to do?

```html
<div class="mt-3 flex -space-x-2 overflow-hidden">
	<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img0.jpg">
	<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img1.jpg">
	<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img2.jpg">
	<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img3.jpg">
	<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img4.jpg">
</div>
```

## A Proper Solution

Use `heir`, `child`, or `sibling` variants to target the respective elements (see usage above).

```html
<div class="mt-3 flex -space-x-2 overflow-hidden
	child:inline-block child:h-12 child:w-12 child:rounded-full child:ring-2 child:ring-white hover:child:shadow">
	<img src="/img0.jpg">
	<img src="/img1.jpg">
	<img src="/img2.jpg">
	<img src="/img3.jpg">
	<img src="/img4.jpg">
</div>
```

Isn't that nice?

## Overriding rules.

Rules are applied to all children, descendants and siblings, but can be overridden or limited:

	a. Rules on children have precedence over rules on the parent.
    ```html
	<div class="child:shadow">
        <p>Shadow</p>
        <p class="drop-shadow-none">No Shadow</p>
    </div>
	```

	b. class .not-child{-element} excludes element.
	```html
    <div class="child:shadow">
        <p>Shadow</p>
        <p class="no-child">No Shadow</p>
    </div>
	```

	c. Limit children via CSS selector. The syntax is `child-['$selector']`. 
	    Not yet implemented.
    ```html
	<div class="child-['.child']:shadow">
	    <p class="child">Shadow</p>
	    <p>No Shadow</p>
	</div>
	```

	d. Limit children via tag, with syntax `child-$tag`; Shorthand for `child-['$tag']`. 
	    [ Until arbitrary css is available, one can use any element tag. This will later be reduced to common tags (a, b, i, p, u, div, span, ul, ol, li). ]
	```html
    <div class="child-p:shadow">
        <p>Shadow</p>
        <a>No Shadow</a>
    </div>
	```

# Other thoughts

### Non-standard idea - a better solution for sibling (not implemented)

Add class `.siblings` to the first element, and that will set up a rule `.siblings ~ *` to apply the same rules to all of the siblings.

This will make it simple to experiment, easy to understand, is clean and is **DRY**. **FTW**!

```html
<div class="mt-3 flex -space-x-2 overflow-hidden">
    <img class="siblings inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img0.jpg"/>
    <img src="/img1.jpg"/>
    <img src="/img2.jpg"/>
    <img src="/img3.jpg"/>
    <img src="/img4.jpg"/>
</div>
```

Even better, we can have `siblings-of-type` to have it only apply said classes to peer elements with same tag.
Admittedly, I do not know of any similar existing TW rule, but maybe it is just a matter of no need.

### Non-standard idea - a better solution for children (not implemented)

Tailwind doesn't use other custom attributes, but I don't see why they shouldn't. CSS can handle any selectors, and we can prefix with tw- if we worry about conflict.

We can therefore create a children attribute with what ought to be applied to the children, and that would readable and DRY.

```html
<div class="mt-3 flex -space-x-2 overflow-hidden"
	children="siblings inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow">
	<img  src="/img0.jpg"/>
	<img src="/img1.jpg"/>
	<img src="/img2.jpg"/>
	<img src="/img3.jpg"/>
	<img src="/img4.jpg"/>
</div>
```

This would make a rather awkward css rule, but not one that affects the dev or the user:
    `[children="siblings inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow"] > * { ... } `

To be sure, I think that Tailwind should offer this for all psuedo-classes:

```html
<div class="block"
	tw-after="content-['wow'] text-white">...
</div>
```

And it is my hope that this plugin might be a foray into such usage!

## Changes from earlier versions.

#### Psuedo-classes, psuedo-elements, and state  (eg. `:hover`, `::after`, `[open]`) 

[Modifiers such as :hover](https://tailwindcss.com/docs/hover-focus-and-other-states) must be set *first* (eg. hover:child:shadow) for it [to be applied to the children](https://tailwindcss.com/docs/hover-focus-and-other-states#ordering-stacked-modifiers).

In earlier versions, we created custom variants for all modifiers, so that you can use the form `child-hover`, which is easier to read, and matches group and peer:

```html
<input class="peer">
<p class="peer-hover:shadow">p has shadow when hovering on input</p>

<div class="group">
    <p class="group-hover:shadow">p has shadow when hovering over div</p>
</div>
```

However, this was removed as:
1. It is unnecessary: unlike group whose hover affect another element, and needs a special variant.
2. It is unclear: child-p (a limitation) and child-hover (a psuedo class) would use the same format.
2. It doesn't match: the official typography plugin
3. we were missing states, and :hover:child is more complete. 

#### Matching selector on child

Earlier versions limitted matching children to those havng a class `.child`.  
Basically opt-in to have a style applied.

This matched the styles in peer, group, theme, etc.

```html
<body class="dark">
    <p class="dark:shadow">p has shadow when dark theme enabled</p>
</body>

<input class="peer">
<p class="peer-hover:shadow">p has shadow when hovering on input</p>

<div class="group">
    <p class="group-hover:shadow">p has shadow when hovering over div</p>
</div>
```

However, we now offer much more flexibility with limitations and overrides, and the old sytax was usually not the desired one, so we dropped it.  Besides, this matches typography. :)


# Contributing

Please open issues, file bug reports, give me your opinions on variant names, default styles and behaviors, and whatever else you can think of. There are a lot of good things input can add!

tailwind-children is a ES6 module that is backported to CommonJS for use with taiwindcss (which is in CommonJS format).

Originally, we used [require-esm-in-cjs](https://www.npmjs.com/package/require-esm-in-cjs) to setup a simple CJS wrapper around the ES6 module, but this seemed to have [created an issue for Vite users](https://github.com/SamGoody/tailwind-children/issues/1)

Until that can be resolved, am using esbuild (installed globally) to export to CJS for production as follows:
1. `esbuild ./src/index.mjs --outdir=dist --format=cjs`
2. `echo "module.exports = src_default;" >> "./dist/index.js"`

To run tailwind and test visually: 
1. `npx tailwind -o ./tests/test.css -c ./tests/tailwind.config.cjs -i ./tests/input.css`

To run tests in JEST:
1. `npm run test`

The docs for working with variants are not at all together, but here are some useful links:
- addVariant API: [conversation](https://github.com/tailwindlabs/tailwindcss/pull/5809), [commit message](https://github.com/tailwindlabs/tailwindcss/commit/5809c4d07c11808d9ff930fb41c09e37aed4176c), [discussion](https://github.com/tailwindlabs/tailwindcss/discussions/6757)
- Official Docs: [Plugins - addVariant()](https://tailwindcss.com/docs/plugins#adding-variants), [Writing Plugins](https://tailwindcss.com/docs/adding-custom-styles#writing-plugins)
- tailwindcss source: [createPlugin.js](https://github.com/tailwindlabs/tailwindcss/blob/bab689ca8284265f51d5b66a1f3f1007850d97c1/src/util/createPlugin.js) - is called by wrapper [plugin.js](https://github.com/tailwindlabs/tailwindcss/blob/bab689ca8284265f51d5b66a1f3f1007850d97c1/plugin.js), [corePlugins.js](https://github.com/tailwindlabs/tailwindcss/blob/bab689ca8284265f51d5b66a1f3f1007850d97c1/src/corePlugins.js), [variants.test.js](https://github.com/tailwindlabs/tailwindcss/blob/master/tests/variants.test.js), [list of variants](https://github.com/tailwindlabs/tailwindcss/blob/master/tests/variants.test.html)
- [postcss-selector-parser API docs](https://github.com/postcss/postcss-selector-parser/blob/master/API.md)

[tailwindcss-children]: https://github.com/benface/tailwindcss-children
[@tailwindcss/typography]: https://tailwindcss.com/docs/typography-plugin
[tailwind-child]: https://github.com/racha/tailwind-child