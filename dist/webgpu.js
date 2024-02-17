import "./chunk-XN5PZ7IL.js";
import "./chunk-REREWCK7.js";

// src/webgpu.ts
export * from "webgpu-utils";
if (!(navigator.gpu && navigator.gpu.requestAdapter)) {
  alert("browser does not support WebGPU");
  throw new Error("no adapter found");
}
var adapter = await navigator.gpu.requestAdapter({
  powerPreference: "high-performance"
});
var presentationFormat = navigator.gpu.getPreferredCanvasFormat();
if (!adapter) {
  alert("browser does not support WebGPU");
  throw new Error("no adapter found");
}
var device = await adapter.requestDevice({
  requiredFeatures: ["bgra8unorm-storage"]
});
if (!device) {
  alert("browser does not support WebGPU");
  throw new Error("no adapter found");
}
var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("webgpu");
if (!ctx) {
  alert("browser does not support WebGPU");
  throw new Error("no adapter found");
}
ctx.configure({
  device,
  format: presentationFormat,
  alphaMode: "opaque",
  colorSpace: "srgb",
  usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
});
var sampleCount = 1;
var renderTarget;
var renderTargetView;
var depthTexture;
var depthTargetView;
var resizeForDisplay = (chosenWidth, chosenHeight) => {
  const width = Math.max(
    1,
    Math.min(device.limits.maxTextureDimension2D, chosenWidth)
  );
  const height = Math.max(
    1,
    Math.min(device.limits.maxTextureDimension2D, chosenHeight)
  );
  const needResize = !renderTarget || width !== chosenWidth || height !== chosenHeight;
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
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
  });
  renderTarget = newRenderTarget;
  renderTargetView = newRenderTarget.createView();
  const newDepthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: "depth24plus",
    sampleCount,
    usage: GPUTextureUsage.RENDER_ATTACHMENT
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
    presentationFormat
  };
  Object.entries(forExport).forEach(([key, value]) => {
    globalThis[key] = value;
  });
  globalThis.renderTarget = renderTarget;
  globalThis.renderTargetView = renderTargetView;
  globalThis.depthTexture = depthTexture;
  globalThis.depthTargetView = depthTargetView;
  return needResize;
};
resizeForDisplay(canvas.width, canvas.height);
export {
  resizeForDisplay
};
//# sourceMappingURL=webgpu.js.map