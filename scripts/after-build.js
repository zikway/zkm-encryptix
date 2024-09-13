const fs = require('fs');
const path = require('path');
const { createTemplatePackage } = require('./handle-package-file');
const { createTemplateIndex } = require('./handle-index');

function removeDtsFolder() {
    const folderPath = path.join(__dirname, '..', 'dist', 'types');
    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true });
    }
}
module.exports = {
    removeDtsFolder,
    createTemplatePackage,
    createTemplateIndex
};