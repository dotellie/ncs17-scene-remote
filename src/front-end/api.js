/* globals apiUrl, apiToken */

export const validateToken = () => {
    return new Promise((resolve, reject) => {
        const validate = () => {
            sendApiRequest("validate", { token: apiToken }).then(resp => {
                if (resp.status === "ok") {
                    clearInterval(interval);
                    resolve();
                }
            });
        };

        validate();
        const interval = setInterval(validate, 3000);
    });
};

export const goNext = () => {
    sendApiRequest("next");
};

export const goBack = () => {
    sendApiRequest("previous");
};

export const play = () => {
    sendApiRequest("resume");
};

export const pause = () => {
    sendApiRequest("pause");
};

const sendApiRequest = (path, object = {}, method = "POST") => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => {
            resolve(JSON.parse(xhr.responseText));
        });
        xhr.open(method, `http://${apiUrl}/api/${path}`, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(object));
    });
};
