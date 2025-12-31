struct Vary {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f
}

struct Uniforms {
    colors: array<vec3f,8>,
    brightness: f32
}

@group(0) @binding(0) var src: texture_2d<f32>;
@group(0) @binding(1) var<uniform> u:Uniforms;

override width: u32 = 1080u;
override height: u32 = 1080u;
override source_size = 200u;
override multiplier = 5u;

@fragment fn frag(inp: Vary) -> @location(0) vec4f {
    let main_size = (vec2u(source_size) * multiplier) - 1u;
    let padding_x:f32 = f32(width - main_size.x) / 2.0;
    let padding_y:f32 = f32(width - main_size.y) / 2.0;
    let resolution = vec3f(f32(width), f32(height), 1.0);
    let xy = vec2f(inp.position.xy);
    let ixy = vec2i(floor(xy));
    let canvasPos = ixy - vec2i(vec2(padding_x,padding_y));
    if any(canvasPos < vec2i(0)) {
        return vec4f(0.,0.,0.,1.0);
    }
    if any(canvasPos >= vec2i(main_size)) {
        return vec4f(0.,0.,0.,1.0);
    }
    let pxlPos = canvasPos % i32(multiplier);
    if any(pxlPos >= vec2i(3)) {
        return vec4f(vec3f(0.0),1.0);
    }
    let uv = canvasPos / vec2i(5);
    let sq = vec2i(floor(vec2f(uv)/vec2f(20.0)));
    let b = f32(sq.y * 9 + sq.x) / f32(81);
    let color = textureLoad(src,uv,1);
    let rb = select(0u,4u,color.r > 0.5);
    let gb = select(0u,2u,color.g > 0.5);
    let bb = select(0u,1u,color.b > 0.5);
    let col = mix(u.colors[0u],(u.colors[rb+gb+bb] * (u.brightness)),vec3f(pow(color.a,2.2)));
    return vec4f(col,1.0);
}