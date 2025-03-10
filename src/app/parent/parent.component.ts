import { Component } from '@angular/core';
import { ChildComponent } from '../child/child.component';

@Component({
  selector: 'app-parent',
  imports: [ChildComponent],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css',
})
export class ParentComponent {
  receivedData: any = null; // Store received form data

  handleFormSubmit(formData: { name: string; password: string }) {
    console.log('Received in Parent:', formData);
    this.receivedData = formData;
  }
}
