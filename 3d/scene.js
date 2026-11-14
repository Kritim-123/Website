import * as THREE from "./vendor/three.module.min.js";

const mint = 0xb8f0d4;
const copper = 0xedac77;
const TAU = Math.PI * 2;

function material(color, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.55,
    roughness: 0.35,
    ...extra,
  });
}
function mesh(geometry, surface, parent, position = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, surface);
  object.position.set(...position);
  parent.add(object);
  return object;
}
function ring(
  parent,
  radius,
  thickness,
  color,
  rotation = [0, 0, 0],
  arc = TAU,
) {
  const object = mesh(
    new THREE.TorusGeometry(radius, thickness, 10, 128, arc),
    material(color),
    parent,
  );
  object.rotation.set(...rotation);
  return object;
}
function link(parent, start, end, color = 0x548e75, radius = 0.012) {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const direction = b.clone().sub(a);
  const object = mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), 8),
    material(color),
    parent,
  );
  object.position.copy(a.add(b).multiplyScalar(0.5));
  object.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize(),
  );
  return object;
}
function dot(parent, position, size = 0.075, color = mint) {
  return mesh(
    new THREE.SphereGeometry(size, 20, 16),
    material(color, { emissive: color, emissiveIntensity: 0.13 }),
    parent,
    position,
  );
}
function core() {
  const group = new THREE.Group();
  mesh(
    new THREE.SphereGeometry(1.03, 64, 40),
    material(0x224c43, { roughness: 0.3, metalness: 0.65 }),
    group,
  );
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.055, 2)),
    new THREE.LineBasicMaterial({
      color: 0x6ab29a,
      transparent: true,
      opacity: 0.24,
    }),
  );
  group.add(wire);
  for (let i = -3; i <= 3; i++) {
    const y = i * 0.225;
    const radius = Math.sqrt(1.1 ** 2 - y ** 2);
    const latitude = ring(
      group,
      radius,
      i === 0 ? 0.035 : 0.012,
      i === 0 ? mint : 0x4c796b,
      [Math.PI / 2, 0, 0],
    );
    latitude.position.y = y;
  }
  ring(group, 1.43, 0.025, 0xa2b6af, [0.4, 0.6, 0.5]);
  ring(group, 1.8, 0.012, 0x4b8e73, [1.05, -0.2, -0.4]);
  ring(group, 1.8, 0.045, mint, [1.05, -0.2, -0.4], 1.9);
  ring(group, 2.05, 0.014, 0x587464, [0.3, 0.8, 0.2]);
  ring(group, 2.05, 0.028, copper, [0.3, 0.8, 0.2], 0.7);
  ring(group, 1.43, 0.055, copper, [0.4, 0.6, 0.5], 0.5);
  const satellites = [
    [1.65, 0.85, 0.9],
    [-1.7, -0.65, 0.85],
    [0.4, 1.5, -1.35],
    [-0.2, -1.65, -0.55],
  ];
  satellites.forEach((point, i) => {
    dot(group, point, i === 0 ? 0.13 : 0.07, i % 2 ? copper : mint);
    if (i === 0) {
      const marker = mesh(
        new THREE.OctahedronGeometry(0.25),
        material(0x9ccbb8, { wireframe: true }),
        group,
        point,
      );
      marker.rotation.z = 0.5;
    }
  });
  const accents = new THREE.Group();
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * TAU;
    const tick = mesh(
      new THREE.BoxGeometry(i % 4 ? 0.016 : 0.03, i % 4 ? 0.055 : 0.1, 0.025),
      material(i % 4 ? 0x537d69 : mint),
      accents,
      [Math.cos(angle) * 2.27, Math.sin(angle) * 2.27, 0],
    );
    tick.rotation.z = angle - Math.PI / 2;
  }
  accents.rotation.set(0.3, 0.8, 0.2);
  group.add(accents);
  group.rotation.z = -0.15;
  return group;
}

