/// <reference types="vite/client" />
/// <reference types="@webgpu/types" />
import { sample } from '@std/collections';
import { randomInt, randomUniform, rgb } from 'd3';
import * as C from '@rubyquaildesign/capture';
import { Pane } from 'tweakpane';
import { Font } from 'canvas-bitfont';
import {
	copySourceToTexture,
	createTextureFromSource,
	makeShaderDataDefinitions,
	makeStructuredView,
} from 'webgpu-utils';
import '../dist/webgpu/webgpu-utils.js';
import {
	BufUsage,
	buildBlur,
	createPPPipelineAndLayouts,
	createToneMapPass,
	TexUsage,
} from '../dist/webgpu/webgpu-utils.js';
import code from './test.wgsl?raw';
import fontSource from './nec-pc9821-ank-8x8.yaff?raw';
const matrixSize = 200;
const cvs = new OffscreenCanvas(matrixSize, matrixSize);
const ctx = cvs.getContext('2d')!;
ctx.fillStyle = 'white';
const colors = ['#F00', '#FF0', '#0F0', '#0FF', '#00F', '#F0F', '#FFF'];
const outputColours = [
	'#080808',
	'#66afeb',
	'#5f8332',
	'#34ffb0',
	'#d8061d',
	'#c850bd',
	'#f79813',
	'#f7e382',
]
	.map((s) => rgb(s))
	.map(({ r, g, b }) => [r, g, b].map((d) => (d / 255) ** 2.2));
console.log(makeShaderDataDefinitions(code));
const npColours = [
	'#080808',
	'#66afeb',
	'#5f8332',
	'#34ffb0',
	'#d8061d',
	'#c850bd',
	'#f79813',
	'#f7e382',
];
const col = () => colors[randomInt(colors.length)()];
const run = randomUniform(60, matrixSize);
const rr = randomUniform(2, 5);
range(256).forEach((i) => {
	ctx.fillStyle = sample(colors);
	ctx.beginPath();
	ctx.fillRect(floor(run()), floor(run()), ceil(rr()), ceil(rr()));
});
ctx.globalCompositeOperation = 'screen';
drawSins();
const settings = {
	intensity: 0.3,
	blurOffset: 0.8,
	threshold: 0.15,
	soft: 0.5,
};
const myPane = new Pane();
npColours.forEach((_, i) => {
	myPane.addBinding(npColours, i, {
		label: 'fd',
	});
});
myPane.addBinding(settings, 'intensity', {
	min: 0,
	max: 5,
});

myPane.addBinding(settings, 'blurOffset', {
	min: 0.01,
	max: 2,
});
myPane.addBinding(settings, 'threshold', { min: 0, max: 1 });
myPane.addBinding(settings, 'soft', { min: 0, max: 2 });

const outputCanvas = document.querySelector<HTMLCanvasElement>('#canvas');
if (!outputCanvas) {
	throw new Error('noCanvas');
}
const oCtx = outputCanvas.getContext('webgpu');
if (!oCtx) {
	throw new Error('noCanvas');
}
const interTex = device.createTexture({
	format: 'rgba16float',
	size: [1080, 1080],
	usage: TexUsage.all,
});
const blurTex = device.createTexture({
	format: 'rgba16float',
	size: [1080, 1080],
	usage: TexUsage.all,
});

const module = device.createShaderModule({
	code,
});
const shaderData = makeShaderDataDefinitions(code);
const { renderPipeline, bindGroupLayouts } = createPPPipelineAndLayouts(
	{
		codeModule: module,
		dataDefinition: shaderData,
		entry: 'frag',
	},
	'rgba16float',
	'test',
);

oCtx.configure({
	device,
	format: presentationFormat,
	alphaMode: 'opaque',
	usage: TU.COPY_DST | TU.RENDER_ATTACHMENT,
});

const uniforms = makeStructuredView(shaderData.uniforms['u']);
uniforms.set({
	colors: outputColours,
	brightness: 2.0,
});
const buf = device.createBuffer({
	size: uniforms.arrayBuffer.byteLength,
	usage: BufUsage.allCopy | BufUsage.UNIFORM,
});
queue.writeBuffer(buf, 0, uniforms.arrayBuffer, 0);
const t = createTextureFromSource(device, cvs, {
	mips: false,
	usage: TU.COPY_SRC | TU.COPY_DST | TU.TEXTURE_BINDING,
	format: 'bgra8unorm',
});
const blurPass = buildBlur(
	device,
	[1080, 1080],
	3,
	'rgba16float',
	interTex,
	'rgba16float',
	true,
);
const bindGroup = device.createBindGroup({
	layout: bindGroupLayouts[0],
	entries: [
		{
			binding: 0,
			resource: t.createView(),
		},
		{
			binding: 1,
			resource: {
				buffer: buf,
			},
		},
	],
});
const tonePass = createToneMapPass(
	'tm',
	blurTex.createView(),
	presentationFormat,
	undefined,
	'narkowicz',
	true,
);
tonePass.setUniforms(queue, {
	whitePoint: 1.0,
	brightness: -0.1,
	contrast: 0.8,
	saturation: 1.2,
	exposure: 0.9,
	midPoint: 0.5,
});
const enc = device.createCommandEncoder();

