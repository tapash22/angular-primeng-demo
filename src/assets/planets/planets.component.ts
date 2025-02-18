import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css'],
})
export class PlanetsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private sun!: THREE.Mesh;
  private planet!: THREE.Mesh; // Reference for Earth
  private planets: any[] = [];
  private animationFrameId!: number;
  private texture!: THREE.Texture;
  private mouseX = 0;
  private mouseY = 0;

  ngAfterViewInit() {
    if (this.canvasRef) {
      this.initThree();
    } else {
      console.error('Canvas reference is not available.');
    }
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;

    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(500, 500);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Create scene
    this.scene = new THREE.Scene();

    // Set up camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 10, 50);

    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    this.scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 300);
    this.scene.add(pointLight);

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    this.texture = textureLoader.load('images/saturnring.png'); // Make sure the path is correct!

    // Sun
    const sunGeo = new THREE.SphereGeometry(16, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    this.sun = new THREE.Mesh(sunGeo, sunMat);
    this.scene.add(this.sun);

    // Create planets
    this.planets = [
      this.createPlanet(3.2, 28, 0xaaaaaa), // Mercury
      this.createPlanet(5.8, 44, 0xffaa00), // Venus
      this.createPlanet(6, 62, 0x0000ff, this.texture), // Earth with texture
      this.createPlanet(4, 78, 0xff3300), // Mars
      this.createPlanet(12, 100, 0xff9900), // Jupiter
      this.createPlanet(10, 138, 0xff8800, undefined, { inner: 10, outer: 20, color: 0xaa7700 }), // Saturn
      this.createPlanet(7, 176, 0x00aaff, undefined, { inner: 7, outer: 12, color: 0xaaaaaa }), // Uranus
      this.createPlanet(7, 200, 0x0000aa), // Neptune
      this.createPlanet(2.8, 216, 0xff99ff) // Pluto
    ];

    // Assign Earth for mouse rotation
    this.planet = this.planets[2].mesh; 

    // Start animation loop
    this.animate();
  }

  private createPlanet(size: number, distance: number, color: number, texture?: THREE.Texture, ring?: { inner: number; outer: number; color: number }) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color });

    if (texture) {
      material.map = texture;
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = distance;

    const obj = new THREE.Object3D();
    obj.add(mesh);

    if (ring) {
      const ringGeo = new THREE.RingGeometry(ring.inner, ring.outer, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: ring.color, side: THREE.DoubleSide });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      obj.add(ringMesh);
    }

    this.scene.add(obj);
    return { mesh, obj };
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Self-rotation
    this.sun.rotateY(0.004);
    this.planets.forEach((planet, index) => {
      const speeds = [0.004, 0.002, 0.02, 0.018, 0.04, 0.038, 0.03, 0.032, 0.008];
      planet.mesh.rotateY(speeds[index]);
      planet.obj.rotateY(speeds[index] * 2);
    });

    // Rotate Earth (only)
    if (this.planet) {
      this.planet.rotation.y += this.mouseX * 0.00005;
      this.planet.rotation.x += this.mouseY * 0.00005;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = (event.clientX - window.innerWidth / 2);
    this.mouseY = (event.clientY - window.innerHeight / 2);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    this.renderer.dispose();
  }
}
