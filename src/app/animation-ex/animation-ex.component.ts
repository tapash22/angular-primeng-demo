import { Component } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animation-ex',
  imports: [CommonModule],
  templateUrl: './animation-ex.component.html',
  styleUrl: './animation-ex.component.css',
  animations: [
    trigger('scaleUp', [
      state('visible', style({ opacity: 1, transform: 'scale(1)' })),
      state('hidden', style({ opacity: 0, transform: 'scale(0)' })),

      // Show animation: Scale up from 0 to 1
      transition('hidden => visible', [
        style({ opacity: 0, transform: 'scale(0)' }),  // Start from scale 0
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))  // Scale up to 1
      ]),

      // Hide animation: Fade and scale down to 0
      transition('visible => hidden', [
        animate('400ms ease-out', style({ opacity: 0, transform: 'scale(2)' }))  // Fade and shrink
      ]),
    ])
  ],

  
})
export class AnimationExComponent {
  isVisible = true;
  animationInProgress = false; // Flag to check if animation is in progress

  // Toggle visibility when the button is clicked
  toggleVisibility() {
    this.isVisible = !this.isVisible;
      console.log('Toggled visibility:', this.isVisible);
  }

}
