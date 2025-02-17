import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { Employee } from './model/Employee';
import { EmployeeService } from './service/employee.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AutocompletedemoComponent } from './autocompletedemo/autocompletedemo.component';
import { EditorComponent } from './editor/editor.component';
import { ThreescreenComponent } from './threescreen/threescreen.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,TableModule,ButtonModule,ImageModule, DashboardComponent, AutocompletedemoComponent,EditorComponent,ThreescreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // title = 'angular-primeng-demo';

  employeeList: Employee[] = []

  constructor(private empService: EmployeeService){}

  
  ngOnInit(): void {
    this.getEmployes();
  }

  getEmployes(){
    this.empService.getEmployees().subscribe((res:any)=>{
      this.employeeList = res
    })
  }
}
