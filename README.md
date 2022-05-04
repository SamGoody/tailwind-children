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

## Usage: <br> Pre-alpha. This *will* change!

### child variant
Set the styles in the parent and it will apply for all children with matching `child` class.  
Aletrnatively, set the type of child with child-{element type}, and rule will be applied to matching elements. 
*We are working on adding arbitrary classes in the form of `child-['.class']`, At which point we will remove all uncommon child-{element} variants. `child-p` and `child-div` are fine, but `child-video` will need to be changed to child-['video'].*

Aliases: `children` is an alias of `child`, and can be used interchangeably.  

Event Handling:  
Events set *before* the element will be applied to children. See [here](https://tailwindcss.com/docs/hover-focus-and-other-states#ordering-stacked-modifiers).  
*Deprecated*: 
Use `child-*` modifiers like `child-hover` to apply state and psuedo-classes to children elements.

```html
<!-- apply to all children with matching .child class -->
<div class="overflow-hidden child:ring-white hover:child:shadow">
	<p class="child">I have a white ring...</p>
	<p class="child">And a shadow on hover!</p>
</div>

<!-- apply to <p> elements, with shadow on hover -->
<div class="overflow-hidden
		child-p:ring-white hover:child-p:shadow">
	<p>I have a white ring...</p>
	<p>And a shadow on hover!</p>
</div>
```

## Descendant variant
Same usage, but includes non-direct descendants. Can use `descendant` or `heir` aliases

```html
<div class="overflow-hidden
		heir:ring-white hover:heir:shadow">
	<div>
		<p class="heir">I have a white ring...</p>
	</div>
	<div>
		<p class="heir">And a shadow on hover!</p>
	</div>
</div>

<div class="overflow-hidden
		descendant-p:ring-white hover:descendant-p:shadow">
	<div>
		<p>I have a white ring...</p>
	</div>
    <div>
		<p class="
			ring-white hover:shadow
			sibling-p:ring-white hover:sibling-p:shadow">I have a white ring...</p>
		<p>And a shadow on hover!</p>
	</div>
</div>
```

## Sibling variant
Same basic usage, but is applied to first of the repeating elements.
Styles must be applied twice - once for itself and once for siblings with `sibling:` variant. (This has *some* duplication, but has an advantage that the styles are applied directly to the affected element and not to the parent)

```html
<div>
	<p class="
		ring-white hover:shadow
		sibling:ring-white hover:sibling:shadow">I have a white ring...</p>
	<p class="sibling">And a shadow on hover!</p>
</div>

<div>
	<p class="
		ring-white hover:shadow
		sibling-p:ring-white hover:sibling-p:shadow">I have a white ring...</p>
	<p>And a shadow on hover!</p>
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
	<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img0.jpg" alt=""/>
	<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img1.jpg" alt=""/>
	<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img2.jpg" alt=""/>
	<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img3.jpg" alt=""/>
	<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img4.jpg" alt=""/>
</div>
```

## A Proper Solution

Use `heir`, `child`, or `sibling` variants to target the respective elements (see usage above).

```html
<div class="mt-3 flex -space-x-2 overflow-hidden
	child:inline-block child:h-12 child:w-12 child:rounded-full child:ring-2 child:ring-white hover:child:shadow">
	<img class="child" src="/img0.jpg" alt=""/>
	<img class="child" src="/img1.jpg" alt=""/>
	<img class="child" src="/img2.jpg" alt=""/>
	<img class="child" src="/img3.jpg" alt=""/>
	<img class="child" src="/img4.jpg" alt=""/>
</div>
```

Isn't that nice?

### A better solution for sibling (not implemented)

Add class `.siblings` to the first element, and that will set up a rule `.siblings ~ *` to apply the same rules to all of the siblings.

This will make it simple to experiment, easy to understand, is clean and is **DRY**. **FTW**!

```html
<div class="mt-3 flex -space-x-2 overflow-hidden">
    <img class="siblings inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img0.jpg" alt=""/>
    <img src="/img1.jpg" alt=""/>
    <img src="/img2.jpg" alt=""/>
    <img src="/img3.jpg" alt=""/>
    <img src="/img4.jpg" alt=""/>
</div>
```

Even better, we can have `siblings-of-type` to have it only apply said classes to peer elements with same tag.
Admittedly, I do not know of any similar existing TW rule, but maybe it is just a matter of no need.

### A better solution for children (non-standard, not implemented)

Tailwind doesn't use other custom attributes, but I don't see why they shouldn't. CSS can handle any selectors, and we can prefix with tw- if we worry about conflict.

We can therefore create a children attribute with what ought to be applied to the children, and that would readable and DRY.

```html
<div class="mt-3 flex -space-x-2 overflow-hidden"
	children="siblings inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow"
	>
	<img  src="/img0.jpg" alt=""/>
	<img src="/img1.jpg" alt=""/>
	<img src="/img2.jpg" alt=""/>
	<img src="/img3.jpg" alt=""/>
	<img src="/img4.jpg" alt=""/>
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


# Design Decision and Implementation

Like every good project, Tailwind has a consistent style, and we should be consistent with it.  
Here are examples where a TW class effects another element:

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

In each of these examples,
- we have the class on both the "calling" and "receiving" elements,
- psuedo-classes are applied as `variant-*`, eg. `peer-hover`.

Therefore, in the first version of tailwind-children, we used the form `child-hover:shadow` with a dash between child and hover.
- This differs from `child:hover:shadow`, used by [tailwindcss-children]  (and IMO more intuitive)
- It also differs from `hover:child:shadow` used by the official [@tailwindcss/typography] plugin.

To match  [@tailwindcss/typography], you can now use the form hover:child:shadow or hover:child-div:shadow.  
In addittion, you can still use child-hover:shadow, but not when specifying a element type.  

### psuedo-classes (eg. hover)

When declaring a state, we can use the form `hover:child:shadow` with the hover *before* the child.  
*Deprecated:* One can also use the form `child-hover:shadow`. This will be dropped soon.  

### Overriding parent rules.

Rules are applied to all children, descendants and siblings, but can be overridden as follows:

	a. Rules on children have precedence over rules on the parent.
    ```html
	<div class="child:shadow">
        <p>Shadow</p>
        <p class="drop-shadow-none">No Shadow</p>
    </div>
	```

	b. class .not-child which excludes all content.
	```html
    <div class="child:shadow">
        <p>Shadow</p>
        <p class="no-child">No Shadow</p>
    </div>
	```

	c. Limit children via CSS selector. The syntax is `child-['$selector']`. 
	    This is planned but not yet implemented.
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

3. No using a class to copy other classes. Excludes the "better sibling solution" above.
The idea was to set a flag that the styles and events that applied to the first should be applied to all siblings. Eventually, I do hope to implement this, so that it can be ignored by purists.
4. No custom attributes, which excludes the "better children solution" above.
I might eventually implement it, even though it is not a tailwind style rule at all. Feel free to not use.

## Changes from earlier versions.

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

Originally, we used [require-esm-in-cjs] to seetup a simple CJS wrapper around the ES6 module, but this seemed to have [created an issue for Vite users](https://github.com/SamGoody/tailwind-children/issues/1))

Until that can be resolved, am using esbuild (installed globally) to export to CJS for production as follows:
1. `esbuild ./src/index.mjs --outdir=dist --format=cjs`
2. `echo "module.exports = src_default;" >> "./dist/index.js"`

To run tailwind and test visually: 
1. `npx tailwind -o ./tests/test.css -c ./tests/tailwind.config.cjs -i ./tests/input.css`

To run tests in JEST:
1. `npm run test`

The docs for working with variants are not at all together, but here are some useful links:
- [addVariant API conversation](https://github.com/tailwindlabs/tailwindcss/pull/5809)
- [addVariant API commit message](https://github.com/tailwindlabs/tailwindcss/commit/5809c4d07c11808d9ff930fb41c09e37aed4176c)
- [Question about new addVariant API](https://github.com/tailwindlabs/tailwindcss/discussions/6757)
- [Docs: Plugins - addVariant() ](https://tailwindcss.com/docs/plugins#adding-variants)
- [Docs: Writing Plugins](https://tailwindcss.com/docs/adding-custom-styles#writing-plugins)
- [tailwind global plugin function example](https://github.com/tailwindlabs/tailwindcss/discussions/6473#discussioncomment-2007720)
- [tailwind source: createPlugin.js](https://github.com/tailwindlabs/tailwindcss/blob/bab689ca8284265f51d5b66a1f3f1007850d97c1/src/util/createPlugin.js) - is called by wrapper [plugin.js](https://github.com/tailwindlabs/tailwindcss/blob/bab689ca8284265f51d5b66a1f3f1007850d97c1/plugin.js)
- [tailwind source: core plugins](https://github.com/tailwindlabs/tailwindcss/blob/bab689ca8284265f51d5b66a1f3f1007850d97c1/src/corePlugins.js)
- [tailwind source: variants.test.js](https://github.com/tailwindlabs/tailwindcss/blob/master/tests/variants.test.js)
- [tailwind source: all variants](https://github.com/tailwindlabs/tailwindcss/blob/master/tests/variants.test.html)
- [postcss-selector-parser API docs](https://github.com/postcss/postcss-selector-parser/blob/master/API.md)

[tailwindcss-children]: https://github.com/benface/tailwindcss-children
[@tailwindcss/typography]: https://tailwindcss.com/docs/typography-plugin
[tailwind-child]: https://github.com/racha/tailwind-child
