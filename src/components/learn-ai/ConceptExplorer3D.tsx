import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useApp } from '../../context/AppContext';
import {
  Boxes,
  RotateCcw,
  Sparkles,
  Layers,
  Cpu,
  Eye,
  Maximize2,
  Info,
  ChevronDown,
  ChevronUp,
  Activity,
  Sliders,
  Compass,
} from 'lucide-react';

type ModelSubject = 'quantum' | 'dna' | 'transformer';

export const ConceptExplorer3D: React.FC = () => {
  const { addXp, unlockBadge } = useApp();
  const mountRef = useRef<HTMLDivElement>(null);

  const [activeSubject, setActiveSubject] = useState<ModelSubject>('quantum');
  const [isExploded, setIsExploded] = useState(false);
  const [explosionFactor, setExplosionFactor] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [fps, setFps] = useState(60);

  // References to communicate with Three.js animation loop without re-triggering scene creation
  const explosionRef = useRef(0);
  const autoRotateRef = useRef(true);
  const wireframeRef = useRef(false);
  const subjectGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const explodedPartsRef = useRef<Array<{ mesh: THREE.Object3D; originalPos: THREE.Vector3; explodeDir: THREE.Vector3 }>>([]);

  useEffect(() => {
    unlockBadge('b-6'); // Cosmic Knowledge Seeker
  }, [unlockBadge]);

  useEffect(() => {
    explosionRef.current = explosionFactor;
  }, [explosionFactor]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    wireframeRef.current = wireframe;
    for (const mat of materialsRef.current) {
      mat.wireframe = wireframe;
    }
  }, [wireframe]);

  // Procedural bump & roughness canvas texture generator
  const createProceduralCircuitTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      for (let i = 0; i < 256; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 256);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(256, i);
        ctx.stroke();
      }
      ctx.fillStyle = '#06b6d4';
      for (let x = 16; x < 256; x += 64) {
        for (let y = 16; y < 256; y += 64) {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  };

  // Procedural soft radial contact shadow texture
  const createContactShadowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(2, 6, 23, 0.85)');
      grad.addColorStop(0.5, 'rgba(2, 6, 23, 0.4)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(canvas);
  };

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.04);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 6.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Studio PBR Lighting & Environment
    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(environment).texture;

    const keyLight = new THREE.DirectionalLight(0xfff1e0, 2.2);
    keyLight.position.set(5, 8, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x0ea5e9, 0x050914, 1.2);
    scene.add(hemiLight);

    const corePointLight = new THREE.PointLight(0x06b6d4, 1.8, 8);
    corePointLight.position.set(0, 1.5, 0);
    scene.add(corePointLight);

    // 3. Ground Plane with Radial Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -0.01;
    scene.add(contactShadow);

    // Subtle Ground Grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x0284c7, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 4. Smooth Damped Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't dip below ground
    controls.minDistance = 3;
    controls.maxDistance = 12;
    controls.target.set(0, 1.2, 0);

    // 5. Procedural Model Builders (Composite 3-12 parts per model)
    const proceduralCircuit = createProceduralCircuitTexture();
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    subjectGroupRef.current = modelGroup;

    materialsRef.current = [];
    explodedPartsRef.current = [];

    const registerPart = (mesh: THREE.Object3D, explodeDir: THREE.Vector3) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      modelGroup.add(mesh);
      explodedPartsRef.current.push({
        mesh,
        originalPos: mesh.position.clone(),
        explodeDir: explodeDir.normalize(),
      });
    };

    // Shared Materials
    const metalDarkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.85,
      bumpMap: proceduralCircuit,
      bumpScale: 0.02,
    });
    const metalCyanMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.9,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.8,
    });
    const glowCyanMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.3,
    });
    const glowVioletMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.3,
    });

    materialsRef.current.push(metalDarkMat, metalCyanMat, goldMat, glowCyanMat, glowVioletMat);

    // BUILD ACTIVE SUBJECT
    if (activeSubject === 'quantum') {
      // 10-PART COMPOSITE: Quantum Superconducting Qubit & Particle Waveguide
      // Part 1: Cryogenic Platform Base (Beveled Cylinder)
      const baseGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.25, 48);
      const baseMesh = new THREE.Mesh(baseGeo, metalDarkMat);
      baseMesh.position.set(0, 0.125, 0);
      registerPart(baseMesh, new THREE.Vector3(0, -1, 0));

      // Part 2: Toroidal Superconducting Waveguide Ring
      const torusGeo = new THREE.TorusGeometry(1.2, 0.12, 24, 64);
      const torusMesh = new THREE.Mesh(torusGeo, metalCyanMat);
      torusMesh.rotation.x = Math.PI / 2;
      torusMesh.position.set(0, 1.2, 0);
      registerPart(torusMesh, new THREE.Vector3(0, 0, 0));

      // Part 3-6: 4 Quadrupole Magnetic Focusing Coils
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const coilGeo = new THREE.BoxGeometry(0.35, 0.45, 0.25);
        const coilMesh = new THREE.Mesh(coilGeo, goldMat);
        const x = Math.cos(angle) * 1.2;
        const z = Math.sin(angle) * 1.2;
        coilMesh.position.set(x, 1.2, z);
        coilMesh.rotation.y = -angle;
        registerPart(coilMesh, new THREE.Vector3(x, 0, z));
      }

      // Part 7: Central Resonator Qubit Cavity (Icosahedron)
      const qubitGeo = new THREE.IcosahedronGeometry(0.4, 2);
      const qubitMesh = new THREE.Mesh(qubitGeo, glowCyanMat);
      qubitMesh.position.set(0, 1.2, 0);
      registerPart(qubitMesh, new THREE.Vector3(0, 1.5, 0));

      // Part 8: Upper Magnetic Shield Cap
      const capGeo = new THREE.ConeGeometry(0.8, 0.4, 32);
      const capMesh = new THREE.Mesh(capGeo, metalDarkMat);
      capMesh.position.set(0, 2.1, 0);
      registerPart(capMesh, new THREE.Vector3(0, 2, 0));

      // Part 9: 3 Support Pillars
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const pillarGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.8, 16);
        const pillarMesh = new THREE.Mesh(pillarGeo, metalDarkMat);
        const px = Math.cos(angle) * 1.45;
        const pz = Math.sin(angle) * 1.45;
        pillarMesh.position.set(px, 0.9, pz);
        registerPart(pillarMesh, new THREE.Vector3(px, 0, pz));
      }

      // Part 10: Laser Excitation Needle
      const needleGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.7, 16);
      const needleMesh = new THREE.Mesh(needleGeo, glowVioletMat);
      needleMesh.position.set(0, 0.6, 0);
      registerPart(needleMesh, new THREE.Vector3(0, -1, 0));

    } else if (activeSubject === 'dna') {
      // 12-PART COMPOSITE: Double Helix Molecular Nanomachine
      // Part 1: Heavy Pedestal Mount
      const pedGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.2, 32);
      const pedMesh = new THREE.Mesh(pedGeo, metalDarkMat);
      pedMesh.position.set(0, 0.1, 0);
      registerPart(pedMesh, new THREE.Vector3(0, -1, 0));

      // Parts 2-9: Helical Nucleotide Base-Pair Rungs (Rotated Slabs)
      const rungCount = 12;
      for (let i = 0; i < rungCount; i++) {
        const heightY = 0.35 + i * 0.18;
        const angle = i * 0.48;

        const rungGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 12);
        const rungMesh = new THREE.Mesh(
          rungGeo,
          i % 2 === 0 ? glowCyanMat : glowVioletMat
        );
        rungMesh.position.set(0, heightY, 0);
        rungMesh.rotation.z = Math.PI / 2;
        rungMesh.rotation.y = angle;

        // Spherical Nucleotide nodes at ends
        const nodeGeo = new THREE.SphereGeometry(0.09, 16, 16);
        const nodeA = new THREE.Mesh(nodeGeo, goldMat);
        nodeA.position.set(0.55, 0, 0);
        rungMesh.add(nodeA);

        const nodeB = new THREE.Mesh(nodeGeo, metalCyanMat);
        nodeB.position.set(-0.55, 0, 0);
        rungMesh.add(nodeB);

        registerPart(
          rungMesh,
          new THREE.Vector3(Math.cos(angle) * 0.8, heightY * 0.2, Math.sin(angle) * 0.8)
        );
      }

      // Parts 10-11: Dual Hydrogen Bond Guides
      const spineGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.4, 16);
      const spineA = new THREE.Mesh(spineGeo, metalCyanMat);
      spineA.position.set(0.55, 1.35, 0);
      registerPart(spineA, new THREE.Vector3(1, 0, 0));

      const spineB = new THREE.Mesh(spineGeo, metalDarkMat);
      spineB.position.set(-0.55, 1.35, 0);
      registerPart(spineB, new THREE.Vector3(-1, 0, 0));

    } else {
      // 11-PART COMPOSITE: Transformer Neural Attention Engine
      // Part 1: Compute Platform Slab
      const platGeo = new THREE.BoxGeometry(2.4, 0.15, 2.4);
      const platMesh = new THREE.Mesh(platGeo, metalDarkMat);
      platMesh.position.set(0, 0.1, 0);
      registerPart(platMesh, new THREE.Vector3(0, -1, 0));

      // Parts 2-4: Three Stacked Multi-Head Attention Slabs
      for (let layer = 0; layer < 3; layer++) {
        const y = 0.55 + layer * 0.65;
        const slabGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.1, 32);
        const slabMesh = new THREE.Mesh(slabGeo, layer === 1 ? metalCyanMat : metalDarkMat);
        slabMesh.position.set(0, y, 0);
        registerPart(slabMesh, new THREE.Vector3(0, (layer - 1) * 1.2, 0));

        // Part 5-8: Synaptic Peripheral Nodes
        for (let j = 0; j < 4; j++) {
          const ang = (j * Math.PI) / 2 + (layer * Math.PI) / 4;
          const nodeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
          const node = new THREE.Mesh(nodeGeo, goldMat);
          const nx = Math.cos(ang) * 0.9;
          const nz = Math.sin(ang) * 0.9;
          node.position.set(nx, 0.08, nz);
          slabMesh.add(node);
        }
      }

      // Part 9: Central Dense Tensor Nucleus
      const nucleusGeo = new THREE.OctahedronGeometry(0.35, 1);
      const nucleusMesh = new THREE.Mesh(nucleusGeo, glowCyanMat);
      nucleusMesh.position.set(0, 1.2, 0);
      registerPart(nucleusMesh, new THREE.Vector3(0, 0, 0));

      // Part 10-11: Data Gradient Vector Rings
      const ringGeo = new THREE.TorusGeometry(1.35, 0.03, 16, 64);
      const ringA = new THREE.Mesh(ringGeo, glowVioletMat);
      ringA.rotation.x = Math.PI / 3;
      ringA.position.set(0, 1.2, 0);
      registerPart(ringA, new THREE.Vector3(0, 1, 0));

      const ringB = new THREE.Mesh(ringGeo, glowCyanMat);
      ringB.rotation.x = -Math.PI / 3;
      ringB.position.set(0, 1.2, 0);
      registerPart(ringB, new THREE.Vector3(0, -1, 0));
    }

    // 6. Lossless 60fps Loop with Pre-allocated Scratch Math
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // FPS Measurement
      frameCount++;
      if (currentTime - fpsTimer >= 500) {
        setFps(Math.round((frameCount * 1000) / (currentTime - fpsTimer)));
        frameCount = 0;
        fpsTimer = currentTime;
      }

      // Smooth auto-rotation
      if (autoRotateRef.current && modelGroup) {
        modelGroup.rotation.y += 0.45 * dt;
      }

      // Exponential damping on exploded assembly positioning
      const expTarget = explosionRef.current;
      for (const part of explodedPartsRef.current) {
        const targetX = part.originalPos.x + part.explodeDir.x * expTarget * 1.5;
        const targetY = part.originalPos.y + part.explodeDir.y * expTarget * 1.5;
        const targetZ = part.originalPos.z + part.explodeDir.z * expTarget * 1.5;

        // Exponential smoothing: 1 - Math.exp(-k * dt)
        const alpha = 1 - Math.exp(-10 * dt);
        part.mesh.position.x += (targetX - part.mesh.position.x) * alpha;
        part.mesh.position.y += (targetY - part.mesh.position.y) * alpha;
        part.mesh.position.z += (targetZ - part.mesh.position.z) * alpha;
      }

      // Gently pulse the core point light
      corePointLight.intensity = 1.4 + Math.sin(currentTime * 0.003) * 0.5;

      controls.update();
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 7. Responsive Resizing
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Disposal on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      for (const mat of materialsRef.current) {
        mat.dispose();
      }
      proceduralCircuit.dispose();
      shadowMat.dispose();
      shadowGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeSubject]);

  const toggleExplode = () => {
    const next = !isExploded;
    setIsExploded(next);
    setExplosionFactor(next ? 1 : 0);
    addXp(15, `Exploded 3D ${activeSubject.toUpperCase()} model for internal mechanical inspection`);
  };

  return (
    <div className="relative w-full h-[680px] rounded-3xl bg-slate-950 border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col select-none">
      {/* Top Overlay Header */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg backdrop-blur-md">
          <Boxes className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide">Three.js STEM Laboratory</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-semibold">
            WebGL PBR
          </span>
        </div>

        {/* Subject Selection Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <button
            onClick={() => { setActiveSubject('quantum'); setIsExploded(false); setExplosionFactor(0); }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              activeSubject === 'quantum'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Quantum Qubit
          </button>
          <button
            onClick={() => { setActiveSubject('dna'); setIsExploded(false); setExplosionFactor(0); }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              activeSubject === 'dna'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            DNA Nanomachine
          </button>
          <button
            onClick={() => { setActiveSubject('transformer'); setIsExploded(false); setExplosionFactor(0); }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              activeSubject === 'transformer'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Neural Transformer
          </button>
        </div>
      </div>

      {/* Top Right Live Telemetry Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 shadow-md">
        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span className="text-emerald-400 font-bold">{fps} FPS</span>
        <span className="text-slate-600">•</span>
        <span>ACES Filmic</span>
      </div>

      {/* Main 3D Canvas Mount */}
      <div ref={mountRef} className="w-full flex-1 cursor-grab active:cursor-grabbing outline-none" />

      {/* Floating Collapsible HUD Control Dock (<=15% Viewport footprint) */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-auto max-w-sm w-full">
        <div className="rounded-2xl bg-[#090d1a] border border-slate-800 shadow-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspection Dock</span>
            </div>
            <button
              onClick={() => setDockCollapsed(!dockCollapsed)}
              className="text-slate-400 hover:text-white p-1"
            >
              {dockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!dockCollapsed && (
            <div className="space-y-3 pt-1">
              {/* Exploded View Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-cyan-400" />
                    <span>Exploded Deconstruction</span>
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{Math.round(explosionFactor * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={explosionFactor}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setExplosionFactor(val);
                    setIsExploded(val > 0.1);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={toggleExplode}
                  className={`py-1.5 px-2.5 rounded-xl font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                    isExploded
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>{isExploded ? 'Reassemble' : 'Explode Parts'}</span>
                </button>

                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`py-1.5 px-2.5 rounded-xl font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                    autoRotate
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Auto Orbit</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                <button
                  onClick={() => setWireframe(!wireframe)}
                  className="hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>{wireframe ? 'Solid Surface' : 'Wireframe Mesh'}</span>
                </button>
                <span className="font-mono text-[10px] text-slate-500">Drag to Orbit • Scroll to Zoom</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Academic Info Card (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-auto max-w-xs hidden md:block">
        <div className="rounded-2xl bg-[#090d1a]/95 border border-slate-800/90 p-3 shadow-xl space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Info className="w-3.5 h-3.5" />
            <span>
              {activeSubject === 'quantum' && 'Superconducting Transmon Qubit'}
              {activeSubject === 'dna' && 'B-DNA Molecular Double-Helix'}
              {activeSubject === 'transformer' && 'Multi-Head Attention Tensor'}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {activeSubject === 'quantum' &&
              'Features 10 procedural components: cryogenic thermal shield, 4 quadrupole coils, and central superconducting resonator with microwave waveguide coupling.'}
            {activeSubject === 'dna' &&
              '12-part procedural double helix showing antiparallel phosphate-sugar backbones and complementary nucleotide base-pair rungs with hydrogen bonding.'}
            {activeSubject === 'transformer' &&
              'Stack of query/key/value projection matrices with dense synaptic routing and central tensor accumulation node for contextual token encoding.'}
          </p>
        </div>
      </div>
    </div>
  );
};
