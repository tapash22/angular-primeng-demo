import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-threescreen',
  standalone: true,
  template: '<canvas #canvas></canvas>',
  styles: ['canvas { width: 100%; height: 100vh; display: block; background: transparent; }']
})
export class ThreescreenComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    if (this.canvasRef) {
      this.initThree();
    } else {
      console.error('Canvas reference is not available.');
    }
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // ✅ Set transparent background
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // ✅ Change cube color to gold (0xFFD700)
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    animate();
  }
}
