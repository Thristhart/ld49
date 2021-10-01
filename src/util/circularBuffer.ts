export class CircularBuffer {
    #buffer: Int32Array;
    #head = 0;
    constructor(public length: number) {
        this.#buffer = new Int32Array(length);
    }
    push(value: number) {
        this.#buffer[this.#head] = value;
        this.#head = (this.#head + 1) % this.length;
    }
    get(index: number) {
        return this.#buffer[(this.#head + index) % this.length];
    }
    *[Symbol.iterator]() {
        const currentHead = this.#head;
        for (let i = currentHead; i < this.length; i++) {
            yield this.#buffer[i];
        }
        for (let i = 0; i < currentHead; i++) {
            yield this.#buffer[i];
        }
    }
}
