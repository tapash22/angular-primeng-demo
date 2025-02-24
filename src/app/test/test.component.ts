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
  private ring!: THREE.Mesh; // Ring mesh

  ngAfterViewInit(): void {
    this.initThree();
    this.addLights();
    this.createRing(); // Add the ring
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

  private createRing() {
    const geometry = new THREE.TorusGeometry(3, 0.2, 16, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff4500, // Orange Fire Color
      transparent: true,
      emissive: 0xff4500, // Glowing Effect
      emissiveIntensity: 3, // Increase glow effect
      opacity: 1,
    });

    this.ring = new THREE.Mesh(geometry, material);

    // ✅ Rotate it to lie flat
    this.ring.rotation.x = Math.PI / 2;

    // ✅ Adjust position if needed
    this.ring.position.set(1, -1.5, 0);

    this.scene.add(this.ring);

    this.startRingAnimation()
  }

  private startRingAnimation() {
    let scale = 0.5; // Start small
    let growing = true; // Flag for growing/shrinking

    const animateRing = () => {
      if (!this.ring) return;

      if (growing) {
        scale += 0.002; // Expand the ring
        (this.ring.material as THREE.MeshStandardMaterial).opacity -= 0.001; // Fade out slowly
      } else {
        scale -= 0.002; // Shrink the ring
        (this.ring.material as THREE.MeshStandardMaterial).opacity -= 0.002; // Fade out faster
      }

      if (scale >= 1.5) growing = false; // Start shrinking at max size
      if (scale <= 0.2) this.scene.remove(this.ring); // Remove when too small

      this.ring.scale.set(scale, scale, scale);
      requestAnimationFrame(animateRing);
    };

    animateRing();
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

    if (this.ring) {
      // Move the ring upwards
      this.ring.position.y += 0.02;

      // Gradually fade out as it moves up
      if (this.ring.position.y > 0) {
        (this.ring.material as THREE.MeshStandardMaterial).opacity -= 0.01;
      }

      // Reset when the ring disappears
      if ((this.ring.material as THREE.MeshStandardMaterial).opacity <= 0) {
        this.ring.position.y = -3; // Reset to the bottom
        (this.ring.material as THREE.MeshStandardMaterial).opacity = 1;
      }
    }

    this.renderer.render(this.scene, this.camera);
  };
}
