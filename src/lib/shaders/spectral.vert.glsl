#version 300
const int SPECTRAL_SIZE = 38;
const float SPECTRAL_GAMMA = 2.4f;
const float SPECTRAL_EPSILON = 0.0001f;

float spectral_uncompand(float x) {
  return (x < 0.04045f) ? x / 12.92f : pow((x + 0.055f) / 1.055f, SPECTRAL_GAMMA);
}

float spectral_compand(float x) {
  return (x < 0.0031308f) ? x * 12.92f : 1.055f * pow(x, 1.0f / SPECTRAL_GAMMA) - 0.055f;
}

vec3 spectral_srgb_to_linear(vec3 srgb) {
  return vec3(spectral_uncompand(srgb[0]), spectral_uncompand(srgb[1]), spectral_uncompand(srgb[2]));
}

vec3 spectral_linear_to_srgb(vec3 lrgb) {
  return clamp(vec3(spectral_compand(lrgb[0]), spectral_compand(lrgb[1]), spectral_compand(lrgb[2])), 0.0f, 1.0f);
}

void spectral_upsampling(vec3 lrgb, out float w, out float c, out float m, out float y, out float r, out float g, out float b) {
  w = min(lrgb.r, min(lrgb.g, lrgb.b));

  lrgb -= w;

  c = min(lrgb.g, lrgb.b);
  m = min(lrgb.r, lrgb.b);
  y = min(lrgb.r, lrgb.g);
  r = min(max(0.f, lrgb.r - lrgb.b), max(0.f, lrgb.r - lrgb.g));
  g = min(max(0.f, lrgb.g - lrgb.b), max(0.f, lrgb.g - lrgb.r));
  b = min(max(0.f, lrgb.b - lrgb.g), max(0.f, lrgb.b - lrgb.r));
}

