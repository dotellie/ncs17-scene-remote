const inquirer = require("inquirer");
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

// View menu in console.
const show = () => {
    inquirer.prompt(mainMenu).then((ans) => {
        switch (ans.mainMenu) {
            case "1. Add token":
                inquirer.prompt(addUserMenu).then((ans) => {
                    UserManager.validateUser(parseInt(ans.token), ans.description, ans.duration);
                    show();
                });
                break;
            case "2. Remove token":
                inquirer.prompt(removeTokenMenu).then((ans) => {
                    UserManager.removeUser(parseInt(ans.token));
                    show();
                });
                break;
            case "3. List tokens":
                // console.log(`\n ${acceptedToken} \n`);
                console.log(`\n ${UserManager.users} \n`);
                show();
                break;
        }
    });
};

module.exports.show = show;
