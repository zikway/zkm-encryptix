const ejs = require('ejs')
const fs = require('fs');
const path = require('path');

function formatIndex(cfg) {
    const indexTemplate = fs.readFileSync(path.resolve(__dirname, '..', 'template/index.ejs'), 'utf-8');
    const code = ejs.render(indexTemplate.toString(), {
        files: {
            preffix: cfg.filePrefix,
            output: cfg.output,
        }
    })
    fs.writeFileSync(path.resolve(__dirname, "..", `${cfg.output}/index.js`), code)
}
module.exports = {
    createTemplateIndex: formatIndex
}