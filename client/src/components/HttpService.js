export default class HttpService {
    constructor(url) {
        this.baseUrl = url;
    }

    async loadLevel() {
        const res = await fetch(`${this.baseUrl}editor/load`);
        return await res.json();
    }
}