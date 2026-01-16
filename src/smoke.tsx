import { useEffect, useRef } from 'react';

// Type definitions
interface Config {
  TEXTURE_DOWNSAMPLE: number;
  DENSITY_DISSIPATION: number;
  VELOCITY_DISSIPATION: number;
  PRESSURE_DISSIPATION: number;
  PRESSURE_ITERATIONS: number;
  CURL: number;
  SPLAT_RADIUS: number;
}

interface WebGLExtensions {
  internalFormat: number;
  internalFormatRG: number;
  formatRG: number;
  texType: number;
}

interface WebGLContextResult {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  ext: WebGLExtensions;
  support_linear_float: OES_texture_float_linear | null;
}

interface Pointer {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  down: boolean;
  moved: boolean;
  color: number[];
}

type FBO = [WebGLTexture, WebGLFramebuffer, number];

interface DoubleFBO {
  readonly first: FBO;
  readonly second: FBO;
  swap(): void;
}

class PointerPrototype implements Pointer {
  id: number = -1;
  x: number = 0;
  y: number = 0;
  dx: number = 0;
  dy: number = 0;
  down: boolean = false;
  moved: boolean = false;
  color: number[] = [30, 0, 300];
}

class GLProgram {
  uniforms: { [key: string]: WebGLUniformLocation | null } = {};
  program: WebGLProgram;
  gl: WebGLRenderingContext | WebGL2RenderingContext;

  constructor(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    this.gl = gl;
    this.program = gl.createProgram()!;

    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(this.program);
    }

    const uniformCount: number = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < uniformCount; i++) {
      const uniformName: string = gl.getActiveUniform(this.program, i)!.name;
      this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName);
    }
  }

  bind(): void {
    this.gl.useProgram(this.program);
  }
}

interface SmokeProps {
  onStop?: (stopFunction: () => void) => void; // Callback qui reçoit la fonction pour arrêter
}

