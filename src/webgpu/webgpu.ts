/// <reference types="@webgpu/types" />
import '../entry/main.js';
if (!(navigator.gpu && navigator.gpu.requestAdapter)) {
	alert('browser does not support WebGPU');
	throw new Error('no adapter found');
}
const adapter = await navigator.gpu.requestAdapter({
	powerPreference: 'high-performance',
});
const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
if (!adapter) {
	alert('browser does not support WebGPU');
	throw new Error('no adapter found');
}
const device = await adapter.requestDevice({
	requiredFeatures: ['bgra8unorm-storage'],
});
if (!device) {
	alert('browser does not support WebGPU');
	throw new Error('no adapter found');
}
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('webgpu')!;
if (!ctx) {
	alert('browser does not support WebGPU');
	throw new Error('no adapter found');
}
ctx.configure({
	device,
	format: presentationFormat,
	alphaMode: 'opaque',
	colorSpace: 'srgb',
	usage:
		GPUTextureUsage.STORAGE_BINDING |
		GPUTextureUsage.RENDER_ATTACHMENT |
		GPUTextureUsage.COPY_DST,
});
const sampleCount = 1;
let renderTarget: GPUTexture;
let renderTargetView: GPUTextureView;
let depthTexture: GPUTexture;
let depthTargetView: GPUTextureView;

export const resizeForDisplay = (chosenWidth: number, chosenHeight: number) => {
	const width = Math.max(
		1,
		Math.min(device.limits.maxTextureDimension2D, chosenWidth),
	);
	const height = Math.max(
		1,
		Math.min(device.limits.maxTextureDimension2D, chosenHeight),
	);

	const needResize =
		!renderTarget || width !== chosenWidth || height !== chosenHeight;

	if (renderTarget) {
		renderTarget.destroy();
	}
	if (depthTexture) {
		depthTexture.destroy();
	}
	canvas.width = width;
	canvas.height = height;

	const newRenderTarget = device.createTexture({
		size: [canvas.width, canvas.height],
		format: presentationFormat,
		sampleCount,
		usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST,
	});
	renderTarget = newRenderTarget;
	renderTargetView = newRenderTarget.createView();
	const newDepthTexture = device.createTexture({
		size: [canvas.width, canvas.height],
		format: 'depth24plus',
		sampleCount,
		usage: GPUTextureUsage.RENDER_ATTACHMENT,
	});
	depthTexture = newDepthTexture;
	depthTargetView = newDepthTexture.createView();
	const forExport = {
		width,
		height,
		r: min(width, height),
		canvas,
		ctx,
		device,
		adapter,
		queue: device.queue,
		presentationFormat,
	} as const;
	Object.entries(forExport).forEach(([key, value]) => {
		(globalThis as any)[key] = value;
	});

	globalThis.renderTarget = renderTarget;
	globalThis.renderTargetView = renderTargetView;
	globalThis.depthTexture = depthTexture;
	globalThis.depthTargetView = depthTargetView;
	return needResize;
};
resizeForDisplay(canvas.width, canvas.height);
declare global {
	/* eslint-disable no-var */
	var renderTarget: GPUTexture;
	var renderTargetView: GPUTextureView;
	var depthTexture: GPUTexture;
	var depthTargetView: GPUTextureView;
	/* eslint-enable no-var */
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

export * from 'webgpu-utils';
