const fs = require("fs");
const path = require("path");

const template = fs.readFileSync(path.resolve(__dirname, "./template.html"), "utf8");

module.exports = apiUrl => {
    return template.replace(/{{ ?apiUrl ?}}/g, apiUrl);
};
