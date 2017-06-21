const serverIp = "10.0.0.168";
const port = "53000";

const express = require("express");
const osc = require("node-osc");
const path = require("path");
const app = express();
const client = new osc.Client(serverIp, port);
const templateGenerator = require("./template-generator");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

// Generated tooken
const acceptedToken = [3283];

// Out dir configuration
app.use("/static", express.static(path.resolve(__dirname, "../../out")));

// Setup express to use cookie parser middleware.
app.use(cookieParser());

// Setup Body Parser middleware
app.use(bodyParser.json());
// app.use(bodyParser());

// Setup Cors middleware
app.use(cors());

// Endroutes
app.get("/", (req, res) => {
    console.log("hello World");
    if (req.cookies.Tooken) {
        if (validateCookie(req.cookies.Tooken)) {
            res.send(templateGenerator(`http://${serverIp}/`, req.cookies.Tooken));
        }
    } else {
        // Regen tooken
        const token = Math.floor(1000 + Math.random() * 9000);
        res.send(templateGenerator(`http://${serverIp}/`, token));
        console.log(token);
    }
});

app.post("/api/validate", (req, res) => {
    console.log(req.body);
    if (validateCookie(req.body.token)) {
        res.status(200).send({status: "ok"});
    } else {
        res.status(200).send({status: "No access"});
    }
});

// ####################
//  API OSC Endroutes
// ####################

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
    res.send("Pausing running ques");
    client.send("/Previous");
    client.send("/Pause-Resume");
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
    for (let i = 0; i < acceptedToken.length; i++) {
        if (parseInt(cookie) === acceptedToken[i]) {
            return true;
        }
    }
};
