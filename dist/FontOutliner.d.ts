import { Shape } from 'three';

declare class FontOutliner {
    #private;
    static fromUrl(fontUrl: string): Promise<FontOutliner>;
    constructor(arrayBuffer: ArrayBuffer);
    outline(text: string, options?: {
        size?: number;
        isLTR?: boolean;
        isCCW?: boolean;
    }): {
        shapes: Shape[];
        h: number;
        w: number;
        yMin: number;
        yMax: number;
    };
    hasGlyph(codePoint: number): boolean;
}

export { FontOutliner };
