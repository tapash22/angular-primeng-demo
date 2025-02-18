import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
@Component({
  selector: 'app-threescreen',
  standalone: true,
  template: '<canvas #canvas></canvas>',
  styles: ['canvas { width: 300px; height: 300px; display: block; }'],
})
export class ThreescreenComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private line!: THREE.Line;

  ngAfterViewInit() {
    if (this.canvasRef) {
      this.initThree();
    } else {
      console.error('Canvas reference is not available.');
    }
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;

    const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();

    // Explicitly set canvas size
    canvas.width = 300;
    canvas.height = 300;

    // Create scene
    this.scene = new THREE.Scene();

    // Create camera with correct aspect ratio
    const aspectRatio = canvas.width / canvas.height;
    this.camera = new THREE.PerspectiveCamera(85, aspectRatio, 0.1, 500);
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);

    // Create renderer and attach to canvas
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(canvas.width, canvas.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Smooth motion
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI / 2;
    // Create a line
    const points = [
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, -5, 1),
      new THREE.Vector3(1, 0, 0),
    ];
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.line = new THREE.Line(geometry, material);
    this.scene.add(this.line);

    // Start animation loop
    this.animate();
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };
}