void spectral_linear_to_reflectance(vec3 lrgb, inout float R[SPECTRAL_SIZE]) {
  float w, c, m, y, r, g, b;

  spectral_upsampling(lrgb, w, c, m, y, r, g, b);

  R[0] = max(SPECTRAL_EPSILON, w + c * 0.96853629f + m * 0.51567122f + y * 0.02055257f + r * 0.03147571f + g * 0.49108579f + b * 0.97901834f);
  R[1] = max(SPECTRAL_EPSILON, w + c * 0.96855103f + m * 0.54015520f + y * 0.02059936f + r * 0.03146636f + g * 0.46944057f + b * 0.97901649f);
  R[2] = max(SPECTRAL_EPSILON, w + c * 0.96859338f + m * 0.62645502f + y * 0.02062723f + r * 0.03140624f + g * 0.40165780f + b * 0.97901118f);
  R[3] = max(SPECTRAL_EPSILON, w + c * 0.96877345f + m * 0.75595012f + y * 0.02073387f + r * 0.03119611f + g * 0.24490420f + b * 0.97892146f);
  R[4] = max(SPECTRAL_EPSILON, w + c * 0.96942204f + m * 0.92826996f + y * 0.02114202f + r * 0.03053888f + g * 0.06826880f + b * 0.97858555f);
  R[5] = max(SPECTRAL_EPSILON, w + c * 0.97143709f + m * 0.97223624f + y * 0.02233154f + r * 0.02856855f + g * 0.02732883f + b * 0.97743705f);
  R[6] = max(SPECTRAL_EPSILON, w + c * 0.97541862f + m * 0.98616174f + y * 0.02556857f + r * 0.02459485f + g * 0.01360600f + b * 0.97428075f);
  R[7] = max(SPECTRAL_EPSILON, w + c * 0.98074186f + m * 0.98955255f + y * 0.03330189f + r * 0.01929520f + g * 0.01000187f + b * 0.96663223f);
  R[8] = max(SPECTRAL_EPSILON, w + c * 0.98580992f + m * 0.98676237f + y * 0.05185294f + r * 0.01423112f + g * 0.01284127f + b * 0.94822893f);
  R[9] = max(SPECTRAL_EPSILON, w + c * 0.98971194f + m * 0.97312575f + y * 0.10087639f + r * 0.01033111f + g * 0.02636635f + b * 0.89937713f);
  R[10] = max(SPECTRAL_EPSILON, w + c * 0.99238027f + m * 0.91944277f + y * 0.24000413f + r * 0.00765876f + g * 0.07058713f + b * 0.76070164f);
  R[11] = max(SPECTRAL_EPSILON, w + c * 0.99409844f + m * 0.32564851f + y * 0.53589066f + r * 0.00593693f + g * 0.70421692f + b * 0.46420440f);
  R[12] = max(SPECTRAL_EPSILON, w + c * 0.99517200f + m * 0.13820628f + y * 0.79874659f + r * 0.00485616f + g * 0.85473994f + b * 0.20123039f);
  R[13] = max(SPECTRAL_EPSILON, w + c * 0.99576545f + m * 0.05015143f + y * 0.91186529f + r * 0.00426186f + g * 0.95081565f + b * 0.08808402f);
  R[14] = max(SPECTRAL_EPSILON, w + c * 0.99593552f + m * 0.02912336f + y * 0.95399623f + r * 0.00409039f + g * 0.97170370f + b * 0.04592894f);
  R[15] = max(SPECTRAL_EPSILON, w + c * 0.99564041f + m * 0.02421691f + y * 0.97137099f + r * 0.00438375f + g * 0.97651888f + b * 0.02860373f);
  R[16] = max(SPECTRAL_EPSILON, w + c * 0.99464769f + m * 0.02660696f + y * 0.97939505f + r * 0.00537525f + g * 0.97429245f + b * 0.02060067f);
  R[17] = max(SPECTRAL_EPSILON, w + c * 0.99229579f + m * 0.03407586f + y * 0.98345207f + r * 0.00772962f + g * 0.97012917f + b * 0.01656701f);
  R[18] = max(SPECTRAL_EPSILON, w + c * 0.98638762f + m * 0.04835936f + y * 0.98553736f + r * 0.01366120f + g * 0.94258630f + b * 0.01451549f);
  R[19] = max(SPECTRAL_EPSILON, w + c * 0.96829712f + m * 0.00011720f + y * 0.98648905f + r * 0.03181352f + g * 0.99989207f + b * 0.01357964f);
  R[20] = max(SPECTRAL_EPSILON, w + c * 0.89228016f + m * 0.00008554f + y * 0.98674535f + r * 0.10791525f + g * 0.99989891f + b * 0.01331243f);
  R[21] = max(SPECTRAL_EPSILON, w + c * 0.53740239f + m * 0.85267882f + y * 0.98657555f + r * 0.46249516f + g * 0.13823139f + b * 0.01347661f);
  R[22] = max(SPECTRAL_EPSILON, w + c * 0.15360445f + m * 0.93188793f + y * 0.98611877f + r * 0.84604333f + g * 0.06968113f + b * 0.01387181f);
  R[23] = max(SPECTRAL_EPSILON, w + c * 0.05705719f + m * 0.94810268f + y * 0.98559942f + r * 0.94275572f + g * 0.05628787f + b * 0.01435472f);
  R[24] = max(SPECTRAL_EPSILON, w + c * 0.03126539f + m * 0.94200977f + y * 0.98507063f + r * 0.96860996f + g * 0.06111561f + b * 0.01479836f);
  R[25] = max(SPECTRAL_EPSILON, w + c * 0.02205445f + m * 0.91478045f + y * 0.98460039f + r * 0.97783966f + g * 0.08987709f + b * 0.01515250f);
  R[26] = max(SPECTRAL_EPSILON, w + c * 0.01802271f + m * 0.87065445f + y * 0.98425301f + r * 0.98187757f + g * 0.13656016f + b * 0.01540513f);
  R[27] = max(SPECTRAL_EPSILON, w + c * 0.01613460f + m * 0.78827548f + y * 0.98403909f + r * 0.98377315f + g * 0.22169624f + b * 0.01557233f);
  R[28] = max(SPECTRAL_EPSILON, w + c * 0.01520947f + m * 0.65738359f + y * 0.98388535f + r * 0.98470202f + g * 0.32176956f + b * 0.01565710f);
  R[29] = max(SPECTRAL_EPSILON, w + c * 0.01475977f + m * 0.59909403f + y * 0.98376116f + r * 0.98515481f + g * 0.36157329f + b * 0.01571025f);
  R[30] = max(SPECTRAL_EPSILON, w + c * 0.01454263f + m * 0.56817268f + y * 0.98368246f + r * 0.98537114f + g * 0.48361920f + b * 0.01571916f);
  R[31] = max(SPECTRAL_EPSILON, w + c * 0.01444459f + m * 0.54031997f + y * 0.98365023f + r * 0.98546685f + g * 0.46488579f + b * 0.01572133f);
  R[32] = max(SPECTRAL_EPSILON, w + c * 0.01439897f + m * 0.52110241f + y * 0.98361309f + r * 0.98550011f + g * 0.47440306f + b * 0.01572502f);
  R[33] = max(SPECTRAL_EPSILON, w + c * 0.01437620f + m * 0.51041094f + y * 0.98357259f + r * 0.98551031f + g * 0.48576990f + b * 0.01571717f);
  R[34] = max(SPECTRAL_EPSILON, w + c * 0.01436343f + m * 0.50526577f + y * 0.98353856f + r * 0.98550741f + g * 0.49267971f + b * 0.01571905f);
  R[35] = max(SPECTRAL_EPSILON, w + c * 0.01435687f + m * 0.50255080f + y * 0.98351247f + r * 0.98551323f + g * 0.49625685f + b * 0.01571059f);
  R[36] = max(SPECTRAL_EPSILON, w + c * 0.01435370f + m * 0.50126452f + y * 0.98350101f + r * 0.98551563f + g * 0.49807754f + b * 0.01569728f);
  R[37] = max(SPECTRAL_EPSILON, w + c * 0.01435408f + m * 0.50083021f + y * 0.98350852f + r * 0.98551547f + g * 0.49889859f + b * 0.01570020f);
}

