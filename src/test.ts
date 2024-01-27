import { code, definitions } from './myShader.wgsl' assert { type: 'wgsl' };
import { resizeForDisplay } from './webgpu';
import { WgslReflect } from 'wgsl_reflect';
resizeForDisplay(3840, 3840);

console.log(device.limits, [...adapter.features.entries()], presentationFormat);
console.log(code, definitions);
const d = new WgslReflect(code);
console.log(d);
