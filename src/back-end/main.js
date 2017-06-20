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
const app = express();
const client = new osc.Client(serverIp, port);

// Endroutes
app.get("/", (req, res) => {

});

// ###############
//  API Endroutes
// ###############

// Play Next
app.get("/api/next", (req, res) => {
    res.send("Sending next osc call to Qlab");
    client.send("/GO");
});

// Playhead Previous:
app.get("/api/previous", (req, res) => {

});

// Pause
app.get("/api/pause", (req, res) => {

});

// Resume
app.get("/api/resume", (req, res) => {

});

// ===========

// Start listening for requests.
app.listen(3000, () => {
    console.log("App is running");
});
