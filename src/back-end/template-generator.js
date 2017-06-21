const fs = require("fs");
const path = require("path");

const template = fs.readFileSync(path.resolve(__dirname, "./template.html"), "utf8");

module.exports = (apiUrl, apiToken) => {
    return template.replace(/{{ ?apiUrl ?}}/g, apiUrl).replace(/{{ ?apiToken ?}}/g, apiToken);
};