vec3 spectral_xyz_to_srgb(vec3 xyz) {
  mat3 XYZ_RGB;

  XYZ_RGB[0] = vec3(3.24306333f, -1.53837619f, -0.49893282f);
  XYZ_RGB[1] = vec3(-0.96896309f, 1.87542451f, 0.04154303f);
  XYZ_RGB[2] = vec3(0.05568392f, -0.20417438f, 1.05799454f);

  float r = dot(XYZ_RGB[0], xyz);
  float g = dot(XYZ_RGB[1], xyz);
  float b = dot(XYZ_RGB[2], xyz);

  return spectral_linear_to_srgb(vec3(r, g, b));
}

vec3 spectral_reflectance_to_xyz(float R[SPECTRAL_SIZE]) {
  vec3 xyz = vec3(0.0f);

  xyz += R[0] * vec3(0.00006469f, 0.00000184f, 0.00030502f);
  xyz += R[1] * vec3(0.00021941f, 0.00000621f, 0.00103681f);
  xyz += R[2] * vec3(0.00112057f, 0.00003101f, 0.00531314f);
  xyz += R[3] * vec3(0.00376661f, 0.00010475f, 0.01795439f);
  xyz += R[4] * vec3(0.01188055f, 0.00035364f, 0.05707758f);
  xyz += R[5] * vec3(0.02328644f, 0.00095147f, 0.11365162f);
  xyz += R[6] * vec3(0.03455942f, 0.00228226f, 0.17335873f);
  xyz += R[7] * vec3(0.03722379f, 0.00420733f, 0.19620658f);
  xyz += R[8] * vec3(0.03241838f, 0.00668880f, 0.18608237f);
  xyz += R[9] * vec3(0.02123321f, 0.00988840f, 0.13995048f);
  xyz += R[10] * vec3(0.01049099f, 0.01524945f, 0.08917453f);
  xyz += R[11] * vec3(0.00329584f, 0.02141831f, 0.04789621f);
  xyz += R[12] * vec3(0.00050704f, 0.03342293f, 0.02814563f);
  xyz += R[13] * vec3(0.00094867f, 0.05131001f, 0.01613766f);
  xyz += R[14] * vec3(0.00627372f, 0.07040208f, 0.00775910f);
  xyz += R[15] * vec3(0.01686462f, 0.08783871f, 0.00429615f);
  xyz += R[16] * vec3(0.02868965f, 0.09424905f, 0.00200551f);
  xyz += R[17] * vec3(0.04267481f, 0.09795667f, 0.00086147f);
  xyz += R[18] * vec3(0.05625475f, 0.09415219f, 0.00036904f);
  xyz += R[19] * vec3(0.06947040f, 0.08678102f, 0.00019143f);
  xyz += R[20] * vec3(0.08305315f, 0.07885653f, 0.00014956f);
  xyz += R[21] * vec3(0.08612610f, 0.06352670f, 0.00009231f);
  xyz += R[22] * vec3(0.09046614f, 0.05374142f, 0.00006813f);
  xyz += R[23] * vec3(0.08500387f, 0.04264606f, 0.00002883f);
  xyz += R[24] * vec3(0.07090667f, 0.03161735f, 0.00001577f);
  xyz += R[25] * vec3(0.05062889f, 0.02088521f, 0.00000394f);
  xyz += R[26] * vec3(0.03547396f, 0.01386011f, 0.00000158f);
  xyz += R[27] * vec3(0.02146821f, 0.00810264f, 0.00000000f);
  xyz += R[28] * vec3(0.01251646f, 0.00463010f, 0.00000000f);
  xyz += R[29] * vec3(0.00680458f, 0.00249138f, 0.00000000f);
  xyz += R[30] * vec3(0.00346457f, 0.00125930f, 0.00000000f);
  xyz += R[31] * vec3(0.00149761f, 0.00054165f, 0.00000000f);
  xyz += R[32] * vec3(0.00076970f, 0.00027795f, 0.00000000f);
  xyz += R[33] * vec3(0.00040737f, 0.00014711f, 0.00000000f);
  xyz += R[34] * vec3(0.00016901f, 0.00006103f, 0.00000000f);
  xyz += R[35] * vec3(0.00009522f, 0.00003439f, 0.00000000f);
  xyz += R[36] * vec3(0.00004903f, 0.00001771f, 0.00000000f);
  xyz += R[37] * vec3(0.00002000f, 0.00000722f, 0.00000000f);

  return xyz;
}

