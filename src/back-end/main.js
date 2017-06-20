// TODO:

// Initiate Express.
// Setup all OSC api Pathes.
//  -Pathes:
//      - Play Next.
//      - Previous Playhead
//      - Pause
//      - Start
//
const serverIp = "localhost";
const port = "53000";

const express = require("express");
const osc = require("node-osc");
const app = express.app();
const client = new osc.client(serverIp, port);

app.listen(3000, () => {
    console.log("App is running");
});
