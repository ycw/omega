import { Vector3 } from 'three';

export class Spring {

  from: Vector3;
  to: Vector3;
  frequency: number;
  decay: number; // 1=forever 0=instant
  maxAmplitude: number; // |from-to| < maxAmplitude (0=instant)
  position: Vector3; // hold curr pos
  #isIdle!: boolean;
  #time!: number; // curr time

  constructor({
    from = new Vector3(),
    to = new Vector3(),
    frequency = 10,
    decay = 0.5,
    maxAmplitude = Infinity,
    position = new Vector3()
  } = {}) {
    this.from = from;
    this.to = to;
    this.frequency = frequency;
    this.decay = decay;
    this.maxAmplitude = maxAmplitude;
    this.position = position;
    this.reset();
  }

  reset() {
    this.position.copy(this.from);
    this.#isIdle = false;
    this.#time = 0;
  }

  get isIdle() { return this.#isIdle }

  update(dt: number) { // dt in sec
    this.#isIdle = false;
    this.#time += dt;
    if (this.frequency === 0 || this.decay === 0) return this.#forceEnd();
    const f = this.frequency * this.#time;
    const k = this.decay ** f;
    const a = this.from.distanceTo(this.to) * k;
    if (a < 0.001) return this.#forceEnd();
    const n = Math.sin(2 * Math.PI * f + this.#time);
    const l = Math.min(this.maxAmplitude, a) * n;
    this.position.copy(this.to).add(this.to.clone().sub(this.from).setLength(l));
  }

  #forceEnd() {
    this.position.copy(this.to);
    this.#isIdle = true;
  }
}