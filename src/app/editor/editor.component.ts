import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { Knob } from 'primeng/knob';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';

interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-editor',
  imports: [FormsModule,Editor,InputTextModule,KeyFilterModule,Knob,MultiSelectModule,PasswordModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit,OnDestroy {
  text:string | undefined;
  value!: number;
  value1: number = 0;
  interval: any;
  password! : string;

  
  cities!: City[];

  selectedCities!: City[];

  ngOnInit(): void {
    this.startAutoIncrement();
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];
  }

  startAutoIncrement() {
    this.interval = setInterval(() => {
      if (this.value1 < 100) {
        this.value1++;
      }
    }, 1000); 
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
