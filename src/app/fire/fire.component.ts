import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-fire',
  templateUrl: './fire.component.html',
  styleUrls: ['./fire.component.css'],
})
export class FireComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private rocket!: THREE.Group; // Rocket group to hold all parts
  private fire!: THREE.Sprite; // Fire sprite
  private animationFrameId!: number;

  ngAfterViewInit(): void {
    this.initThree();
    this.animate();
  }
  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
  
    // Initialize the renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(500, 500); // Full window size
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement); // Append renderer to body
  
    // Scene, Camera setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 0, 0);
  
    // Rocket body - Cylinder for the main body
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
  
    // Load texture for rocket body
    const bodyTexture = new THREE.TextureLoader().load('images/sun.jpg'); // Ensure the texture image is in your assets folder
    const bodyMaterial = new THREE.MeshStandardMaterial({ map: bodyTexture }); // Apply texture to material
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.5; // Position it correctly
    this.scene.add(body);
  
    // Rocket Nose - Cone for the top part
    const noseGeometry = new THREE.ConeGeometry(0.5, 1.5, 32);
    const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.y = 3.25; // Position it correctly on top of the body
    this.scene.add(nose);
  
    // Rocket Fins - Triangular fins using PlaneGeometry
    const finGeometry = new THREE.PlaneGeometry(1, 1.5);
    const finMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00 , side: THREE.DoubleSide });
  
    // Left fin
    const leftFin = new THREE.Mesh(finGeometry, finMaterial);
    leftFin.position.set(-0.75, -0.5, 0); // Position it on the left side
    leftFin.rotation.z = -Math.PI / 5; // Angle it
    this.scene.add(leftFin);
  
    // Right fin
    const rightFin = new THREE.Mesh(finGeometry, finMaterial);
    rightFin.position.set(0.75, -0.5, 0); // Position it on the right side
    rightFin.rotation.z = -Math.PI / -5; // Angle it
    this.scene.add(rightFin);
  
    // Add all parts to the rocket group for easier manipulation
    this.rocket = new THREE.Group();
    this.rocket.add(body);
    this.rocket.add(nose);
    this.rocket.add(leftFin);
    this.rocket.add(rightFin);
  
    // Add rocket group to scene
    this.scene.add(this.rocket);
  
    // Fire Effect (using a Sprite)
    const fireTexture = new THREE.TextureLoader().load('images/fire.png'); // Make sure you have a fire texture
    const fireMaterial = new THREE.SpriteMaterial({ map: fireTexture, transparent: true, color: 0xff5500 });
    this.fire = new THREE.Sprite(fireMaterial);
    this.fire.scale.set(2, 4, 1); // Adjust size to fit behind the rocket
    this.fire.position.set(0, -1.5, 0); // Position fire behind the rocket
    this.scene.add(this.fire);
  
    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 10);
    light.position.set(0, 5, 5);
    this.scene.add(light);
  
    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.z = 5;
  
    // Resize Handler
    window.addEventListener('resize', this.onWindowResize);
  }
  
  
  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
  
    // Calculate the movement along the Y-axis (0 to 4)
    const yPosition = 2 + Math.sin(Date.now() * 0.002) * 2; // Move from 0 to 4 (offset by 2 for center alignment)
    this.rocket.position.y = yPosition;  // Set rocket's Y position
  
    // Animate opacity (1 to 0)
    const opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.002); // Fade opacity from 1 to 0
    this.setRocketOpacity(opacity);
  
    // Animate the fire (make it blink)
    this.fire.material.opacity = 0.5 + 0.5 * Math.sin(Date.now() * 0.005); // Blink effect by changing opacity
  
    // Rotate the rocket
    this.rocket.rotation.y += 0.01;
  
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
  
  // Function to apply opacity to the rocket parts
  private setRocketOpacity(opacity: number): void {
    this.rocket.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.opacity = opacity; // Set opacity of the rocket parts
        child.material.transparent = true; // Ensure transparency is enabled
      }
    });
  };
  


  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();
  }
}
