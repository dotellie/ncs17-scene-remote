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
const UserManager = require("./user-manager.js");
const menu = require("./menu.js");

const validate = (req, res) => {
    return new Promise((resolve, reject) => {
        const user = UserManager.getValidUser(req.cookies.token, req.ip);

        if (user) {
            res.status(200);
            resolve(user);
        } else {
            res.status(401).send({ status: "Access denied" });
            reject();
        }
    });
};

// Out dir configuration
app.use("/static", express.static(path.resolve(__dirname, "../../out")));

// Setup express to use cookie parser middleware.
app.use(cookieParser());

// Setup Body Parser middleware
app.use(bodyParser.json());

// Setup Cors middleware
app.use(cors());

// Endroutes
app.get("/", (req, res) => {
    const apiUrl = `${serverIp}:3000`;
    if (req.cookies.token && UserManager.getValidUser(req.cookies.token, req.ip)) {
        res.send(templateGenerator(apiUrl, req.cookies.token));
    } else {
        res.send(templateGenerator(apiUrl, UserManager.generateUser(req.ip).token));
    }
});

app.post("/api/validate", (req, res) => {
    validate(req, res).then(() => {
        res.send({ status: "ok" });
    });
});

// ####################
//  API OSC Endroutes
// ####################

// Play Next
app.post("/api/next", (req, res) => {
    // if (validateCookie(req.cookies.Tooken)) {
    client.send("/Next");
    res.send({});
    // } else {
    //     res.status(401).send("401 Unathorized access");
    // }
});

// Playhead Previous:
app.post("/api/previous", (req, res) => {
    // if (validateCookie(req.cookies.Tooken)) {
    res.send({});
    client.send("/Previous");
    client.send("/Stop");
    // client.send("/Next");
    // } else {
    //    res.status(401).send("401 Unathorized access");
    // }
});

// Pause
app.post("/api/pause", (req, res) => {
    res.send({});
    client.send("/Previous");
    client.send("/Pause-Resume");
});

// Resume
app.post("/api/resume", (req, res) => {
    res.send({});
    // client.send("/Previous");
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
    // console.log("App is running on: http://localhost:3000");
});

menu.show();
