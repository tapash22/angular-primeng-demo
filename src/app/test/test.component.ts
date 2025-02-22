import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private spheres : THREE.Mesh[]=[];

  ngAfterViewInit(): void {
    this.initThree();
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    this.renderer.setSize(500, 500);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);

    const textureLoader = new THREE.TextureLoader();
    
    // Load the texture and apply it to the sphere
    textureLoader.load('images/saturnring.png', (texture) => {
      this.createSphere(texture);
      this.animate();
    });
  }

  private createSphere(texture: THREE.Texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    const geometry = new THREE.SphereGeometry(2, 24, 24); // Create a sphere
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });

   // Create 4 spheres and position them
   const positions = [
    [-3, 3, 0],  // Top-left
    [3, 3, 0],   // Top-right
    [-3, -3, 0], // Bottom-left
    [3, -3, 0]   // Bottom-right
  ];

  positions.forEach((pos) => {
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(pos[0], pos[1], pos[2]);
    this.scene.add(sphere);
    this.spheres.push(sphere);
  });
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    this.spheres.forEach((sphere) => {
      sphere.rotation.y += 0.02;
    });

    this.renderer.render(this.scene, this.camera);
  };
}
