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
        name: "whereTo",
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
const showMenu = async() => {
    makeSkeleton("Main Menu");

    const { whereTo } = await inquirer.prompt(mainMenu);

    const index = mainMenu[0].choices.findIndex(c => c === whereTo);

    if (index === 0) {
        await showAddUser();
    } else if (index === 1) {
        await showRemoveUser();
    } else if (index === 2) {
        await showListUsers();
    }

    showMenu();
};

const showAddUser = async() => {
    makeSkeleton("Add User");

    const { token, description, duration } = await inquirer.prompt(addUserMenu);
    UserManager.validateUser(parseInt(token), description, duration);
};

const showRemoveUser = async() => {
    makeSkeleton("Remove User");

    const { token } = await inquirer.prompt(removeTokenMenu);
    UserManager.removeUser(parseInt(token));
};

const showListUsers = async() => {
    makeSkeleton("List Users");

    log(UserManager.users.map(u => `${u.token}<>${u.ip}: ${u.description}, expires: ${u.expires}`).join("\n"));
    log("\nPress any key to return to menu...");
    await listenForKey();
};

module.exports.show = showMenu;
