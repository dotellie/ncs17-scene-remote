import anime from "animejs";

const button = document.querySelector("#play-pause-button");

export const setPlayPauseCallback = callback => {
    let playing = false;

    button.onclick = () => {
        playing = !playing;
        changeState(playing);
        callback();
    };
};

export const changeState = playing => {
    const playToPoints = (p1, p2) => {
        anime({
            targets: "#play-pause-button polygon",
            points: (el, i) => i === 0 ? p1 : p2,
            duration: 500,
            easing: "easeInOutExpo"
        });
    };

    if (playing) {
        playToPoints("0 0 26 16 26 16 0 32", "26 16 26 16 26 16 26 16");
    } else {
        playToPoints("0 0 13 0 13 32 0 32", "19 0 32 0 32 32 19 32");
    }
};

export const hidePlayPause = () => {
    button.style.opacity = 0;
};

export const showPlayPause = () => {
    button.style.opacity = 1;
};
