import './main.js';
export * from 'webgpu-utils';
import 'd3';
import './vec-qmCeDHMU.js';

declare const resizeForDisplay: (chosenWidth: number, chosenHeight: number) => boolean;
declare global {
    let renderTarget: GPUTexture;
    let renderTargetView: GPUTextureView;
    let depthTexture: GPUTexture;
    let depthTargetView: GPUTextureView;
}
declare global {
    const width: number;
    const height: number;
    const r: number;
    const canvas: HTMLCanvasElement;
    const ctx: GPUCanvasContext;
    const device: GPUDevice;
    const queue: GPUQueue;
    const adapter: GPUAdapter;
    const presentationFormat: GPUTextureFormat;
}

export { resizeForDisplay };
