import { Vector3 } from 'three';

declare class Spring {
    #private;
    from: Vector3;
    to: Vector3;
    frequency: number;
    decay: number;
    maxAmplitude: number;
    position: Vector3;
    constructor({ from, to, frequency, decay, maxAmplitude, position }?: {
        from?: Vector3 | undefined;
        to?: Vector3 | undefined;
        frequency?: number | undefined;
        decay?: number | undefined;
        maxAmplitude?: number | undefined;
        position?: Vector3 | undefined;
    });
    reset(): void;
    get isIdle(): boolean;
    update(dt: number): void;
}

export { Spring };
