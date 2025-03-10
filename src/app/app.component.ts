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
import { PlanetsComponent } from '../assets/planets/planets.component';
import { TestComponent } from './test/test.component';
import { FireComponent } from './fire/fire.component';
import { ThreeBackgroundComponent } from './three-background/three-background.component';
import { FormComponent } from './form/form.component';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ParentComponent } from './parent/parent.component';

// import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule,ParentComponent,RouterOutlet,TableModule,ButtonModule,ImageModule, DashboardComponent, AutocompletedemoComponent,EditorComponent,ThreescreenComponent,PlanetsComponent,TestComponent,FireComponent,ThreeBackgroundComponent,FormComponent,UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  // title = 'angular-primeng-demo';

  employeeList: Employee[] = []

  constructor(private empService: EmployeeService){}

  receivedDatas: any[] = []; // Store received form data

  handleFormSubmit(formData: any) {
    console.log('Received Data in Parent:', formData);
    const newData = {
      ...formData,
      id: Date.now()
    }
    this.receivedDatas.push(newData)
  }

  
  // ngOnInit(): void {
  //   this.getEmployes();
  // }

  // getEmployes(){
  //   this.empService.getEmployees().subscribe((res:any)=>{
  //     this.employeeList = res
  //   })
  // }
}
