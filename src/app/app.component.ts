import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { Employee } from './model/Employee';
import { EmployeeService } from './service/employee.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,TableModule,ButtonModule,ImageModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular-primeng-demo';

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