const pass = enc.beginRenderPass({
	colorAttachments: [
		{
			view: interTex.createView(),
			loadOp: 'clear',
			clearValue: [0, 0, 0, 0],
			storeOp: 'store',
		},
	],
});
pass.setPipeline(renderPipeline);
pass.setBindGroup(0, bindGroup);
pass.draw(3);
pass.end();
// const bbuf = blurPass.draw(oCtx.getCurrentTexture());
// pas.renderPass(enc, oCtx.getCurrentTexture().createView());
queue.submit([enc.finish()]);
function drawSins(offset = 0) {
	sinWave(offset, '#f00', 5, 1.1, 5, 3);
	sinWave(offset, '#0f0', 5, 1.2, 15, 3);
	sinWave(offset, '#00f', 5, 1.3, 25, 3);
	sinWave(offset, '#ff0', 5, 1.4, 35, 3);
	sinWave(offset, '#0ff', 5, 1.5, 45, 3);
	sinWave(offset, '#f0f', 5, 1.6, 55, 3);
	sinWave(offset, '#fff', 5, 1.7, 65, 3);
}

// const d = document.createElement('a');
// d.href = outputCanvas.toDataURL();
// d.download = 'test.png';
// d.click();
let frameCount = 0;
const font = await Font.load(fontSource);
function sinWave(
	offset: number,
	color: string,
	frequency: number,
	speed: number,
	y: number,
	height: number,
) {
	ctx.save();
	ctx.translate(0, y);
	ctx.beginPath();
	ctx.lineJoin = 'bevel';
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	range(matrixSize / 2).forEach((i) => {
		const tt = (i / TAU) * frequency;
		const h = sin(tt - offset * speed) * height;
		if (i == 0) {
			ctx.moveTo(i * 2, 0 + h);
		} else ctx.lineTo(i * 2, 0 + h);
	});
	ctx.stroke();
	ctx.restore();
}
const client = await C.CaptureClient.create(6969, {
	format: 'pngUrl',
	frameRate: 60,
	height: outputCanvas.height,
	width: outputCanvas.width,
	maxLength: 60 * 4,
	name: 'test1',
});

async function render() {
	frameCount++;
	ctx.clearRect(0, 0, matrixSize, matrixSize);
	drawSins(frameCount / 100);
	for (const i of range(8)) {
		if ((frameCount + i * 40) % 180 < 60 + i * 10) continue;
		const x = 10 + 42 * floor(i / 4);
		const y = 80 + 12 * (i % 4);
		const r = (i >> 2) & 1;
		const g = (i >> 1) & 1;
		const b = i & 1;
		const fill = `#${[r, g, b].map((v) => (v ? 'f' : '0')).join('')}`;
		ctx.drawImage(font.fillText('Alert', fill).canvas, x, y);
	}
	for (const bi of range(7)) {
		const i = bi + 1;
		const r = (i >> 2) & 1 ? 'f' : '0';
		const g = (i >> 1) & 1 ? 'f' : '0';
		const b = i & 1 ? 'f' : '0';
		const iy = 140 + 14 * floor(bi / 2);
		const ix = 4 + 84 * (bi % 2);
		for (const gx of range(16)) {
			const o = gx.toString(16);

			const color = `#${r}${g}${b}${o}`;
			ctx.fillStyle = color;
			ctx.fillRect(ix + gx * 5, iy, 5, 12);
		}
	}
	copySourceToTexture(device, t, cvs);
	blurPass.setUniforms(queue, {
		blur: {
			intensity: settings.intensity,
			blurOffset: settings.blurOffset,
		},
		threshold: {
			threshold: settings.threshold,
			soft: settings.soft,
		},
	});
	const enc = device.createCommandEncoder();
	const pass = enc.beginRenderPass({
		colorAttachments: [
			{
				view: interTex.createView(),
				loadOp: 'clear',
				clearValue: [0, 0, 0, 0],
				storeOp: 'store',
			},
		],
	});
	pass.setPipeline(renderPipeline);
	pass.setBindGroup(0, bindGroup);
	pass.draw(3);
	pass.end();
	const bbuf = blurPass.draw(blurTex);
	const enc2 = device.createCommandEncoder();
	tonePass.renderPass(enc2, oCtx.getCurrentTexture().createView());
	queue.submit([enc.finish(), bbuf, enc2.finish()]);
	await queue.onSubmittedWorkDone();
	requestAnimationFrame(render);
}
render();
