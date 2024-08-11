const SPECTRAL_SIZE: i32 = 38;
const SPECTRAL_GAMMA: f32 = 2.4;
const SPECTRAL_EPSILON: f32 = 0.0001;
// #module spectral
fn spectral_uncompand(x: f32) -> f32 {
    if x < 0.04045 { return x / 12.92; } else { return pow((x + 0.055) / 1.055, SPECTRAL_GAMMA); };
} 

fn spectral_compand(x: f32) -> f32 {
    if x < 0.0031308 { return x * 12.92; } else { return 1.055 * pow(x, 1. / SPECTRAL_GAMMA) - 0.055; };
} 

fn spectral_srgb_to_linear(srgb: vec3<f32>) -> vec3<f32> {
    return vec3<f32>(spectral_uncompand(srgb[0]), spectral_uncompand(srgb[1]), spectral_uncompand(srgb[2]));
} 

fn spectral_linear_to_srgb(lrgb: vec3<f32>) -> vec3<f32> {
    return clamp(vec3<f32>(spectral_compand(lrgb[0]), spectral_compand(lrgb[1]), spectral_compand(lrgb[2])), vec3<f32>(0.), vec3<f32>(1.));
} 

fn spectral_upsampling(lrgb: vec3<f32>, w: ptr<function, f32>, c: ptr<function, f32>, m: ptr<function, f32>, y: ptr<function, f32>, r: ptr<function, f32>, g: ptr<function, f32>, b: ptr<function, f32>) {
    var lrgb_var = lrgb;
    *w = min(lrgb_var.r, min(lrgb_var.g, lrgb_var.b));
    lrgb_var = lrgb_var - (*w);
    *c = min(lrgb_var.g, lrgb_var.b);
    *m = min(lrgb_var.r, lrgb_var.b);
    *y = min(lrgb_var.r, lrgb_var.g);
    *r = min(max(0., lrgb_var.r - lrgb_var.b), max(0., lrgb_var.r - lrgb_var.g));
    *g = min(max(0., lrgb_var.g - lrgb_var.b), max(0., lrgb_var.g - lrgb_var.r));
    (*b) = min(max(0., lrgb_var.b - lrgb_var.g), max(0., lrgb_var.b - lrgb_var.r));
} 

