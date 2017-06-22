const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const UserManager = require("./user-manager.js");

const tokenValidation = (value) => {
    if (/^\d{4}$/.test(value)) {
        return true;
    }
    if (UserManager.has(parseInt(value))) {
        return true;
    }
    return "token format not accepted";
};

const durationValidation = (value) => {
    if (!value || (/^\d+$/.test(value) && parseInt(value) < 1440)) {
        return true;
    }
    return "Time not valid";
};

// Console Menu Objects:
const mainMenu = [
    {
        type: "list",
        name: "mainMenu",
        message: "Where do you want to go?",
        choices: ["1. Add token", "2. Remove token", "3. List tokens"]
    }
];

const addUserMenu = [
    {
        type: "input",
        name: "token",
        validate: tokenValidation,
        message: "Enter a token to allow"
    },
    {
        type: "input",
        name: "description",
        message: "Enter user description (maybe a name)"
    },
    {
        type: "input",
        name: "duration",
        validate: durationValidation,
        message: "Enter minutes from now when user shoudl expire (default 75 min)"
    }
];

const removeTokenMenu = [
    {
        type: "input",
        name: "token",
        validate: tokenValidation,
        message: "Enter a token to remove"
    }
];

const log = console.log;

const makeSkeleton = name => {
    clear();
    log(chalk.hex("#e23b9b")(figlet.textSync("NCS17 Scene Remote")));
    log(`${name}\n`);
};

const listenForKey = message => {
    return new Promise((resolve, reject) => {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once("data", () => {
            process.stdin.setRawMode(false);
            process.stdin.resume();
            resolve();
        });
    });
};

// View menu in console.
const show = () => {
    makeSkeleton("Main Menu");

    inquirer.prompt(mainMenu).then((ans) => {
        switch (ans.mainMenu) {
            case "1. Add token":
                makeSkeleton("Add User");
                inquirer.prompt(addUserMenu).then((ans) => {
                    UserManager.validateUser(parseInt(ans.token), ans.description, ans.duration);
                    show();
                });
                break;
            case "2. Remove token":
                makeSkeleton("Remove User");
                inquirer.prompt(removeTokenMenu).then((ans) => {
                    UserManager.removeUser(parseInt(ans.token));
                    show();
                });
                break;
            case "3. List tokens":
                makeSkeleton("List Users");
                log(UserManager.users.map(u => `${u.token}<>${u.ip}: ${u.description}, expires: ${u.expires}`).join("\n"));
                log("\nPress any key to return to menu...");
                listenForKey().then(show);
                break;
        }
    });
};

module.exports.show = show;
