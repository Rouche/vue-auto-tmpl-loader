
const path  = require('path');
const fs = require('fs');
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');

const Mustache = require('mustache');

const loaderName = 'vue-auto-tmpl-loader Loader';

const schema = {
    type: 'object',
    properties: {
        startTag: {
            type: 'string'
        },
        endTag: {
            type: 'string'
        },
    },
    additionalProperties: false
};


const defaultOptions = {
    startTag: '__{{',
    endTag: '}}__',
};

const defaultSections = {

    template: {
        lang: 'html',
        src: `
            <template src="__{{{sections.template.src}}}__">
            </template>`,
        ext: '.vue.html',
    },

    script: {
        lang: 'ts',
        src: `
            <script lang="__{{{sections.script.lang}}}__" src="__{{{sections.script.src}}}__">
            </script>`,
        ext: '.ts',
    },

    style: {
        lang: 'scss',
        src: `
            <style lang="__{{{sections.style.lang}}}__" src="__{{{sections.style.src}}}__">
            </style>`,
        ext: '.scss',
    }

    styleScoped: {
        lang: 'scss',
		tag: 'style',
		attribute: 'scoped',
        src: `
            <style scoped lang="__{{{sections.style.lang}}}__" src="__{{{sections.style.src}}}__">
            </style>`,
        ext: '.scoped.scss',
    }
};

const processSection = (resourcePath, section) => {
    let filePath = Object.assign({}, resourcePath);
    filePath.ext = section.ext;
    filePath.base = undefined;

    let fileName = path.format(filePath);
    let sectionInfo = {
        lang: '',
        src: '',
        fileExists: fs.existsSync(fileName),
    };
    if(sectionInfo.fileExists) {
        sectionInfo.src = './' + filePath.name + filePath.ext;
        sectionInfo.lang = section.lang;
    }

    return sectionInfo;
};

module.exports = function (content) {

    this.cacheable();

    // TODO Can we validate options just once? Like onInit?
    let options = loaderUtils.getOptions(this);
    options = Object.assign({}, defaultOptions, options);
    validateOptions(schema, options, loaderName);

    Mustache.tags = [options.startTag, options.endTag];

    let resourcePath = path.parse(this.resourcePath);

    let mustacheData = {
        path: resourcePath,
        sections: {},
    };

    Object.keys(defaultSections).forEach( (key) => {

        let section = defaultSections[key];

        let sectionInfo = processSection(resourcePath, section);

        if(sectionInfo.fileExists) {
            // TODO extract lang attribute from section if present, to provide customization and use it as extension
			let tag = section.tag || key;
            let regExp = new RegExp('<\\s*' + tag + '([^>]*)>([\\S\\s]*?)<\\s*\\/\\s*' + tag + '>');

			let exec = regExp.exec(content);
			let found = false;
            while(exec !== null) {
                // A file is there but .vue does not contain the <section> for this file. Add the default.
				if(!section.attribute || exec[1].indexOf(section.attribute) != -1) {
					found = true;
					break;
				}
				exec = regExp.exec(content);
            }
			if(!found) {
				content += section.src;
			}
            mustacheData.sections[key] = sectionInfo;
        }
    });

    // Replace src attributes with correct filenames.
    let result = Mustache.render(content, mustacheData);

    return result;
}