module.exports = filename => {
    const endings = ["mkv", "flv", "mov", "mp4", "avi", "wav"];

    return endings.some(ending => filename.endsWith(ending));
};
