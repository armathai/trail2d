export const TRAIL_DEFAULT_VERTEX_SHADER = /* glsl */ `
precision highp float;

attribute vec2 aTextureCoord;

attribute vec4 aVertexData; // xy:nodePosition, zw:neighborNodePosition
attribute float aVertexId;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;
uniform float uTrailWidth;
uniform int uNodesCount;

varying vec2 vUvs;

void main() {
    vUvs = aTextureCoord;
    int nodeIndex = int(floor(aVertexId / 2.0));
    vec2 nodePosition = aVertexData.xy;
    vec2 neighborNodePosition = aVertexData.zw;
    
    vec2 bone2D;
    
    if (int(aVertexId) == uNodesCount * 2 || int(aVertexId) == (uNodesCount * 2 + 1)) {
      bone2D = nodePosition - neighborNodePosition;
    } else {
      bone2D = neighborNodePosition - nodePosition;
    }

    vec3 bone3D = vec3(bone2D, 0.0);
    vec3 normal = vec3(0.0, 0.0, 1.0);
    vec3 direction = cross(normal, normalize(bone3D));
    vec2 dir2D = direction.xy;
    float interpolation = 1.0;

    vec2 vertexPos;

    if (mod(aVertexId, 2.0) == 0.0) {
        vertexPos = nodePosition - dir2D * uTrailWidth / 2.0 * interpolation;
    } else {
        vertexPos = nodePosition + dir2D * uTrailWidth / 2.0 * interpolation;
    }


    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(vertexPos.xy, 1.0)).xy, 0.0, 1.0);
}
`;

export const TRAIL_DEFAULT_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

varying vec2 vUvs;

uniform sampler2D uSampler;

void main() {
  gl_FragColor = texture2D(uSampler, vUvs);
}
`;

export const TRAIL_CUSTOMIZABLE_VERTEX_SHADER = /* glsl */ `
precision highp float;

attribute vec2 aTextureCoord;
attribute vec4 aVertexData;
attribute float aVertexId;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;
uniform float uTrailWidth;
uniform bool uSharpness;
uniform int uNodesCount;

varying vec2 vUvs;

void main() {
    vUvs = aTextureCoord;
    int nodeIndex = int(floor(aVertexId / 2.0));
    vec2 nodePosition = aVertexData.xy;
    vec2 neighborNodePosition = aVertexData.zw;
    
    vec2 bone2D;
    
    if (int(aVertexId) == uNodesCount * 2 || int(aVertexId) == (uNodesCount * 2 + 1)) {
      bone2D = nodePosition - neighborNodePosition;
    } else {
      bone2D = neighborNodePosition - nodePosition;
    }

    vec3 bone3D = vec3(bone2D, 0.0);
    vec3 normal = vec3(0.0, 0.0, 1.0);
    vec3 direction = cross(normal, normalize(bone3D));
    vec2 dir2D = direction.xy;
    float interpolation = 1.0;

    if (uSharpness) {
        interpolation = pow(float(nodeIndex) / float(uNodesCount), 1.0 / 2.0);
    }

    vec2 vertexPos;

    if (mod(aVertexId, 2.0) == 0.0) {
        vertexPos = nodePosition - dir2D * uTrailWidth / 2.0 * interpolation;
    } else {
        vertexPos = nodePosition + dir2D * uTrailWidth / 2.0 * interpolation;
    }


    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(vertexPos.xy, 1.0)).xy, 0.0, 1.0);
}
`;

export const TRAIL_CUSTOMIZABLE_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

varying vec2 vUvs;

uniform sampler2D uSampler2;

uniform vec4 latitudeColorA;
uniform vec4 latitudeColorB;
uniform vec4 longitudeColorA;
uniform vec4 longitudeColorB;
uniform float colorStart;
uniform float colorEnd;
uniform float offset;
uniform float linesCount;
uniform bool rough;
uniform float colorsProportions;
uniform float longitudeAlphaIntensity;
uniform float latitudeAlphaIntensity;


float inverseLerp(float a, float b, float v) {
  return (v - a)/(b - a);
}

void main() {
  float t = inverseLerp(colorStart, colorEnd, vUvs.y);
  t = abs(fract(t * linesCount + offset) * 2.0 - 1.0);
  
  if (rough) {
    if (t > colorsProportions) {
      t = ceil(t);
    } else {
      t = floor(t);
    }
  }

  float latitudinalAlpha = 1.0;
  if(latitudeAlphaIntensity != 0.0) {
    latitudinalAlpha = (1.0 - abs(vUvs.y * latitudeAlphaIntensity - latitudeAlphaIntensity / 2.0));
  }

  float longitudeAlpha = 1.0;
  if(longitudeAlphaIntensity != 0.0) {
    longitudeAlpha = (vUvs.x * longitudeAlphaIntensity);
  }
  
  vec4 latitudeColor = mix(latitudeColorA, latitudeColorB, t);

  vec4 longitudeColor = mix(longitudeColorA, longitudeColorB, 1.0 - vUvs.x);
  
  gl_FragColor = latitudeColor * longitudeColor * longitudeAlpha * latitudinalAlpha;
}
`;