fn spectral_linear_to_reflectance(lrgb: vec3<f32>, R: ptr<function, array<f32,SPECTRAL_SIZE>>) {
    var w: f32;
    var c: f32;
    var m: f32;
    var y: f32;
    var r: f32;
    var g: f32;
    var b: f32;
    spectral_upsampling(lrgb, &w, &c, &m, &y, &r, &g, &b);
    (*R)[0] = max(SPECTRAL_EPSILON, w + c * 0.9685363 + m * 0.5156712 + y * 0.02055257 + r * 0.03147571 + g * 0.4910858 + b * 0.97901833);
    (*R)[1] = max(SPECTRAL_EPSILON, w + c * 0.96855104 + m * 0.5401552 + y * 0.02059936 + r * 0.03146636 + g * 0.46944058 + b * 0.9790165);
    (*R)[2] = max(SPECTRAL_EPSILON, w + c * 0.96859336 + m * 0.626455 + y * 0.02062723 + r * 0.03140624 + g * 0.4016578 + b * 0.9790112);
    (*R)[3] = max(SPECTRAL_EPSILON, w + c * 0.9687734 + m * 0.7559501 + y * 0.02073387 + r * 0.03119611 + g * 0.2449042 + b * 0.9789215);
    (*R)[4] = max(SPECTRAL_EPSILON, w + c * 0.96942204 + m * 0.92827 + y * 0.02114202 + r * 0.03053888 + g * 0.0682688 + b * 0.97858554);
    (*R)[5] = max(SPECTRAL_EPSILON, w + c * 0.9714371 + m * 0.9722362 + y * 0.02233154 + r * 0.02856855 + g * 0.02732883 + b * 0.9774371);
    (*R)[6] = max(SPECTRAL_EPSILON, w + c * 0.9754186 + m * 0.98616177 + y * 0.02556857 + r * 0.02459485 + g * 0.013606 + b * 0.9742808);
    (*R)[7] = max(SPECTRAL_EPSILON, w + c * 0.98074186 + m * 0.98955256 + y * 0.03330189 + r * 0.0192952 + g * 0.01000187 + b * 0.96663225);
    (*R)[8] = max(SPECTRAL_EPSILON, w + c * 0.9858099 + m * 0.98676234 + y * 0.05185294 + r * 0.01423112 + g * 0.01284127 + b * 0.94822896);
    (*R)[9] = max(SPECTRAL_EPSILON, w + c * 0.98971194 + m * 0.97312576 + y * 0.10087639 + r * 0.01033111 + g * 0.02636635 + b * 0.8993771);
    (*R)[10] = max(SPECTRAL_EPSILON, w + c * 0.99238026 + m * 0.9194428 + y * 0.24000414 + r * 0.00765876 + g * 0.07058713 + b * 0.76070166);
    (*R)[11] = max(SPECTRAL_EPSILON, w + c * 0.9940984 + m * 0.32564852 + y * 0.53589064 + r * 0.00593693 + g * 0.7042169 + b * 0.4642044);
    (*R)[12] = max(SPECTRAL_EPSILON, w + c * 0.995172 + m * 0.13820627 + y * 0.7987466 + r * 0.00485616 + g * 0.85473996 + b * 0.20123039);
    (*R)[13] = max(SPECTRAL_EPSILON, w + c * 0.99576545 + m * 0.05015143 + y * 0.9118653 + r * 0.00426186 + g * 0.9508157 + b * 0.08808402);
    (*R)[14] = max(SPECTRAL_EPSILON, w + c * 0.9959355 + m * 0.02912336 + y * 0.95399624 + r * 0.00409039 + g * 0.9717037 + b * 0.04592894);
    (*R)[15] = max(SPECTRAL_EPSILON, w + c * 0.9956404 + m * 0.02421691 + y * 0.971371 + r * 0.00438375 + g * 0.97651887 + b * 0.02860373);
    (*R)[16] = max(SPECTRAL_EPSILON, w + c * 0.9946477 + m * 0.02660696 + y * 0.97939503 + r * 0.00537525 + g * 0.97429246 + b * 0.02060067);
    (*R)[17] = max(SPECTRAL_EPSILON, w + c * 0.9922958 + m * 0.03407586 + y * 0.9834521 + r * 0.00772962 + g * 0.9701292 + b * 0.01656701);
    (*R)[18] = max(SPECTRAL_EPSILON, w + c * 0.9863876 + m * 0.04835936 + y * 0.98553735 + r * 0.0136612 + g * 0.9425863 + b * 0.01451549);
    (*R)[19] = max(SPECTRAL_EPSILON, w + c * 0.9682971 + m * 0.0001172 + y * 0.98648906 + r * 0.03181352 + g * 0.99989206 + b * 0.01357964);
    (*R)[20] = max(SPECTRAL_EPSILON, w + c * 0.89228016 + m * 0.00008554 + y * 0.98674536 + r * 0.10791525 + g * 0.9998989 + b * 0.01331243);
    (*R)[21] = max(SPECTRAL_EPSILON, w + c * 0.5374024 + m * 0.85267884 + y * 0.98657554 + r * 0.46249515 + g * 0.1382314 + b * 0.01347661);
    (*R)[22] = max(SPECTRAL_EPSILON, w + c * 0.15360445 + m * 0.9318879 + y * 0.9861188 + r * 0.84604335 + g * 0.06968113 + b * 0.01387181);
    (*R)[23] = max(SPECTRAL_EPSILON, w + c * 0.05705719 + m * 0.94810265 + y * 0.9855994 + r * 0.9427557 + g * 0.05628787 + b * 0.01435472);
    (*R)[24] = max(SPECTRAL_EPSILON, w + c * 0.03126539 + m * 0.94200975 + y * 0.98507065 + r * 0.96861 + g * 0.06111561 + b * 0.01479836);
    (*R)[25] = max(SPECTRAL_EPSILON, w + c * 0.02205445 + m * 0.91478044 + y * 0.98460037 + r * 0.97783965 + g * 0.08987709 + b * 0.0151525);
    (*R)[26] = max(SPECTRAL_EPSILON, w + c * 0.01802271 + m * 0.87065446 + y * 0.984253 + r * 0.98187757 + g * 0.13656016 + b * 0.01540513);
    (*R)[27] = max(SPECTRAL_EPSILON, w + c * 0.0161346 + m * 0.7882755 + y * 0.98403907 + r * 0.9837732 + g * 0.22169624 + b * 0.01557233);
    (*R)[28] = max(SPECTRAL_EPSILON, w + c * 0.01520947 + m * 0.65738356 + y * 0.98388535 + r * 0.984702 + g * 0.32176957 + b * 0.0156571);
    (*R)[29] = max(SPECTRAL_EPSILON, w + c * 0.01475977 + m * 0.59909403 + y * 0.98376113 + r * 0.9851548 + g * 0.36157328 + b * 0.01571025);
    (*R)[30] = max(SPECTRAL_EPSILON, w + c * 0.01454263 + m * 0.5681727 + y * 0.98368245 + r * 0.9853711 + g * 0.4836192 + b * 0.01571916);
    (*R)[31] = max(SPECTRAL_EPSILON, w + c * 0.01444459 + m * 0.54032 + y * 0.9836502 + r * 0.98546684 + g * 0.4648858 + b * 0.01572133);
    (*R)[32] = max(SPECTRAL_EPSILON, w + c * 0.01439897 + m * 0.5211024 + y * 0.9836131 + r * 0.9855001 + g * 0.47440305 + b * 0.01572502);
    (*R)[33] = max(SPECTRAL_EPSILON, w + c * 0.0143762 + m * 0.51041096 + y * 0.9835726 + r * 0.9855103 + g * 0.4857699 + b * 0.01571717);
    (*R)[34] = max(SPECTRAL_EPSILON, w + c * 0.01436343 + m * 0.5052658 + y * 0.98353857 + r * 0.9855074 + g * 0.49267972 + b * 0.01571905);
    (*R)[35] = max(SPECTRAL_EPSILON, w + c * 0.01435687 + m * 0.5025508 + y * 0.98351246 + r * 0.9855132 + g * 0.49625686 + b * 0.01571059);
    (*R)[36] = max(SPECTRAL_EPSILON, w + c * 0.0143537 + m * 0.5012645 + y * 0.983501 + r * 0.98551565 + g * 0.49807754 + b * 0.01569728);
    (*R)[37] = max(SPECTRAL_EPSILON, w + c * 0.01435408 + m * 0.50083023 + y * 0.9835085 + r * 0.9855155 + g * 0.4988986 + b * 0.0157002);
} 

