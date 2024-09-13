const pkg = require('../package.json')
const fs = require('fs')
const path = require('path')
function formatPackageJson(cfg) {
    const { name, scripts, devDependencies, ...rest } = pkg
    const { postinstall } = scripts
    const nPkg = {
        name: cfg.packname,
        main: `${cfg.filePrefix}.cjs.js`,
        module: `${cfg.filePrefix}.esm.js`,
        ...rest,
        files: ["*"],
        types: "index.d.ts",
        typesVersions: {
            "*": {
                "*": [
                    "index.d.ts"
                ]
            }
        },
        scripts: {
            postinstall
        }
    }
    fs.writeFileSync(path.resolve(__dirname, "..", `${cfg.output}/package.json`), JSON.stringify(nPkg, null, 2))
}
module.exports = {
    createTemplatePackage: formatPackageJson
}