import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';

@Component({
  selector: 'app-three-background',
  imports: [],
  templateUrl: './three-background.component.html',
  styleUrl: './three-background.component.css',
})
export class ThreeBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('webgl', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private objectsDistance = 4;
  private sectionMeshes: THREE.Mesh[] = [];
  private scrollY = window.scrollY;
  private currentSection = 0;
  private clock = new THREE.Clock();
  private previousTime = 0;
  private cameraGroup = new THREE.Group();
  private cursor = { x: 0, y: 0 };
  private animationFrameId: any;

  ngAfterViewInit(): void {
    this.initThree();

    // Bind 'this' to event handlers
    this.onScroll = this.onScroll.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onResize = this.onResize.bind(this);
    this.animate = this.animate.bind(this);
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('mousemove', this.onMouseMove);
    cancelAnimationFrame(this.animationFrameId);
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;

    // screen
    this.scene = new THREE.Scene();

    //material
    const material = new THREE.MeshToonMaterial({ color: '#ffeded' }); 

    // mashes
    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    );
    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 2),
      material
    );

    mesh1.position.set(2, 0, 0);
    mesh2.position.set(-2, -this.objectsDistance * 1, 0);
    mesh3.position.set(2, -this.objectsDistance * 2, 0);

    this.sectionMeshes = [mesh1, mesh2, mesh3];
    this.scene.add(mesh1, mesh2, mesh3);

    // Particles
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] =
        this.objectsDistance * 0.5 -
        Math.random() * this.objectsDistance * this.sectionMeshes.length;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      color: '#ffeded',
      size: 0.9,
      sizeAttenuation: true,
    });
    const Particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(Particles);

    //lights
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
    directionalLight.position.set(1, 1, 0);
    this.scene.add(directionalLight);

    // camera
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 6;
    this.cameraGroup.add(this.camera);
    this.scene.add(this.camera);

    // rendere
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private animate() {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.previousTime;
    this.previousTime = elapsedTime;
  
    // Scroll effect: Move camera based on scroll
    this.camera.position.y = -this.scrollY / window.innerHeight * this.objectsDistance;
  
    // Parallax effect (Mouse movement)
    const parallaxX = this.cursor.x * 0.5;
    const parallaxY = -this.cursor.y * 0.5;
    this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) * 5 * deltaTime;
    this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) * 5 * deltaTime;
  
    // Animate meshes
    this.sectionMeshes.forEach(mesh => {
      mesh.rotation.x += deltaTime * 0.1;
      mesh.rotation.y += deltaTime * 0.12;
    });
  
    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(() => this.animate()); // Ensure animation loop continues
  }
  
  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  private onScroll() {
    this.scrollY = window.scrollY;
    const newSection = Math.round(this.scrollY / window.innerHeight);
  
    if (newSection !== this.currentSection) {
      this.currentSection = newSection;
      gsap.to(this.sectionMeshes[this.currentSection]?.rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3'
      });
    }
  
    // Force re-render after scroll change
    this.animate();
  }

  private onMouseMove(event: MouseEvent) {
    this.cursor.x = event.clientX / window.innerWidth - 0.5;
    this.cursor.y = event.clientY / window.innerHeight - 0.5;
  }

}