fn spectral_xyz_to_srgb(xyz: vec3<f32>) -> vec3<f32> {
    var XYZ_RGB: mat3x3<f32>;
    XYZ_RGB[0] = vec3<f32>(3.2430632, -1.5383762, -0.4989328);
    XYZ_RGB[1] = vec3<f32>(-0.9689631, 1.8754245, 0.04154303);
    XYZ_RGB[2] = vec3<f32>(0.05568392, -0.20417438, 1.0579945);
    let r: f32 = dot(XYZ_RGB[0], xyz);
    let g: f32 = dot(XYZ_RGB[1], xyz);
    let b: f32 = dot(XYZ_RGB[2], xyz);
    return spectral_linear_to_srgb(vec3<f32>(r, g, b));
} 

fn spectral_reflectance_to_xyz(R: array<f32,SPECTRAL_SIZE>) -> vec3<f32> {
    var xyz: vec3<f32> = vec3<f32>(0.);
    xyz = xyz + (R[0] * vec3<f32>(0.00006469, 0.00000184, 0.00030502));
    xyz = xyz + (R[1] * vec3<f32>(0.00021941, 0.00000621, 0.00103681));
    xyz = xyz + (R[2] * vec3<f32>(0.00112057, 0.00003101, 0.00531314));
    xyz = xyz + (R[3] * vec3<f32>(0.00376661, 0.00010475, 0.01795439));
    xyz = xyz + (R[4] * vec3<f32>(0.01188055, 0.00035364, 0.05707758));
    xyz = xyz + (R[5] * vec3<f32>(0.02328644, 0.00095147, 0.11365162));
    xyz = xyz + (R[6] * vec3<f32>(0.03455942, 0.00228226, 0.17335872));
    xyz = xyz + (R[7] * vec3<f32>(0.03722379, 0.00420733, 0.19620658));
    xyz = xyz + (R[8] * vec3<f32>(0.03241838, 0.0066888, 0.18608236));
    xyz = xyz + (R[9] * vec3<f32>(0.02123321, 0.0098884, 0.13995048));
    xyz = xyz + (R[10] * vec3<f32>(0.01049099, 0.01524945, 0.08917453));
    xyz = xyz + (R[11] * vec3<f32>(0.00329584, 0.02141831, 0.04789621));
    xyz = xyz + (R[12] * vec3<f32>(0.00050704, 0.03342293, 0.02814563));
    xyz = xyz + (R[13] * vec3<f32>(0.00094867, 0.05131001, 0.01613766));
    xyz = xyz + (R[14] * vec3<f32>(0.00627372, 0.07040208, 0.0077591));
    xyz = xyz + (R[15] * vec3<f32>(0.01686462, 0.08783871, 0.00429615));
    xyz = xyz + (R[16] * vec3<f32>(0.02868965, 0.09424905, 0.00200551));
    xyz = xyz + (R[17] * vec3<f32>(0.04267481, 0.09795667, 0.00086147));
    xyz = xyz + (R[18] * vec3<f32>(0.05625475, 0.09415219, 0.00036904));
    xyz = xyz + (R[19] * vec3<f32>(0.0694704, 0.08678102, 0.00019143));
    xyz = xyz + (R[20] * vec3<f32>(0.08305315, 0.07885653, 0.00014956));
    xyz = xyz + (R[21] * vec3<f32>(0.0861261, 0.0635267, 0.00009231));
    xyz = xyz + (R[22] * vec3<f32>(0.09046614, 0.05374142, 0.00006813));
    xyz = xyz + (R[23] * vec3<f32>(0.08500387, 0.04264606, 0.00002883));
    xyz = xyz + (R[24] * vec3<f32>(0.07090667, 0.03161735, 0.00001577));
    xyz = xyz + (R[25] * vec3<f32>(0.05062889, 0.02088521, 0.00000394));
    xyz = xyz + (R[26] * vec3<f32>(0.03547396, 0.01386011, 0.00000158));
    xyz = xyz + (R[27] * vec3<f32>(0.02146821, 0.00810264, 0.));
    xyz = xyz + (R[28] * vec3<f32>(0.01251646, 0.0046301, 0.));
    xyz = xyz + (R[29] * vec3<f32>(0.00680458, 0.00249138, 0.));
    xyz = xyz + (R[30] * vec3<f32>(0.00346457, 0.0012593, 0.));
    xyz = xyz + (R[31] * vec3<f32>(0.00149761, 0.00054165, 0.));
    xyz = xyz + (R[32] * vec3<f32>(0.0007697, 0.00027795, 0.));
    xyz = xyz + (R[33] * vec3<f32>(0.00040737, 0.00014711, 0.));
    xyz = xyz + (R[34] * vec3<f32>(0.00016901, 0.00006103, 0.));
    xyz = xyz + (R[35] * vec3<f32>(0.00009522, 0.00003439, 0.));
    xyz = xyz + (R[36] * vec3<f32>(0.00004903, 0.00001771, 0.));
    xyz = xyz + (R[37] * vec3<f32>(0.00002, 0.00000722, 0.));
    return xyz;
} 

