function uploadResult(enemies, gameWon) {
    const killedEnemies= enemies.filter(e => e.value <= 0).length;

    const baseurl = process.env.NODE_ENV == "development" ? "http://localhost:3000/" : "/";
    fetch(`${baseurl}api/result`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            killedEnemies,
            gameWon
        })
    })
}

const Stats = {
    player: {
        life: {
            value: 0,
            ref: document.querySelector('.player-life')
        },
        ammo: {
            value: 0,
            ref: document.querySelector('.player-ammo')
        },
        deathScreen: document.querySelector('.game-over'),
        winScreen: document.querySelector('.win')
    },

    enemiesWrapper: document.querySelector('.enemies-stats'),
    enemies: [],

    updatePlayerLife(value) {
        this.player.life.value = value;
        this.display();
    },

    updatePlayerAmmo(value) {
        this.player.ammo.value = value;
        this.display();
    },

    death() {
        this.player.deathScreen.style.display = 'block';
        uploadResult(this.enemies, false)
    },

    win() {
        this.player.winScreen.style.display = 'block';
        uploadResult(this.enemies, true)
    },

    addEnemy() {
        const lifeWrapper = document.createElement('div');
        lifeWrapper.classList.add('enemy-life-wrapper');
        this.enemiesWrapper.appendChild(lifeWrapper);

        const ref = document.createElement('div');
        ref.classList.add('enemy-life');
        lifeWrapper.appendChild(ref);
        this.enemies.push({
            value: 0,
            ref
        });
    },

    updateEnemy(index, value) {
        this.enemies[index].value = value;
        this.enemies[index].ref.style.transform = `translate(${this.enemies[index].value}%)`;

        if (this.enemies.every(({ value }) => value <= 0)) {
            this.win();
        }
    },

    display() {
        this.player.life.ref.style.transform = `translate(${this.player.life.value}%)`;
        this.player.ammo.ref.style.transform = `translate(${this.player.ammo.value}%)`;
    }
}

export default Stats;
