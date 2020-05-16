var AudioService = /** @class */ (function () {
    function AudioService(audioSRC, fadeIn) {
        this.audioSRC = audioSRC;
        this.fadeIn = !fadeIn || true;
        console.log(this.fadeIn);
    }
    return AudioService;
}());
export default AudioService;
