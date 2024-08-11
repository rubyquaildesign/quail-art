// #module main

// #import snoise2 from quail.noise
// #import spectral_mix from spectral
fn lch2lab(lch: vec3f) -> vec3f {
    return vec3f(
        lch.x,
        lch.y * cos(lch.z * 0.01745329251),
        lch.y * sin(lch.z * 0.01745329251)
    );
}

fn lab2xyz(c: vec3f) -> vec3f {
    var f = vec3f(0.0);
    f.y = (c.x + 16.0) / 116.0;
    f.x = c.y / 500.0 + f.y;
    f.z = f.y - c.z / 200.0;
    let c0 = f * f * f;
    let c1 = (f - 16.0 / 116.0) / 7.787;
    return vec3f(95.047, 100.000, 108.883) * mix(c0, c1, step(f, vec3f(0.206897)));
}
const XYZ2RGB = mat3x3<f32>(vec3f(3.2404542, -0.9692660, 0.0556434), vec3f(-1.5371385, 1.8760108, -0.2040259), vec3f(-0.4985314, 0.0415560, 1.0572252));

fn xyz2rgb(xyz: vec3f) -> vec3f { return XYZ2RGB * (xyz * 0.01); }
fn lch2rgb(lch: vec3f) -> vec3f { return xyz2rgb(lab2xyz(lch2lab(lch))); }
struct VSOut {
    @builtin(position) pos: vec4f,
    @location(0) tex: vec2f
}
override red = 12;
@group(0) @binding(0) var<storage,read> barry: array<f32>;

@vertex 
fn tri_shader(
    @builtin(vertex_index) vertexIndex: u32
) -> VSOut {
    var vs: VSOut;
    var pos = array<vec2<f32>, 3>(vec2f(-1., 3.), vec2f(3., -1.), vec2f(-1., -1.));
    vs.pos = vec4f(pos[vertexIndex], 0f, 1f);
    vs.tex = vec2f(pos[vertexIndex].r / 2. + .5, pos[vertexIndex].g / 2. + .5);
    return vs;
} 

@fragment 
fn fs(v: VSOut) -> @location(0) vec4f {
    let mix: vec2<f32> = clamp(snoise2(v.tex * 3.) / 2.0 + 0.5, vec2f(0.05), vec2f(0.95));
    let mix2: vec2<f32> = clamp(snoise2(v.tex * 3. + 50.) / 2.0 + 0.5, vec2f(0.05), vec2f(0.95));
    let green = vec3f(0.26, 0.58, 0.27);
    let red = vec3f(0.85, 0.26, 0.25);
    let white = vec3f(0.95);
    let black = vec3f(0.05);
    let two: vec3f = spectral_mix(red, green, step(mix.r, 0.5));
    let three: vec3f = spectral_mix(black, white, step(mix.g, 0.5));
    let four: vec3f = spectral_mix(two, three, mix2.r);
    return vec4f(four, 1.);
}