float spectral_linear_to_concentration(float l1, float l2, float t) {
  float t1 = l1 * pow(1.0f - t, 2.0f);
  float t2 = l2 * pow(t, 2.0f);

  return t2 / (t1 + t2);
}

vec3 spectral_mix(vec3 color1, vec3 color2, float t) {
  vec3 lrgb1 = spectral_srgb_to_linear(color1);
  vec3 lrgb2 = spectral_srgb_to_linear(color2);

  float R1[SPECTRAL_SIZE];
  float R2[SPECTRAL_SIZE];

  spectral_linear_to_reflectance(lrgb1, R1);
  spectral_linear_to_reflectance(lrgb2, R2);

  float l1 = spectral_reflectance_to_xyz(R1)[1];
  float l2 = spectral_reflectance_to_xyz(R2)[1];

  t = spectral_linear_to_concentration(l1, l2, t);

  float R[SPECTRAL_SIZE];

  for(int i = 0; i < SPECTRAL_SIZE; i++) {
    float KS = (1.0f - t) * (pow(1.0f - R1[i], 2.0f) / (2.0f * R1[i])) + t * (pow(1.0f - R2[i], 2.0f) / (2.0f * R2[i]));
    float KM = 1.0f + KS - sqrt(pow(KS, 2.0f) + 2.0f * KS);

      //Saunderson correction
      // let S = ((1.0 - K1) * (1.0 - K2) * KM) / (1.0 - K2 * KM);

    R[i] = KM;
  }

  return spectral_xyz_to_srgb(spectral_reflectance_to_xyz(R));
}

vec4 spectral_mix(vec4 color1, vec4 color2, float t) {
  return vec4(spectral_mix(color1.rgb, color2.rgb, t), mix(color1.a, color2.a, t));
}
