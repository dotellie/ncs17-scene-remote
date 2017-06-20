import anime from "animejs";

import "style-loader!./style.css";

anime({
    targets: "#playpause-button polygon",
    points: "0 0 32 16 32 16 0 32",
    easing: "easeInOutExpo"
});
