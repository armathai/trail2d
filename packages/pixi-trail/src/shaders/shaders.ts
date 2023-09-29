export const TRAIL_DEFAULT_VERTEX_SHADER = /* glsl */ `
precision highp float;

attribute vec2 aTextureCoord;

attribute vec4 aVertexData; // xy:prevNeighborNodePosition, zw:nextNeighborNodePosition
attribute vec2 aVertexPosition; // xy:nodePosition
attribute float aVertexId;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;
uniform float uTrailWidth;
uniform int uNodesCount;

varying vec2 vUvs;

vec2 calculateDirection(vec2 bone2D) {
    vec3 bone3D = vec3(bone2D, 0.0);
    vec3 normal = vec3(0.0, 0.0, 1.0);
    vec3 direction = cross(normal, normalize(bone3D));
    vec2 dir2D = direction.xy;

    return dir2D;
}

void main() {
    vUvs = aTextureCoord;
    float interpolation = 1.0;
    int nodeIndex = int(floor(aVertexId / 2.0));
    
    // Form nexBone and prevBone, considering that first and last points only has one of them
    vec2 prevBone2D = aVertexData.xy - aVertexPosition;
    vec2 nextBone2D = aVertexPosition - aVertexData.zw;
    if (nodeIndex == 0) {
        prevBone2D = nextBone2D;
    } else if (int(aVertexId) >= uNodesCount * 2) {
        nextBone2D = prevBone2D;
    }
    // ..........

    vec2 dir2DNext = normalize(calculateDirection(nextBone2D));
    vec2 dir2DPrev = normalize(calculateDirection(prevBone2D));
    vec2 dir2D = normalize(dir2DNext + dir2DPrev);

    float side = -(mod(aVertexId, 2.0) - 0.5) * 2.0; // equal to -1 or 1
    vec2 vertexPos = aVertexPosition + (side * dir2D) * uTrailWidth / 2.0 * interpolation;

    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(vertexPos.xy, 1.0)).xy, 0.0, 1.0);
}
`;

export const TRAIL_DEFAULT_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

varying vec2 vUvs;

uniform sampler2D uSampler;
uniform float uAlpha;
uniform vec4 uTint;

void main() {
  gl_FragColor = texture2D(uSampler, vUvs) * uAlpha * uTint;
}
`;

export const TRAIL_CUSTOMIZABLE_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

varying vec2 vUvs;

uniform sampler2D uSampler2;
uniform float uAlpha;
uniform vec4 uTint;

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
  
  gl_FragColor = latitudeColor * longitudeColor * longitudeAlpha * latitudinalAlpha * uAlpha * uTint;
}
`;
