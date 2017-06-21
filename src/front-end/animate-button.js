import anime from "animejs";

export default (button, onclick) => {
    if (!onclick) onclick = () => {};

    let currentPush, currentRelease;

    const playPush = () => {
        if (currentRelease) currentRelease.pause();
        currentPush = anime({
            targets: button,
            duration: 300,
            scale: 0.7
        });
    };

    const playRelease = () => {
        if (currentPush) currentPush.pause();
        currentRelease = anime({
            targets: button,
            duration: 300,
            scale: 1
        });
        onclick(button);
    };

    button.addEventListener("touchstart", playPush);
    button.addEventListener("touchend", playRelease);
    // button.addEventListener("mousedown", playPush);
    // button.addEventListener("mouseup", playRelease);
};
