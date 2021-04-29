class GridItem {
    constructor(x, y) {
        this.ref = document.createElement('div');
        this.ref.classList.add('grid-item');
        this.pos = [x, y];
        document.querySelector('.grid').appendChild(this.ref);
        this.ref.addEventListener('click', () => {
            this.setType(state.getCurrentType());
        });
        this.type = null;
    }

    setType(type) {
        switch(type) {
            case "wall": this.ref.style.background = 'lime';
            break;
            case "enemy": this.ref.style.background = 'red';
            break;
            case "treasure": this.ref.style.background = 'rgb(88, 88, 255)';
            break;
            case "light": this.ref.style.background = 'yellow';
            break;
            case "delete": this.ref.style.background = 'none';
            break;
        }

        this.type = type == 'delete' ? null : type;
        state.update();
    }

    getItem() {
        const [x ,y] = this.pos
        return {
            id: `${x}${y}`,
            x: x,
            y: 0,
            z: y,
            type: this.type
        }
    }
}

const state = {
    grid: [],
    typeInputs: [...document.querySelectorAll('input[type=radio]')],
    getCurrentType() {
        const input = this.typeInputs.find(input => input.checked);
        return input ? input.value : null;
    },
    output: document.querySelector('.output'),

    update() {
        const result = this.grid
            .filter(g => g.type != null)
            .map(g => g.getItem())
        const json = JSON.stringify(result, null, 4);
        this.output.innerHTML = json;
        this.level = result.length > 0 ? json : "";
    },

    level: ""
}

for (let i=0; i<100; i++) {
    state.grid.push(new GridItem(Math.floor(i / 10), i % 10));
}

document.querySelector('.save').addEventListener('click', () => {
    fetch('/editor/add', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: state.level
    }).then(() => {
        alert("Level saved!");
    })
});

document.querySelector('.load').addEventListener('click', async () => {
    const res = await fetch('/editor/load');
    const data = await res.json();
    data.forEach(({x, z, type}) => {
        const item = state.grid.find(i => i.pos[0] == x && i.pos[1] == z);
        item.x = x;
        item.y = z;
        item.setType(type)
        state.update();
    });
});
