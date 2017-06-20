// TODO:

// Initiate Express.
// Setup all OSC api Pathes.
//  -Pathes:
//      - Play Next.
//      - Previous Playhead
//      - Pause
//      - Start
//
const serverIp = "10.0.0.168";
const port = "53000";

const express = require("express");
const osc = require("node-osc");
const path = require("path");
const app = express();
const client = new osc.Client(serverIp, port);
const templateGenerator = require("./template-generator");

// Endroutes
app.get("/", (req, res) => {
    res.send(templateGenerator(`http://${serverIp}/`));
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
    console.log("App is running on: http://localhost:3000");
});
