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
const path = require("path");
const app = express();
const client = new osc.Client(serverIp, port);

// Endroutes
app.get("/", (req, res) => {

});

app.use("/static", express.static(path.resolve(__dirname, "../../out")));

// ###############
//  API Endroutes
// ###############

// Play Next
app.get("/api/next", (req, res) => {
    res.send("Sending next osc call to Qlab");
    client.send("/Next");
});

// Playhead Previous:
app.get("/api/previous", (req, res) => {
    client.send("/Previous");
});

// Pause
app.get("/api/pause", (req, res) => {
    client.send("/Pause-Resume");
});

// Resume
app.get("/api/resume", (req, res) => {
    client.send("/Pause-Resume");
});

// ===========

// Start listening for requests.
app.listen(3000, () => {
    console.log("App is running");
});