function gradpath() {
  const group = new THREE.Group();
  mesh(
    new THREE.OctahedronGeometry(0.58, 0),
    material(0x91d5b0, { metalness: 0.65, roughness: 0.22 }),
    group,
  );
  mesh(
    new THREE.OctahedronGeometry(0.7, 0),
    material(0x8ccaab, { wireframe: true, transparent: true, opacity: 0.35 }),
    group,
  );
  const points = [
    [-1.35, 0.8, 0.2],
    [1.45, 0.55, 0.1],
    [0.6, -1.1, 1],
    [-0.9, -0.8, -0.65],
    [0.5, 1.4, -0.8],
    [-1.5, -0.5, 0.75],
    [1.3, -0.65, -0.8],
  ];
  points.forEach((position, i) => {
    dot(group, position, i % 3 === 0 ? 0.16 : 0.1, i % 3 === 0 ? copper : mint);
    link(group, [0, 0, 0], position);
    if (i > 0) link(group, points[i - 1], position, 0x355f4d, 0.006);
    const halo = ring(
      group,
      0.22,
      0.009,
      i % 3 === 0 ? copper : mint,
      [0, 0.3, 0],
    );
    halo.position.set(...position);
  });
  ring(group, 1.9, 0.01, 0x527e67, [Math.PI / 2.8, 0.1, 0.2]);
  ring(group, 1.9, 0.025, mint, [Math.PI / 2.8, 0.1, 0.2], 1);
  return group;
}
function bvi() {
  const group = new THREE.Group();
  ring(group, 1.22, 0.16, 0x304b42, [Math.PI / 2, 0, 0]);
  const trim = ring(group, 1.22, 0.018, mint, [Math.PI / 2, 0, 0]);
  trim.position.y = 0.12;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * TAU;
    const position = [Math.cos(angle) * 1.23, 0.04, Math.sin(angle) * 1.23];
    const actuator = mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.27, 24),
      material(i < 3 ? mint : copper),
      group,
      position,
    );
    actuator.rotation.z = Math.PI / 2;
    actuator.rotation.y = -angle;
  }
  for (let i = -1; i <= 1; i++) {
    const angle = i * 0.55;
    const x = Math.sin(angle) * 1.18,
      z = Math.cos(angle) * 1.18;
    const sensor = mesh(
      new THREE.BoxGeometry(0.32, 0.22, 0.16),
      material(0xb6c4ba),
      group,
      [x, 0.1, z],
    );
    sensor.rotation.y = angle;
    dot(group, [x, 0.1, z + 0.1], 0.06, 0x29473a);
    for (let r = 1; r <= 3; r++) {
      const arc = ring(
        group,
        0.15 + r * 0.12,
        0.006,
        0x5f977c,
        [0, angle, 0],
        Math.PI * 1.4,
      );
      arc.position.set(x, 0.1, z + 0.3 + r * 0.13);
      arc.rotation.z = -0.6;
    }
  }
  mesh(
    new THREE.BoxGeometry(0.45, 0.22, 0.38),
    material(0x152b21),
    group,
    [0, -0.02, -1.22],
  );
  group.rotation.x = 0.35;
  return group;
}
function dogbridge() {
  const group = new THREE.Group();
  for (let layer = 0; layer < 4; layer++) {
    const points = [];
    for (let i = 0; i < 100; i++) {
      const x = (i / 99) * 3.5 - 1.75;
      const envelope = Math.exp(-x * x * 0.8);
      points.push(
        new THREE.Vector3(
          x,
          Math.sin(x * 7 + layer * 0.7) * envelope * 0.8,
          (layer - 1.5) * 0.32,
        ),
      );
    }
    mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        128,
        0.025,
        8,
        false,
      ),
      material(layer % 2 ? 0x5c8a73 : mint),
      group,
    );
  }
  [-1, 1].forEach((side) => {
    ring(group, 0.62, 0.055, side === -1 ? copper : mint, [
      0,
      Math.PI / 2,
      0,
    ]).position.x = side * 1.9;
    dot(group, [side * 1.9, 0, 0], 0.17, side === -1 ? copper : mint);
  });
  return group;
}
function triage() {
  const group = new THREE.Group();
  const positions = [
    [-1.45, 0.55, 0],
    [0, -0.05, 0.35],
    [1.45, 0.55, 0],
  ];
  positions.forEach((position, i) => {
    const body = mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      material(i === 1 ? 0x3b6952 : 0x7e9d8c),
      group,
      position,
    );
    body.rotation.set(0.2, 0.3, 0.12);
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(body.geometry),
      new THREE.LineBasicMaterial({ color: i === 1 ? copper : mint }),
    );
    body.add(outline);
    dot(
      group,
      [position[0], position[1], position[2] + 0.42],
      0.08,
      i === 1 ? copper : mint,
    );
    if (i > 0) link(group, positions[i - 1], position, 0x87bd9d, 0.025);
  });
  [
    [-1.8, -0.8, 0.2],
    [-1.25, -1.1, -0.4],
    [-0.7, -0.85, 0.65],
  ].forEach((p) => {
    mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), material(0x5d8b72), group, p);
    link(group, p, positions[0], 0x335946, 0.01);
  });
  ring(group, 1.05, 0.008, 0x618d76, [Math.PI / 2, 0, 0]).position.y = -1;
  return group;
}
function robotics() {
  const group = new THREE.Group();
  mesh(
    new THREE.CylinderGeometry(0.8, 0.95, 0.22, 48),
    material(0x263d33),
    group,
    [0, -1.2, 0],
  );
  ring(group, 0.86, 0.018, mint, [Math.PI / 2, 0, 0]).position.y = -1.13;
  const joints = [
    [0, -0.95, 0],
    [-0.35, 0.1, 0],
    [0.65, 0.8, 0],
    [1.05, 0.35, 0],
  ];
  joints.forEach((p, i) => {
    dot(group, p, i === 3 ? 0.15 : 0.21, i === 1 ? copper : 0xa7c6b4);
    if (i) link(group, joints[i - 1], p, 0x668f77, 0.14);
    if (i < 3) {
      const cap = mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.42, 32),
        material(0x203b2b),
        group,
        p,
      );
      cap.rotation.x = Math.PI / 2;
    }
  });
  link(group, joints[3], [0.83, -0.05, 0], mint, 0.06);
  link(group, joints[3], [1.32, -0.05, 0], mint, 0.06);
  link(group, [0.83, -0.05, 0], [0.97, -0.2, 0], mint, 0.055);
  link(group, [1.32, -0.05, 0], [1.18, -0.2, 0], mint, 0.055);
  mesh(
    new THREE.OctahedronGeometry(0.16),
    material(copper),
    group,
    [1.07, -0.4, 0],
  );
  group.rotation.y = -0.25;
  return group;
}

