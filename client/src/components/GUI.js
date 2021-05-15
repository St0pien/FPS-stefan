const GUI = {
    options: {
        'camera-y': null,
        'camera-vertical': null,
        'camera-dist': null,
        'camera-horizontal': null,
        'camera-fov': null,
        'light-intensity': null,
        'shadows': null,
        'camera-top': null,
        'fire-height': null,
        'fire-width': null,
        'fire-length': null
    },

    getOptions() {
        const result = {};
        for (let opt in this.options) {
                result[opt] = parseFloat(this.options[opt].value);
        }

        result['camera-top'] = this.options["camera-top"].checked;
        result['shadows'] = this.options["shadows"].checked;

        return result;
    }
}

for (let option in GUI.options) {
    GUI.options[option] = document.querySelector(`#${option}`);
}

export default GUI;
