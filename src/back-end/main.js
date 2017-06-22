const serverIp = "192.168.1.23";
const qlabIp = "192.168.1.7";
const port = "53000";
const qlabWorkspaceId = "42C4DDC1-7E11-4215-BF4F-72E3DB17EC97";

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const QlabClient = require("./qlab-client.js");
const qlab = new QlabClient(qlabIp, port);
const templateGenerator = require("./template-generator.js");
const UserManager = require("./user-manager.js");
const menu = require("./menu.js");

qlab.setCurrentWorkspace(qlabWorkspaceId);

const validate = (req, res) => {
    return new Promise((resolve, reject) => {
        const token = parseInt(req.body.token || req.cookies.token);
        const user = UserManager.getValidUser(token, req.ip);

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
    if (req.cookies.token && UserManager.getValidUser(parseInt(req.cookies.token), req.ip)) {
        res.send(templateGenerator(apiUrl, req.cookies.token));
    } else {
        res.send(templateGenerator(apiUrl, UserManager.generateUser(req.ip).token));
    }
});

app.post("/api/validate", (req, res) => {
    validate(req, res).then(() => {
        res.send({ status: "ok" });
    }).catch(() => {});
});

// ####################
//  API OSC Endroutes
// ####################

// Play Next
app.post("/api/next", (req, res) => {
    validate(req, res).then(() => {
        qlab.next();
        res.send({});
    }).catch(() => {});
});

// Playhead Previous:
app.post("/api/previous", async(req, res) => {
    try {
        await validate(req, res);

        const queOrder = await qlab.getCueListOrder();
        qlab.playheadPrevious();

        if ((await qlab.getSelectedQues()).data.number === queOrder[0]) {
            qlab.playheadNext();
        } else {
            qlab.playheadPrevious();
            if (await qlab.isRunning()) {
                qlab.playheadNext();
                qlab.stop();
            } else {
                qlab.next();
                qlab.stop();
            }
        }
        res.send({});
    } catch (e) {}
});

// Pause
app.post("/api/pause", (req, res) => {
    validate(req, res).then(() => {
        qlab.previous();
        qlab.pauseResume();
        res.send({});
    }).catch(() => {});
});

// Resume
app.post("/api/resume", (req, res) => {
    validate(req, res).then(() => {
        qlab.pauseResume();
        res.send({});
    }).catch(() => {});
});

// ===========

// Start listening for requests.
app.listen(3000);

menu.show();

process.stdin.on("keypress", (ch, key) => {
    if (key.name === "escape") {
        menu.cancel();
        menu.show();
    }
});
