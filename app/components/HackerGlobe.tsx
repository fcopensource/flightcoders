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
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1.15, 64, 64), new THREE.MeshBasicMaterial({ color: 0x081310 })));
    const positions: number[] = [];
    // A deterministic Fibonacci sphere keeps the visual stable across mounts.
    for (let i = 0; i < 6500; i++) {
      const y = 1 - (i / 6499) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = i * Math.PI * (3 - Math.sqrt(5));
      positions.push(Math.cos(theta) * radius * 1.16, y * 1.16, Math.sin(theta) * radius * 1.16);
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    globe.add(new THREE.Points(pointsGeometry, new THREE.PointsMaterial({ color: 0x70dba4, size: .012, transparent: true, opacity: .72 })));
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1.17, 24, 12), new THREE.MeshBasicMaterial({ color: 0x20834d, wireframe: true, transparent: true, opacity: .13 })));
    const halo = new THREE.Mesh(new THREE.SphereGeometry(1.22, 64, 64), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: "varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p;}",
      fragmentShader: "varying vec3 n; varying vec3 v; void main(){float rim=pow(1.-max(dot(normalize(n),normalize(v)),0.),3.); gl_FragColor=vec4(.0,.75,.4,rim*.32);}",
    }));
    scene.add(halo);
    for (let i = 0; i < 5; i++) {
      const a = new THREE.Vector3().setFromSphericalCoords(1.19, .6 + i * .42, i * 1.5);
      const b = new THREE.Vector3().setFromSphericalCoords(1.19, 1.5 + i * .12, i * 1.5 + 1.3);
      const mid = a.clone().add(b).normalize().multiplyScalar(1.65);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)), new THREE.LineBasicMaterial({ color: 0x00ec80, transparent: true, opacity: .5 })));
      const marker = new THREE.Mesh(new THREE.SphereGeometry(.025, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffa34d }));
      marker.position.copy(a); globe.add(marker);
    }
    let pointer = 0;
    const onMove = (event: PointerEvent) => { const rect = element.getBoundingClientRect(); pointer = ((event.clientX - rect.left) / rect.width - .5) * .2; };
    element.addEventListener("pointermove", onMove);
    const resize = () => { const { width, height } = element.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let previous = 0;
    renderer.setAnimationLoop((time) => {
      const delta = previous ? Math.min((time - previous) / 1000, .05) : 0;
      previous = time;
      if (!reducedMotion && !document.hidden) globe.rotation.y += delta * .16;
      globe.rotation.x += (pointer - globe.rotation.x) * .025;
      renderer.render(scene, camera);
    });
    return () => {
      renderer.setAnimationLoop(null); observer.disconnect(); element.removeEventListener("pointermove", onMove);
      scene.traverse(object => { const mesh = object as THREE.Mesh; mesh.geometry?.dispose(); if(mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(material => material.dispose()); });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div className="fc-hacker-globe" aria-label="Rotating 3D developer network globe"><div className="fc-globe-canvas" ref={host}/><div className="fc-globe-caption"><span>● GLOBAL DEVELOPER NETWORK</span><span>BUILD / CONNECT / SHIP</span></div></div>;
}
