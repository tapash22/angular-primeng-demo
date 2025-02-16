import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
  selector: 'app-autocompletedemo',
  imports: [AutoComplete, FormsModule],
  templateUrl: './autocompletedemo.component.html',
  styleUrl: './autocompletedemo.component.css'
})
export class AutocompletedemoComponent {
  items: any[] = [];

  value: any;

  search(event: AutoCompleteCompleteEvent) {
    // this use for if click dropdown without data
    let _items = [...Array(10).keys()];

    this.items = event.query ? [...Array(10).keys()].map(item => event.query + '-' + item) : _items;
  }
}
