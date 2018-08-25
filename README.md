# vue-auto-tmpl-loader

Vue.js 2.0 webpack loader for automatic fetching of the files that can be separated from a .vue template if they exists in the same directory.

## install

npm install --save-dev @rouche/vue-auto-tmpl-loader

## Concept

Lets say you want to separate the concern in a .vue template, you always have to put tags in .vue.
```
<script lang="ts" src="./mycomponent.ts">
</script>
```

With this loader. You can leave the .vue with only the template, or even completelly empty.

The only important part is to keep the files along the template with the same name.

```bash
├── mycomponent
│   ├── mycomponent.vue (empty)
│   ├── mycomponent.vue.html
│   ├── mycomponent.ts
│   ├── mycomponent.scss
│   └── mycomponent.scoped.scss
```

## Compatible (and tested) with

- webpack 4
- vue-cli 3
- vue-loader
- vue-template-loader
- typescript
- sass-loader
- etc..

Project with all tests: https://github.com/Rouche/vue-ts-template

It should run with mostly anything since it just modify the loaded file just before passing it to the next loader (vue-loader)

## Webpack Configuration

Add vue-auto-tmpl-loader at 1st position to your webpack configuration.

vue.config.js (vue-cli 3)
```js
config.module
	.rule('vue')
	.use('vue-auto-tmpl-loader')
	.loader('@rouche/vue-auto-tmpl-loader')
	.options({
		debug: true
	})
	.end();
```

## Option Reference

### startTag

- type: `string`
- default: `'__{{'`

### endTag

- type: `string`
- default: `'}}__'`

Mustache is used to replace the `src` in section. ex: `<script lang="xx" src="__{{{mustacheData.prop}}}__"></section>`
It is the only template engine that you can customize tags so it does not interfere with vuejs `{{prop}}` that need to be in your final template untouched.

mustacheData is the object used for `render()`
```
    let mustacheData = {
        path: (This is a path.parse(resourcePath) of original .vue file)
        sections: {
		(Information for each sections, check in code for easy understanding)
	}, 
    };
```

TL;DR
The main use, is to stop having to type those same lines of codes over and over again in .vue files. (or ts files) Like those:
```
<template src="template.html">
</template>

<script lang="ts" src="component.ts">
</script>

<style scoped lang="scss" src="style.scss">
</style>
```
or
```
import WithRender from './helloworld.html?style=./helloworld.scss';

/**
 * Example for vue-template-loader
 */
@WithRender
@Component
bla bla
```

Just put your files in the same directory of your .vue and thats it!
`@WithRender` is nice https://github.com/ktsn/vue-template-loader
But you still need to repeat imports in your code. And its prone to copy paste.

## License

ISC
