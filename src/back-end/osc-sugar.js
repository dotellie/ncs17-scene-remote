const serverIp = "10.0.0.168";
const port = "53000";

const osc = require("node-osc");
const server = new osc.Server(53001, "0.0.0.0");
const client = new osc.Client(serverIp, port);
const listeners = [];

server.on("message", (msg, rinfo) => {
    const json = JSON.parse(msg[1]);
    listeners.some(([query, listener], i) => {
        if (`/reply${query}` === msg[0]) {
            listener(json);
            listeners.splice(i, 1);
            return true;
        }
    });
});

module.exports = query => {
    return new Promise((resolve, reject) => {
        listeners.push([query, res => {
            resolve(res);
        }]);
        client.send(query);
    });
};
