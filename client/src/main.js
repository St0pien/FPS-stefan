import "./css/main.css";
import World from "./components/World";

function init() {
    const container = document.querySelector('#root');
    new World(container);
}

init();