fn spectral_linear_to_concentration(l1: f32, l2: f32, t: f32) -> f32 {
    let t1: f32 = l1 * pow(1. - t, 2.);
    let t2: f32 = l2 * pow(t, 2.);
    return t2 / (t1 + t2);
} 
// #export
fn spectral_mix(color1: vec3<f32>, color2: vec3<f32>, t: f32) -> vec3<f32> {
    var t_var = t;
    let lrgb1: vec3<f32> = spectral_srgb_to_linear(color1);
    let lrgb2: vec3<f32> = spectral_srgb_to_linear(color2);
    var R1: array<f32,SPECTRAL_SIZE>;
    var R2: array<f32,SPECTRAL_SIZE>;
    spectral_linear_to_reflectance(lrgb1, &R1);
    spectral_linear_to_reflectance(lrgb2, &R2);
    let l1: f32 = spectral_reflectance_to_xyz(R1)[1];
    let l2: f32 = spectral_reflectance_to_xyz(R2)[1];
    t_var = spectral_linear_to_concentration(l1, l2, t_var);
    var R: array<f32,SPECTRAL_SIZE>;

    for (var i: i32 = 0; i < SPECTRAL_SIZE; i = i + 1) {
        let KS: f32 = (1. - t_var) * (pow(1. - R1[i], 2.) / (2. * R1[i])) + t_var * (pow(1. - R2[i], 2.) / (2. * R2[i]));
        let KM: f32 = 1. + KS - sqrt(pow(KS, 2.) + 2. * KS);
        R[i] = KM;
    }

    return spectral_xyz_to_srgb(spectral_reflectance_to_xyz(R));
} 
