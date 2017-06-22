const osc = require("node-osc");

module.exports = class QlabClient {
    constructor(ip, port) {
        this.client = new osc.Client(ip, port);
        this.server = new osc.Server(53001);
        this.listeners = [];

        this.server.on("message", (msg, rinfo) => {
            const json = JSON.parse(msg[1]);
            this.listeners.some(([query, listener], i) => {
                if (`/reply${query}` === msg[0]) {
                    listener(json);
                    this.listeners.splice(i, 1);
                    return true;
                }
            });
        });
    }

    send(query) {
        this.client.send(query);
    }

    query(query) {
        return new Promise((resolve, reject) => {
            this.listeners.push([query, res => {
                resolve(res);
            }]);
            this.send(query);
        });
    }

    setCurrentWorkspace(id) {
        this.workspaceId = id;
    }

    next() {
        this.send("/Next");
    }

    async stop(cueNumber) {
        cueNumber = cueNumber || await this._getDefaultNumber();
        this.send(`/cue/${cueNumber}/stop`);
    }

    pauseResume() {
        this.send("/Pause-Resume");
    }

    playheadNext() {
        this.send(`/workspace/${this.workspaceId}/playhead/next`);
    }

    playheadPrevious() {
        this.send(`/workspace/${this.workspaceId}/playhead/previous`);
    }

    async isRunning(cueNumber) {
        cueNumber = cueNumber || await this._getDefaultNumber();
        console.log(cueNumber);
        return (await this.query(`/cue/${cueNumber}/isRunning`)).data;
    }

    async getSelectedQues() {
        return await this.query(`/workspace/${this.workspaceId}/selectedCues`);
    }

    async getCueListOrder() {
        const res = await this.query(`/workspace/${this.workspaceId}/cueLists`);
        const cues = await res.data.find(t => t.type === "Cue List" && t.armed).cues;
        return cues.map(c => parseInt(c.number));
    }

    async _getDefaultNumber() {
        return (await this.getSelectedQues()).data[0].number;
    }
};
