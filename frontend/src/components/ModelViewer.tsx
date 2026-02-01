import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ModelParameters } from "../types";
import "./ModelViewer.css";

interface ModelViewerProps {
	parameters: ModelParameters;
}

export function ModelViewer({ parameters }: ModelViewerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		controls: OrbitControls;
		mesh: THREE.Group;
	} | null>(null);

	// Initialize Three.js scene
	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const width = container.clientWidth;
		const height = container.clientHeight;

		// Scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf5f0e8);

		// Camera
		const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
		camera.position.set(150, 150, 150);
		camera.lookAt(0, 0, 0);

		// Renderer
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		container.appendChild(renderer.domElement);

		// Controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.minDistance = 50;
		controls.maxDistance = 500;

		// Lights
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(100, 200, 100);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
		scene.add(directionalLight);

		const pointLight = new THREE.PointLight(0xe94560, 0.5);
		pointLight.position.set(-100, 100, -100);
		scene.add(pointLight);

		// Grid helper
		const gridHelper = new THREE.GridHelper(500, 50, 0xd4cfc7, 0xe8e3db);
		scene.add(gridHelper);

		// Initial mesh group
		const mesh = new THREE.Group();
		scene.add(mesh);

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};

		sceneRef.current = { scene, camera, renderer, controls, mesh };
		animate();

		// Handle resize
		const handleResize = () => {
			if (!containerRef.current || !sceneRef.current) return;
			const newWidth = containerRef.current.clientWidth;
			const newHeight = containerRef.current.clientHeight;
			sceneRef.current.camera.aspect = newWidth / newHeight;
			sceneRef.current.camera.updateProjectionMatrix();
			sceneRef.current.renderer.setSize(newWidth, newHeight);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			if (sceneRef.current) {
				sceneRef.current.controls.dispose();
				sceneRef.current.renderer.dispose();
				container.removeChild(renderer.domElement);
			}
		};
	}, []);

	// Update model when parameters change
	useEffect(() => {
		if (!sceneRef.current) return;

		const { mesh } = sceneRef.current;

		// Clear existing mesh
		while (mesh.children.length > 0) {
			const child = mesh.children[0];
			if (child instanceof THREE.Mesh) {
				child.geometry.dispose();
				if (Array.isArray(child.material)) {
					child.material.forEach((m) => m.dispose());
				} else {
					child.material.dispose();
				}
			}
			mesh.remove(child);
		}

		// Material
		const material = new THREE.MeshStandardMaterial({
			color: 0xff8c69,
			metalness: 0.2,
			roughness: 0.3,
		});

		// Create hollow box (5 walls for a box with open bottom, or 6 for closed)
		const {
			width,
			height,
			depth,
			wallThickness,
			hasVentilation,
			hasMountingHoles,
		} = parameters;

		const w = width / 2;
		const h = height / 2;
		const t = wallThickness;

		// Bottom plate
		const bottomGeo = new THREE.BoxGeometry(width, t, depth);
		const bottom = new THREE.Mesh(bottomGeo, material);
		bottom.position.y = -h + t / 2;
		bottom.castShadow = true;
		bottom.receiveShadow = true;
		mesh.add(bottom);

		// Front wall
		const frontGeo = new THREE.BoxGeometry(width, height - t, t);
		const front = new THREE.Mesh(frontGeo, material);
		front.position.set(0, t / 2, h - t / 2);
		front.castShadow = true;
		mesh.add(front);

		// Back wall
		const backGeo = new THREE.BoxGeometry(width, height - t, t);
		const back = new THREE.Mesh(backGeo, material);
		back.position.set(0, t / 2, -h + t / 2);
		back.castShadow = true;
		mesh.add(back);

		// Left wall
		const leftGeo = new THREE.BoxGeometry(t, height - t, depth - 2 * t);
		const left = new THREE.Mesh(leftGeo, material);
		left.position.set(-w + t / 2, t / 2, 0);
		left.castShadow = true;
		mesh.add(left);

		// Right wall
		const rightGeo = new THREE.BoxGeometry(t, height - t, depth - 2 * t);
		const right = new THREE.Mesh(rightGeo, material);
		right.position.set(w - t / 2, t / 2, 0);
		right.castShadow = true;
		mesh.add(right);

		// Ventilation holes
		if (hasVentilation) {
			const holeGeo = new THREE.CylinderGeometry(3, 3, t + 1, 16);
			const holeMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f0e8 });

			for (let i = -2; i <= 2; i++) {
				for (let j = -1; j <= 1; j++) {
					const hole = new THREE.Mesh(holeGeo, holeMaterial);
					hole.rotation.x = Math.PI / 2;
					hole.position.set(i * 12, t / 2 + j * 12, h);
					mesh.add(hole);
				}
			}
		}

		// Mounting holes
		if (hasMountingHoles) {
			const mountHoleGeo = new THREE.CylinderGeometry(2, 2, t + 1, 16);
			const mountHoleMaterial = new THREE.MeshStandardMaterial({
				color: 0xf5f0e8,
			});
			const mountOffset = 5;

			const positions = [
				[-w + mountOffset, -h + mountOffset],
				[w - mountOffset, -h + mountOffset],
				[-w + mountOffset, h - mountOffset],
				[w - mountOffset, h - mountOffset],
			];

			positions.forEach(([x, z]) => {
				const hole = new THREE.Mesh(mountHoleGeo, mountHoleMaterial);
				hole.position.set(x, -h, z);
				mesh.add(hole);
			});
		}

		// Center the mesh
		mesh.position.y = 5;
	}, [parameters]);

	return (
		<div className="model-viewer">
			<div className="viewer-header">
				<h3>3D Предпросмотр</h3>
				<div className="viewer-controls">
					<span className="viewer-hint">🖱️ Вращение мышкой</span>
				</div>
			</div>
			<div ref={containerRef} className="viewer-canvas" />
		</div>
	);
}
