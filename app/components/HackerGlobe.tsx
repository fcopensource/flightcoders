"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HackerGlobe() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
    camera.position.z = 4.3;
    const globe = new THREE.Group();
    globe.rotation.z = -.18;
    scene.add(globe);
    globe.rotation.y = Math.PI;
    scene.add(new THREE.AmbientLight(0x93bbcf, 1.2));
    const sunlight = new THREE.DirectionalLight(0xc8fff0, 3);
    sunlight.position.set(-3, 4, 5); scene.add(sunlight);
    const surface = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .72, metalness: .22 });
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1.15, 96, 64), surface));
    const textures: THREE.Texture[] = [];
    const controller = new AbortController();
    // Natural Earth public-domain coastlines, rendered locally: no external map service.
    const canvas = document.createElement("canvas");
    canvas.width = 2048; canvas.height = 1024;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#071c2b"; context.fillRect(0, 0, 2048, 1024);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures.push(texture); surface.map = texture;
    type Polygon = number[][][];
    fetch("/globe-land.geojson", { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error("Map unavailable");
      return response.json();
    }).then((data: { features: { geometry: { type: string; coordinates: Polygon | Polygon[] } }[] }) => {
      if (controller.signal.aborted) return;
      context.fillStyle = "#237b69"; context.strokeStyle = "#72dcb0"; context.lineWidth = 1.1;
      for (const { geometry } of data.features) {
        const polygons = geometry.type === "Polygon" ? [geometry.coordinates as Polygon] : geometry.coordinates as Polygon[];
        for (const polygon of polygons) {
          context.beginPath();
          for (const ring of polygon) {
            ring.forEach(([longitude, latitude], index) => {
              const x = (longitude + 180) / 360 * 2048;
              const y = (90 - latitude) / 180 * 1024;
              if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
            });
            context.closePath();
          }
          context.fill("evenodd"); context.stroke();
        }
      }
      texture.needsUpdate = true;
    }).catch(() => { /* Keep the lit ocean globe if the map request is interrupted. */ });
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1.17, 24, 12), new THREE.MeshBasicMaterial({ color: 0x20834d, wireframe: true, transparent: true, opacity: .13 })));
    const halo = new THREE.Mesh(new THREE.SphereGeometry(1.22, 64, 64), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: "varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p;}",
      fragmentShader: "varying vec3 n; varying vec3 v; void main(){float rim=pow(1.-max(dot(normalize(n),normalize(v)),0.),3.); gl_FragColor=vec4(.0,.75,.4,rim*.32);}",
    }));
    scene.add(halo);
    const countries = [
      { name: "INDIA", lat: 22, lon: 79 }, { name: "JAPAN", lat: 36, lon: 138 },
      { name: "AUSTRALIA", lat: -25, lon: 134 }, { name: "USA", lat: 38, lon: -99 },
      { name: "BRAZIL", lat: -14, lon: -51 }, { name: "UK", lat: 54, lon: -2 },
      { name: "SOUTH AFRICA", lat: -30, lon: 25 },
    ];
    const locate = (lat: number, lon: number, radius = 1.18) => {
      const latitude = THREE.MathUtils.degToRad(lat), longitude = THREE.MathUtils.degToRad(lon);
      return new THREE.Vector3(radius * Math.cos(latitude) * Math.cos(longitude), radius * Math.sin(latitude), -radius * Math.cos(latitude) * Math.sin(longitude));
    };
    const labels: THREE.Sprite[] = [];
    countries.forEach(country => {
      const labelCanvas = document.createElement("canvas"); labelCanvas.width = 512; labelCanvas.height = 96;
      const ctx = labelCanvas.getContext("2d")!;
      ctx.fillStyle = "rgba(3,14,22,.88)"; ctx.fillRect(0, 0, 512, 96);
      ctx.strokeStyle = "#39846b"; ctx.lineWidth = 3; ctx.strokeRect(2, 2, 508, 92);
      ctx.fillStyle = "#dbfff0"; ctx.font = "32px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(country.name, 256, 48);
      const map = new THREE.CanvasTexture(labelCanvas); map.colorSpace = THREE.SRGBColorSpace; textures.push(map);
      const label = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false }));
      label.position.copy(locate(country.lat + 5, country.lon, 1.27)); label.scale.set(.48, .09, 1);
      globe.add(label); labels.push(label);
      const marker = new THREE.Mesh(new THREE.SphereGeometry(.018, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffb866 }));
      marker.position.copy(locate(country.lat, country.lon)); globe.add(marker);
    });
    for (const destination of [countries[1], countries[2], countries[5]]) {
      const a = locate(22, 79);
      const b = locate(destination.lat, destination.lon);
      const mid = a.clone().add(b).normalize().multiplyScalar(1.65);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)), new THREE.LineBasicMaterial({ color: 0x00ec80, transparent: true, opacity: .5 })));
    }
    let pointer = 0;
    const onMove = (event: PointerEvent) => { const rect = element.getBoundingClientRect(); pointer = ((event.clientX - rect.left) / rect.width - .5) * .2; };
    element.addEventListener("pointermove", onMove);
    const resize = () => { const { width, height } = element.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let previous = 0;
    const worldPosition = new THREE.Vector3();
    renderer.setAnimationLoop((time) => {
      const delta = previous ? Math.min((time - previous) / 1000, .05) : 0;
      previous = time;
      if (!reducedMotion && !document.hidden) globe.rotation.y += delta * .16;
      globe.rotation.x += (pointer - globe.rotation.x) * .025;
      globe.updateMatrixWorld(true);
      labels.forEach(label => { label.getWorldPosition(worldPosition); label.visible = worldPosition.z > .4; });
      renderer.render(scene, camera);
    });
    return () => {
      controller.abort(); textures.forEach(texture => texture.dispose());
      renderer.setAnimationLoop(null); observer.disconnect(); element.removeEventListener("pointermove", onMove);
      scene.traverse(object => { const mesh = object as THREE.Mesh; mesh.geometry?.dispose(); if(mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(material => material.dispose()); });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div className="fc-hacker-globe" aria-label="Rotating 3D developer network globe"><div className="fc-globe-canvas" ref={host}/><div className="fc-globe-caption"><span>● GLOBAL DEVELOPER NETWORK</span><span>BUILD / CONNECT / SHIP</span></div></div>;
}
