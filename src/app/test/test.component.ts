import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private sphere!: THREE.Mesh;
  private clock = new THREE.Clock();
  private ambientLight!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;
  private pointLight!: THREE.PointLight;

  ngAfterViewInit(): void {
    this.initThree();
    this.addLights();
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    this.renderer.setSize(500, 500);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = true;
    this.renderer.shadowMap.needsUpdate = true;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 3, 10);
    this.camera.lookAt(0, 0, 0);

    const textureLoader = new THREE.TextureLoader();

    // Load the texture and apply it to the sphere
    textureLoader.load('images/saturnring.png', (texture) => {
      this.createSphere(texture);
      this.animate();
    });

    //load ground
    textureLoader.load('images/stars.jpg', (groundTexture) => {
      this.createGround(groundTexture, 'bottom');
    });

    textureLoader.load('images/sun.jpg', (groundTexture) => {
      this.createGround(groundTexture, 'left');
      this.createGround(groundTexture, 'right');
    });
  }

  

  private addLights() {
    this.ambientLight = new THREE.AmbientLight(0xffcc00, 0.4);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffcc00, 0.8);
    this.directionalLight.position.set(5, 10, 5);
    this.directionalLight.castShadow = true; // Enable shadows

    // Improve shadow quality
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.1;
    this.directionalLight.shadow.camera.far = 50;
    this.directionalLight.shadow.bias = -0.003;

    this.scene.add(this.directionalLight);

    this.pointLight = new THREE.PointLight(0xffcc00, 1.5, 20); // Color, Intensity, Distance
    this.pointLight.position.set(0, 5, 5);
    this.pointLight.castShadow = true;
    this.pointLight.color.set(0xaaffaa);
    this.scene.add(this.pointLight);
  }

  private createGround(
    texture: THREE.Texture,
    position: 'bottom' | 'left' | 'right'
  ) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1); // Adjust tiling effect

    const geometry = new THREE.PlaneGeometry(10, 10); // Create a plane
    const material = new THREE.MeshStandardMaterial({ map: texture });

    const ground = new THREE.Mesh(geometry, material);
    ground.receiveShadow = true;
    // ground.rotation.x = -Math.PI / 2; // Rotate to lay flat
    // ground.position.y = -3; // Position it beneath the sphere

    switch (position) {
      case 'bottom': // Ground
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        break;
      case 'left': // Left wall
        ground.rotation.y = Math.PI / 2;
        ground.position.x = -5;
        ground.position.y = 3; // Raise it up slightly
        break;
      case 'right': // Right wall
        ground.rotation.y = -Math.PI / 2;
        ground.position.x = 5;
        ground.position.y = 3;
        break;
    }

    this.scene.add(ground);
  }

  private createSphere(texture: THREE.Texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    const geometry = new THREE.SphereGeometry(2, 24, 24); // Create a sphere
    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });

    // Create 4 spheres and position them
    //  const positions = [
    //   [-3, 3, 0],  // Top-left
    //   [3, 3, 0],   // Top-right
    //   [-3, -3, 0], // Bottom-left
    //   [3, -3, 0]   // Bottom-right
    // ];

    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.position.set(1, 0, 0);
    this.sphere.castShadow = true; // Enable shadow casting
    this.sphere.receiveShadow = false;

    this.scene.add(this.sphere);
    // positions.forEach((pos) => {
    //   sphere.position.set(pos[0], pos[1], pos[2]);
    //   this.scene.add(sphere);
    //   this.spheres.push(sphere);
    // });
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();

    if (this.sphere) {
      this.sphere.rotation.x += 0.02;
      this.sphere.position.y = Math.sin(elapsed * 3) * 1;
    }
    // this.spheres.forEach((sphere) => {
    // });

    this.renderer.render(this.scene, this.camera);
  };
}
