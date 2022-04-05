# Tailwind-children <div style='font-size:0.6em'>Repeat elements without repeating styles<br> *.child, .sibling, and .descendant* variants for [TailwindCSS v3+](https://tailwindcss.com).</div>

# Installation

1. Install package:
		npm install tailwind-children --save

2. Add to tailwind.config.js

		plugins: [
			require('tailwind-children'),
			]
3. Build tailwind:
		npx tailwindcss -i ./src/input.css -o ./dist/output.css

# Usage: <div style='font-size:12px'>Pre-alpha. This <i>will</i> change!</div>

### child variant
Set the styles in the parent and it will apply for all children with matching `child` class.
Can use `children` or `child` aliases.
Use `child-*` modifiers like `child-hover` to apply state and psuedo-classes to children elements:

	<div class="overflow-hidden
			child:ring-white child-hover:shadow">
		<p class="child">I have a white ring...</p>
		<p class="child">And a shadow on hover!</p>
	</div>

### descendant variant
Same usage, but includes non-direct descendants. Can use `descendant` or `heir` aliases

	<div class="overflow-hidden
			heir:ring-white heir-hover:shadow">
		<div>
			<p class="heir">I have a white ring...</p>
		</div>
		<div>
			<p class="heir">And a shadow on hover!</p>
		</div>
	</div>

### sibling variant
Same basic usage, but is applied to first of the repeating elements.
Styles must be applied twice - once for itself and once for siblings with `sibling:` variant. (This has *some* duplication, but has an advantage that the styles are applied directly to the affected element and not to the parent.)

	<div>
			<p class="
				ring-white hover:shadow
				sibling:ring-white sibling-hover:shadow">I have a white ring...</p>
			<p class="sibling">And a shadow on hover!</p>
	</div>

# Rationale

TailwindCSS is a GREAT utility-first CSS framework. Instead of inline styles (`<p style='display:block'>`) or opinionated predefined classes (`<button class='btn'>`) you have classes that replace and enhance the inline styles (`<p class='block'>`).

Its biggest issue is that it is (to quote them) "ugly". Your page gets littered with hundreds or thousands of classes.
That ugliness is justified though, and once you start using TW you will never go back.

But there is one case where the ugliness is not just extreme, it also slows dev, adds complexity and introduces errors. It is such an issue, that it is referred to again and again in the official docs, [has a page to itself](https://tailwindcss.com/docs/reusing-styles) - and the suggested solutions are pretty poor; use an editor plugin or rely on JS.

The issue is that of repeating elements (such as `<li>'s`) that use the same styles.
And its an issue which is surprising, as Tailwind's class based nature should make it really easy to fix.

This, then, is an attempt to solve the issue of reusing styles through a plugin, and maybe @adam will see this and make it official :)

### The Issue

To copy the example loosely from https://tailwindcss.com/docs/reusing-styles.
Let's say you want to experiment with adding a shadow to all your `<img>s`.
Manually copying it in each one is slowly and buggy. What to do?

	<div class="mt-3 flex -space-x-2 overflow-hidden">
		<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img0.jpg" alt=""/>
		<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img1.jpg" alt=""/>
		<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img2.jpg" alt=""/>
		<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img3.jpg" alt=""/>
		<img class="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow" src="/img4.jpg" alt=""/>
	</div>

### A Proper Solution

Use `heir`, `child`, or `sibling` variants to target the respective elements (see usage above).

	<div class="mt-3 flex -space-x-2 overflow-hidden
		child:inline-block child:h-12 child:w-12 child:rounded-full child:ring-2 child:ring-white child-hover:shadow">
		<img class="child" src="/img0.jpg" alt=""/>
		<img class="child" src="/img1.jpg" alt=""/>
		<img class="child" src="/img2.jpg" alt=""/>
		<img class="child" src="/img3.jpg" alt=""/>
		<img class="child" src="/img4.jpg" alt=""/>
	</div>

Isn't that nice?

### Perhaps, a better solution for sibling (not implemented)

