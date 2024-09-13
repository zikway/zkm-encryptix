const { removeDtsFolder, createTemplateIndex, createTemplatePackage } = require('./after-build');
const cfg = require('../config');

removeDtsFolder();
createTemplateIndex(cfg)
createTemplatePackage(cfg)
