const GUI = {
    options: {
        'camera-y': null,
        'camera-vertical': null,
        'camera-dist': null,
        'camera-horizontal': null,
        'camera-fov': null,
        'light-density': null,
        'shadows': null,
        'camera-top': null,
    }
}

for (let option in GUI.options) {
    GUI.options[option] = document.querySelector(`#${option}`);
}

export default GUI;
