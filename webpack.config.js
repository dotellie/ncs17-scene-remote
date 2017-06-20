const path = require("path");

module.exports = {
    entry: "./src/front-end/main.js",
    output: {
        path: path.resolve(__dirname, "out/"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};