export default function Smoke({ onStop }: SmokeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // ========================================
    // CONTRÔLES D'ANIMATION
    // ========================================
    const config: Config = {
      TEXTURE_DOWNSAMPLE: 1,
      
      // DENSITY_DISSIPATION: Plus le nombre est proche de 1, plus l'animation est lente (la fumée persiste)
      // Valeurs recommandées: 0.95 (très lent) à 0.99 (lent) - Défaut: 0.98
      DENSITY_DISSIPATION: 0.99,
      
      // VELOCITY_DISSIPATION: Contrôle la vitesse de déplacement de la fumée
      // Valeurs recommandées: 0.95 (rapide) à 0.99 (lent) - Défaut: 0.99
      VELOCITY_DISSIPATION: 0.99,
      
      PRESSURE_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 25,
      
      // CURL: Intensité des tourbillons (plus élevé = plus de mouvement)
      // Valeurs recommandées: 10 (faible) à 50 (fort) - Défaut: 30
      CURL: 30,
      
      SPLAT_RADIUS: 0.005
    };

    const pointers: Pointer[] = [];
    const splatStack: number[] = [];

    function getWebGLContext(canvas: HTMLCanvasElement): WebGLContextResult {
      const params: WebGLContextAttributes = {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false
      };

      let gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;

      const isWebGL2: boolean = !!gl;

      if (!isWebGL2) {
        gl = (canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params)) as WebGLRenderingContext | null;
      }

      if (!gl) {
        throw new Error("WebGL not supported");
      }

      const halfFloat = gl.getExtension("OES_texture_half_float");
      let support_linear_float = gl.getExtension("OES_texture_half_float_linear");

      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        support_linear_float = gl.getExtension("OES_texture_float_linear");
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      const internalFormat: number = isWebGL2 ? (gl as WebGL2RenderingContext).RGBA16F : gl.RGBA;
      const internalFormatRG: number = isWebGL2 ? (gl as WebGL2RenderingContext).RG16F : gl.RGBA;
      const formatRG: number = isWebGL2 ? (gl as WebGL2RenderingContext).RG : gl.RGBA;
      const texType: number = isWebGL2 ? (gl as WebGL2RenderingContext).HALF_FLOAT : halfFloat!.HALF_FLOAT_OES;

      return {
        gl: gl,
        ext: {
          internalFormat: internalFormat,
          internalFormatRG: internalFormatRG,
          formatRG: formatRG,
          texType: texType
        },
        support_linear_float: support_linear_float
      };
    }

    const _getWebGLContext: WebGLContextResult = getWebGLContext(canvas);
    const gl: WebGLRenderingContext | WebGL2RenderingContext = _getWebGLContext.gl;
    const ext: WebGLExtensions = _getWebGLContext.ext;
    const support_linear_float: OES_texture_float_linear | null = _getWebGLContext.support_linear_float;

    pointers.push(new PointerPrototype());

    function compileShader(type: number, source: string): WebGLShader {
      const shader: WebGLShader = gl.createShader(type)!;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(shader);
      }

      return shader;
    }

    const baseVertexShader: WebGLShader = compileShader(
      gl.VERTEX_SHADER,
      "precision highp float; precision mediump sampler2D; attribute vec2 aPosition; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform vec2 texelSize; void main () {     vUv = aPosition * 0.5 + 0.5;     vL = vUv - vec2(texelSize.x, 0.0);     vR = vUv + vec2(texelSize.x, 0.0);     vT = vUv + vec2(0.0, texelSize.y);     vB = vUv - vec2(0.0, texelSize.y);     gl_Position = vec4(aPosition, 0.0, 1.0); }"
    );

    const clearShader: WebGLShader = compileShader(
      gl.FRAGMENT_SHADER,
      "precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uTexture; uniform float value; void main () {     gl_FragColor = value * texture2D(uTexture, vUv); }"
    );

    const displayShader: WebGLShader = compileShader(
      gl.FRAGMENT_SHADER,
      "precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uTexture; void main () {     gl_FragColor = texture2D(uTexture, vUv); }"
    );

    const splatShader: WebGLShader = compileShader(
      gl.FRAGMENT_SHADER,
      "precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius; void main () {     vec2 p = vUv - point.xy;     p.x *= aspectRatio;     vec3 splat = exp(-dot(p, p) / radius) * color;     vec3 base = texture2D(uTarget, vUv).xyz;     gl_FragColor = vec4(base + splat, 1.0); }"
    );

    const advectionManualFilteringShader: WebGLShader = compileShader(
      gl.FRAGMENT_SHADER,
      "precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation; vec4 bilerp (in sampler2D sam, in vec2 p) {     vec4 st;     st.xy = floor(p - 0.5) + 0.5;     st.zw = st.xy + 1.0;     vec4 uv = st * texelSize.xyxy;     vec4 a = texture2D(sam, uv.xy);     vec4 b = texture2D(sam, uv.zy);     vec4 c = texture2D(sam, uv.xw);     vec4 d = texture2D(sam, uv.zw);     vec2 f = p - st.xy;     return mix(mix(a, b, f.x), mix(c, d, f.x), f.y); } void main () {     vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;     gl_FragColor = dissipation * bilerp(uSource, coord);     gl_FragColor.a = 1.0; }"
    );

    const advectionShader: WebGLShader = compileShader(
      gl.FRAGMENT_SHADER,
      "precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation; void main () {     vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;     gl_FragColor = dissipation * texture2D(uSource, coord); }"
    );

    const divergenceShader: WebGLShader = compileShader(
      gl.FRAGMENT_SHADER,
      "precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; vec2 sampleVelocity (in vec2 uv) {     vec2 multiplier = vec2(1.0, 1.0);     if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }     if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }     if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }     if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }     return multiplier * texture2D(uVelocity, uv).xy; } void main () {     float L = sampleVelocity(vL).x;     float R = sampleVelocity(vR).x;     float T = sampleVelocity(vT).y;     float B = sampleVelocity(vB).y;     float div = 0.5 * (R - L + T - B);     gl_FragColor = vec4(div, 0.0, 0.0, 1.0); }"
    );

    const curlShader: WebGLShader = compileShader(
      gl.FRAGMENT_SHADER,
      "precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; void main () {     float L = texture2D(uVelocity, vL).y;     float R = texture2D(uVelocity, vR).y;     float T = texture2D(uVelocity, vT).x;     float B = texture2D(uVelocity, vB).x;     float vorticity = R - L - T + B;     gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0); }"
    );

    const vorticityShader: WebGLShader = compileShader(
      gl.FRAGMENT_SHADER,
      "precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt; void main () {     float L = texture2D(uCurl, vL).y;     float R = texture2D(uCurl, vR).y;     float T = texture2D(uCurl, vT).x;     float B = texture2D(uCurl, vB).x;     float C = texture2D(uCurl, vUv).x;     vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L));     force *= 1.0 / length(force + 0.00001) * curl * C;     vec2 vel = texture2D(uVelocity, vUv).xy;     gl_FragColor = vec4(vel + force * dt, 0.0, 1.0); }"
    );

    const pressureShader: WebGLShader = compileShader(
      gl.FRAGMENT_SHADER,
      "precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uDivergence; vec2 boundary (in vec2 uv) {     uv = min(max(uv, 0.0), 1.0);     return uv; } void main () {     float L = texture2D(uPressure, boundary(vL)).x;     float R = texture2D(uPressure, boundary(vR)).x;     float T = texture2D(uPressure, boundary(vT)).x;     float B = texture2D(uPressure, boundary(vB)).x;     float C = texture2D(uPressure, vUv).x;     float divergence = texture2D(uDivergence, vUv).x;     float pressure = (L + R + B + T - divergence) * 0.25;     gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0); }"
    );

    const gradientSubtractShader: WebGLShader = compileShader(
      gl.FRAGMENT_SHADER,
      "precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uVelocity; vec2 boundary (in vec2 uv) {     uv = min(max(uv, 0.0), 1.0);     return uv; } void main () {     float L = texture2D(uPressure, boundary(vL)).x;     float R = texture2D(uPressure, boundary(vR)).x;     float T = texture2D(uPressure, boundary(vT)).x;     float B = texture2D(uPressure, boundary(vB)).x;     vec2 velocity = texture2D(uVelocity, vUv).xy;     velocity.xy -= vec2(R - L, T - B);     gl_FragColor = vec4(velocity, 0.0, 1.0); }"
    );

    let textureWidth: number;
    let textureHeight: number;
    let density: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;

    function createFBO(
      texId: number,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO {
      gl.activeTexture(gl.TEXTURE0 + texId);

      const texture: WebGLTexture = gl.createTexture()!;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo: WebGLFramebuffer = gl.createFramebuffer()!;

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return [texture, fbo, texId];
    }

    function createDoubleFBO(
      texId: number,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO {
      let fbo1: FBO = createFBO(texId, w, h, internalFormat, format, type, param);
      let fbo2: FBO = createFBO(texId + 1, w, h, internalFormat, format, type, param);

      return {
        get first(): FBO {
          return fbo1;
        },
        get second(): FBO {
          return fbo2;
        },
        swap(): void {
          const temp: FBO = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        }
      };
    }

    function initFramebuffers(): void {
      textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
      textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;

      const iFormat: number = ext.internalFormat;
      const iFormatRG: number = ext.internalFormatRG;
      const formatRG: number = ext.formatRG;
      const texType: number = ext.texType;

      density = createDoubleFBO(
        0,
        textureWidth,
        textureHeight,
        iFormat,
        gl.RGBA,
        texType,
        support_linear_float ? gl.LINEAR : gl.NEAREST
      );
      velocity = createDoubleFBO(
        2,
        textureWidth,
        textureHeight,
        iFormatRG,
        formatRG,
        texType,
        support_linear_float ? gl.LINEAR : gl.NEAREST
      );
      divergence = createFBO(
        4,
        textureWidth,
        textureHeight,
        iFormatRG,
        formatRG,
        texType,
        gl.NEAREST
      );
      curl = createFBO(
        5,
        textureWidth,
        textureHeight,
        iFormatRG,
        formatRG,
        texType,
        gl.NEAREST
      );
      pressure = createDoubleFBO(
        6,
        textureWidth,
        textureHeight,
        iFormatRG,
        formatRG,
        texType,
        gl.NEAREST
      );
    }

    initFramebuffers();

    const clearProgram: GLProgram = new GLProgram(gl, baseVertexShader, clearShader);
    const displayProgram: GLProgram = new GLProgram(gl, baseVertexShader, displayShader);
    const splatProgram: GLProgram = new GLProgram(gl, baseVertexShader, splatShader);
    const advectionProgram: GLProgram = new GLProgram(
      gl,
      baseVertexShader,
      support_linear_float ? advectionShader : advectionManualFilteringShader
    );
    const divergenceProgram: GLProgram = new GLProgram(gl, baseVertexShader, divergenceShader);
    const curlProgram: GLProgram = new GLProgram(gl, baseVertexShader, curlShader);
    const vorticityProgram: GLProgram = new GLProgram(gl, baseVertexShader, vorticityShader);
    const pressureProgram: GLProgram = new GLProgram(gl, baseVertexShader, pressureShader);
    const gradienSubtractProgram: GLProgram = new GLProgram(
      gl,
      baseVertexShader,
      gradientSubtractShader
    );

    const blit: (destination: WebGLFramebuffer | null) => void = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      return (destination: WebGLFramebuffer | null): void => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    let lastTime: number = Date.now();
    let animationFrameId: number;

    function splat(x: number, y: number, dx: number, dy: number, color: number[]): void {
      if (!canvas) return;
      
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.first[2]);
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(
        splatProgram.uniforms.point,
        x / canvas.width,
        1.0 - y / canvas.height
      );
      gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
      gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS);
      blit(velocity.second[1]);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, density.first[2]);
      gl.uniform3f(
        splatProgram.uniforms.color,
        color[0] * 0.03,  // Réduit de 0.1 à 0.03 pour moins d'opacité
        color[1] * 0.1,   // Réduit de 0.3 à 0.1
        color[2] * 0.1    // Réduit de 0.3 à 0.1
      );
      blit(density.second[1]);
      density.swap();
    }

    function resizeCanvas(): void {
      if (!canvas) return;
      
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        initFramebuffers();
      }
    }

    function update(): void {
      if (!canvas) return;
      
      resizeCanvas();

      const dt: number = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      gl.viewport(0, 0, textureWidth, textureHeight);

      if (splatStack.length > 0) {
        for (let m = 0; m < splatStack.pop()!; m++) {
          const color: number[] = [Math.random() * 10, Math.random() * 10, Math.random() * 10];
          const x: number = canvas.width * Math.random();
          const y: number = canvas.height * Math.random();
          const dx: number = 1000 * (Math.random() - 0.5);
          const dy: number = 1000 * (Math.random() - 0.5);

          splat(x, y, dx, dy, color);
        }
      }

      advectionProgram.bind();
      gl.uniform2f(
        advectionProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.first[2]);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.first[2]);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.VELOCITY_DISSIPATION
      );
      blit(velocity.second[1]);
      velocity.swap();

      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.first[2]);
      gl.uniform1i(advectionProgram.uniforms.uSource, density.first[2]);
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.DENSITY_DISSIPATION
      );
      blit(density.second[1]);
      density.swap();

      for (let i = 0, len = pointers.length; i < len; i++) {
        const pointer: Pointer = pointers[i];

        if (pointer.moved) {
          splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
          pointer.moved = false;
        }
      }

      curlProgram.bind();
      gl.uniform2f(
        curlProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.first[2]);
      blit(curl[1]);

      vorticityProgram.bind();
      gl.uniform2f(
        vorticityProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.first[2]);
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl[2]);
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.second[1]);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(
        divergenceProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.first[2]);
      blit(divergence[1]);

      clearProgram.bind();

      let pressureTexId: number = pressure.first[2];

      gl.activeTexture(gl.TEXTURE0 + pressureTexId);
      gl.bindTexture(gl.TEXTURE_2D, pressure.first[0]);
      gl.uniform1i(clearProgram.uniforms.uTexture, pressureTexId);
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
      blit(pressure.second[1]);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(
        pressureProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence[2]);
      pressureTexId = pressure.first[2];
      gl.activeTexture(gl.TEXTURE0 + pressureTexId);

      for (let _i = 0; _i < config.PRESSURE_ITERATIONS; _i++) {
        gl.bindTexture(gl.TEXTURE_2D, pressure.first[0]);
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressureTexId);
        blit(pressure.second[1]);
        pressure.swap();
      }

      gradienSubtractProgram.bind();
      gl.uniform2f(
        gradienSubtractProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.first[2]);
      gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.first[2]);
      blit(velocity.second[1]);
      velocity.swap();

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      displayProgram.bind();
      gl.uniform1i(displayProgram.uniforms.uTexture, density.first[2]);
      blit(null);

      animationFrameId = requestAnimationFrame(update);
    }

    // ========================================
    // GÉNÉRATEUR DE MOUVEMENT AUTOMATIQUE
    // ========================================
    
    // Position et direction initiales aléatoires (SEULEMENT AU DÉBUT)
    let autoX: number = Math.random() * canvas.width;
    let autoY: number = Math.random() * canvas.height;
    let autoDX: number = (Math.random() - 0.5) * 80;
    let autoDY: number = (Math.random() - 0.5) * 80;
    
    // Angle pour créer un mouvement sinusoïdal fluide
    let angle: number = Math.random() * Math.PI * 2;
    
    let count: number = 0;
    let colorArr: number[] = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];

    // Fonction pour générer un mouvement automatique fluide
    function updateAutoMovement(): void {
      // Change la couleur périodiquement
      count++;
      if (count > 25) {
        colorArr = [
          Math.random() + 0.2,
          Math.random() + 0.2,
          Math.random() + 0.2
        ];
        count = 0;
      }

      // Mouvement sinusoïdal continu (comme une vague) - AUCUN ALÉATOIRE
      angle += 0.02; // Vitesse de rotation
      
      // Ajoute une variation sinusoïdale à la direction
      const waveX = Math.sin(angle) * 2;
      const waveY = Math.cos(angle * 0.7) * 2; // Fréquence différente pour Y
      
      autoDX += waveX;
      autoDY += waveY;

      // Déplace le point
      autoX += autoDX * 0.05;
      autoY += autoDY * 0.05;

      // Rebond sur les bords (réflexion simple)
      if (autoX < 0) {
        autoX = 0;
        autoDX = Math.abs(autoDX);
      }
      if (autoX > canvas.width) {
        autoX = canvas.width;
        autoDX = -Math.abs(autoDX);
      }
      if (autoY < 0) {
        autoY = 0;
        autoDY = Math.abs(autoDY);
      }
      if (autoY > canvas.height) {
        autoY = canvas.height;
        autoDY = -Math.abs(autoDY);
      }

      // Applique le mouvement au pointeur
      pointers[0].down = true;
      pointers[0].color = colorArr;
      pointers[0].moved = true;
      pointers[0].dx = autoDX;
      pointers[0].dy = autoDY;
      pointers[0].x = autoX;
      pointers[0].y = autoY;
    }

    // Intervalle pour générer le mouvement automatique
    const autoMovementInterval = setInterval(updateAutoMovement, 16); // ~60fps

    update();

    // Fonction pour arrêter l'animation (exposée au parent via callback)
    const stopAnimation = () => {
      clearInterval(autoMovementInterval);
      cancelAnimationFrame(animationFrameId);
    };

    // Envoie la fonction d'arrêt au parent
    if (onStop) {
      onStop(stopAnimation);
    }

    // Cleanup
    return () => {
      clearInterval(autoMovementInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onStop]);

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />
  );
}