const builders = { core, gradpath, bvi, dogbridge, triage, robotics };
function release(group) {
  const geometries = new Set(),
    materials = new Set();
  group.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material)
      (Array.isArray(object.material)
        ? object.material
        : [object.material]
      ).forEach((m) => materials.add(m));
  });
  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
}

export function createScene(element, name = "core", paused = false) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  element.append(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");
  element.tabIndex = 0;
  element.setAttribute(
    "aria-description",
    "Drag horizontally or use the arrow keys to rotate. Press Home to reset.",
  );

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 50);
  camera.position.set(
    0,
    name === "core" ? 0.8 : 1.3,
    name === "core" ? 8.6 : 7.4,
  );
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xe0fff2, 0x101b28, 2));
  const key = new THREE.DirectionalLight(0xd5ffe7, 5);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x64b7a1, 3);
  fill.position.set(4, 1, -2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xf4b67f, 3);
  rim.position.set(-4, -2, -2);
  scene.add(rim);
  const pivot = new THREE.Group();
  scene.add(pivot);
  let model = builders[name]();
  pivot.add(model);

  if (name === "core") {
    const positions = [];
    // A deterministic sparse field keeps reloads visually stable.
    for (let i = 0; i < 140; i++) {
      const a = i * 2.399963;
      const radius = 2.8 + ((i % 23) / 23) * 2;
      positions.push(
        Math.cos(a) * radius,
        Math.sin(a) * radius,
        -2 - (i % 7) * 0.2,
      );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    scene.add(
      new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          color: 0x83b7a0,
          size: 0.018,
          transparent: true,
          opacity: 0.6,
          sizeAttenuation: true,
        }),
      ),
    );
  }

  let frame = 0,
    previous = 0,
    rotation = 0,
    yaw = -0.35,
    pitch = 0.12;
  let targetYaw = yaw,
    targetPitch = pitch,
    visible = true,
    contextReady = true,
    disposed = false;
  let pointer = null;
  function render() {
    if (!disposed && contextReady) renderer.render(scene, camera);
  }
  function animate(time) {
    frame = 0;
    if (disposed || !visible || document.hidden || !contextReady) return;
    const delta = Math.min((time - (previous || time)) / 1000, 0.05);
    previous = time;
    if (!paused && pointer === null)
      rotation += delta * (name === "core" ? 0.065 : 0.08);
    const easing = paused ? 1 : 0.12;
    yaw += (targetYaw - yaw) * easing;
    pitch += (targetPitch - pitch) * easing;
    pivot.rotation.set(pitch, yaw + rotation, 0);
    if (!paused) pivot.position.y = Math.sin(time * 0.0005) * 0.045;
    render();
    if (
      !paused ||
      Math.abs(yaw - targetYaw) > 0.001 ||
      Math.abs(pitch - targetPitch) > 0.001
    )
      frame = requestAnimationFrame(animate);
  }
  function wake() {
    if (!frame && !disposed && visible && !document.hidden)
      frame = requestAnimationFrame(animate);
  }
  function resize() {
    const { width, height } = element.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z =
      (name === "core" ? 8.6 : 7.4) * Math.max(1, 0.85 / camera.aspect);
    camera.updateProjectionMatrix();
    render();
    wake();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(element);
  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      previous = 0;
      if (visible) wake();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: "100px" },
  );
  visibilityObserver.observe(element);
  const abort = new AbortController();
  const events = { signal: abort.signal };
  element.addEventListener(
    "pointerdown",
    (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      element.setPointerCapture(event.pointerId);
      element.classList.add("dragging");
    },
    events,
  );
  element.addEventListener(
    "pointermove",
    (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      targetYaw += (event.clientX - pointer.x) * 0.008;
      targetPitch = THREE.MathUtils.clamp(
        targetPitch + (event.clientY - pointer.y) * 0.006,
        -0.8,
        0.8,
      );
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      wake();
    },
    events,
  );
  function endDrag() {
    pointer = null;
    element.classList.remove("dragging");
  }
  element.addEventListener("pointerup", endDrag, events);
  element.addEventListener("pointercancel", endDrag, events);
  element.addEventListener("lostpointercapture", endDrag, events);
  function reset() {
    targetYaw = -0.35;
    targetPitch = 0.12;
    rotation = 0;
    wake();
  }
  element.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Home") {
        event.preventDefault();
        reset();
        return;
      }
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      )
        return;
      event.preventDefault();
      if (event.key === "ArrowLeft") targetYaw -= 0.15;
      if (event.key === "ArrowRight") targetYaw += 0.15;
      if (event.key === "ArrowUp") targetPitch -= 0.12;
      if (event.key === "ArrowDown") targetPitch += 0.12;
      targetPitch = THREE.MathUtils.clamp(targetPitch, -0.8, 0.8);
      wake();
    },
    events,
  );
  document.addEventListener(
    "visibilitychange",
    () => {
      previous = 0;
      if (!document.hidden) wake();
    },
    events,
  );
  renderer.domElement.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
      contextReady = false;
      element.classList.remove("webgl-ready");
      element.dispatchEvent(
        new CustomEvent("scene-unavailable", { bubbles: true }),
      );
    },
    events,
  );
  renderer.domElement.addEventListener(
    "webglcontextrestored",
    () => {
      contextReady = true;
      element.classList.add("webgl-ready");
      wake();
    },
    events,
  );
  resize();
  element.classList.add("webgl-ready");
  wake();
  return {
    reset,
    setPaused(value) {
      paused = value;
      previous = 0;
      wake();
    },
    setModel(value) {
      if (!builders[value]) return;
      pivot.remove(model);
      release(model);
      model = builders[value]();
      pivot.add(model);
      reset();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      abort.abort();
      release(scene);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
