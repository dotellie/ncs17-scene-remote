const serverIp = "10.0.0.168";
const port = "53000";

const express = require("express");
const osc = require("node-osc");
const path = require("path");
const app = express();
const client = new osc.Client(serverIp, port);
const templateGenerator = require("./template-generator");
const cookieParser = require("cookie-parser");

// Generated tooken
const tooken = Math.floor(1000 + Math.random() * 9000);
const acceptedTooken = 3283;

// Out dir configuration
app.use("/static", express.static(path.resolve(__dirname, "../../out")));

// Setup express to use cookie parser middlewear.
app.use(cookieParser());

// Endroutes
app.get("/", (req, res) => {
    if (req.cookies.Tooken) {
        console.log();
    } else {
        res.cookie("Tooken", tooken);
    }

    res.send(templateGenerator(`http://${serverIp}/`));
});

// ###############
//  API Endroutes
// ###############

// Play Next
app.get("/api/next", (req, res) => {
    if (validateCookie(req.cookies.Tooken)) {
        client.send("/Next");
        res.send("Playing next in que");
    } else {
        res.status(401).send("401 Unathorized access");
    }
});

// Playhead Previous:
app.get("/api/previous", (req, res) => {
    if (validateCookie(req.cookies.Tooken)) {
        res.send("Playing previous que");
        client.send("/Previous");
    } else {
        res.status(401).send("401 Unathorized access");
    }
});

// Pause
app.get("/api/pause", (req, res) => {
    // res.send("Pausing running ques");
    // client.send("/Previous");
    // client.send("/Pause-Resume");
    if (!validateCookie(req.cookies.Tooken)) {
        req.end();
    }
});

// Resume
app.get("/api/resume", (req, res) => {
    res.send("Resuming paused ques");
    client.send("/Pause-Resume");
});

// ===========

// Recive answers from Qlab.
const server = new osc.Server(53001, "0.0.0.0");
server.on("message", (msg, rinfo) => {
    console.log(msg);
});

// Start listening for requests.
app.listen(3000, () => {
    console.log("App is running on: http://localhost:3000");
});

// Functions

let validateCookie = (cookie) => {
    return (parseInt(cookie) === acceptedTooken);
};