Add class `.siblings` to the first element, and that will set up a rule `.siblings ~ *` to apply the same rules to all of the siblings.

This will make it simple to experiment, easy to understand, is clean and is DRY. FTW!
```
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

### Perhaps, a better solution for children (non-standard, not implemented)

Tailwind doesn't use other custom attributes, but I don't see why they shouldn't. CSS can handle any selectors, and we can prefix with tw- if we worry about conflict.

We can therefore create a children attribute with what ought to be applied to the children, and that would readable and DRY.

	<div class="mt-3 flex -space-x-2 overflow-hidden"
		children="siblings inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow"
		>
		<img  src="/img0.jpg" alt=""/>
		<img src="/img1.jpg" alt=""/>
		<img src="/img2.jpg" alt=""/>
		<img src="/img3.jpg" alt=""/>
		<img src="/img4.jpg" alt=""/>
	</div>

This would make a rather awkward css rule, but not one that affects the dev or the user:
    `[children="siblings inline-block h-12 w-12 rounded-full ring-2 ring-white hover:shadow"] > * { ... } `

To be sure, I think that Tailwind should offer this for all psuedo-classes:

	<div class="block"
		tw-after="content-['wow'] text-white">...
	</div>

And it is my hope that this plugin might be a foray into such usage!


# Design Decision and Implementation

Like every good project, Tailwind has a consistent style, and we should be consistent with it.
Here are examples where a TW class effects another element:

	<body class="dark">
		<p class="dark:shadow">p has shadow when dark theme enabled</p>
	</body>

	<input class="peer">
	<p class="peer-hover:shadow">p has shadow when hovering on input</p>

	<div class="group">
		<p class="group-hover:shadow">p has shadow when hovering over div</p>
	</div>

In each of these examples,
- we have the class on both the "calling" and "receiving" elements,
- psuedo-classes are applied as `variant-*`, eg. `peer-hover`.

Let's see how that works out for us:

1. When declaring a state, we use the form `child-hover:shadow` with a dash between child and hover.
    - This differs from `child:hover:shadow`, used by [tailwindcss-children]  (and IMO more intuitive)
    - It also differs from `hover:child:shadow` used by the official [@tailwindcss/typography] plugin.
2. The rules only apply to children that have the matching 'child/sibling/etc' class.
To demonstrate, if wanted only one of two children to match, here are several options.
     a. Require elements to "opt-in" with a "child" class
    ```
	<div class="child:shadow">
		<p class="child">Shadow</p>
		<p>No Shadow</p>
	</div>
	```
	b. Apply style to all children, and allow children to override rules as needed.
    ```
	<div class="child:shadow">
        <p>Shadow</p>
        <p class="drop-shadow-none">No Shadow</p>
    </div>
	```
    b. Offer a no-child class that tells it to not inherit
	```
    <div class="child:shadow">
        <p>Shadow</p>
        <p class="no-child">No Shadow</p>
    </div>
	```
    c. Only apply inheritance to element whose type is passed in. (Either `child-span` or `child-['span']`)
    ```
	<div class="child-span:shadow">
        <span>Shadow</span>
        <p>No Shadow</p>
    </div>
	```
	[tailwind-child] uses method c, and [@tailwindcss/typography] supports methods b, c and d.
	In this version, we are still trying to be close-minded tw style, but will probably eventually switch to mimic typography.
3. No using a class to copy other classes. Excludes the "better sibling solution" above.
The idea was to set a flag that the styles and events that applied to the first should be applied to all siblings. Eventually, I do hope to implement this, so that it can be ignored by purists.
4. No custom attributes, which excludes the "better children solution" above.
I might eventually implement it, even though it is not a tailwind style rule at all. Feel free to not use.

# Contributing

Please open issues, file bug reports, give me your opinions on variant names, default styles and behaviors, and whatever else you can think of. There are a lot of good things input can add!

[tailwindcss-children]: https://github.com/benface/tailwindcss-children
[@tailwindcss/typography]: https://tailwindcss.com/docs/typography-plugin
[tailwind-child]: https://github.com/racha/tailwind-child
