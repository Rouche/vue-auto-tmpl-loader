# vue-auto-tmpl-loader

Vue.js 2.0 webpack loader for automatic fetching of the files that can be separated from a .vue template if they exists in the same directory.

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

Project with all tests: https://github.com/Rouche/vue-ts-template

## Webpack Configuration

Add vue-auto-tmpl-loader at 1st position to your webpack configuration.

vue.config.js (vue-cli 3)
```js
module.exports = {

    chainWebpack: (config) => {
		config.module
			.rule('vue')
			.use('vue-pre-loader')
			.loader('vue-pre-loader')
			.options({
				....
			})			
			.end();
	}
};
```

### Options

TODO

## License

ISC