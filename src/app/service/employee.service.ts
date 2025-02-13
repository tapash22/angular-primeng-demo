import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, Employee } from '../model/Employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }


  createEmployee(employee: Employee): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('/api/EmployeeManagement/CreateEmployee', employee);
  }

  updateEmployee(employee: Employee): Observable<ApiResponse> {
    return this.http.put<ApiResponse>('/api/EmployeeManagement/UpdateEmployee/'+employee.employeeId, employee);
  }

  getEmployees() {
    return this.http.get<Employee[]>("/api/EmployeeManagement/GetAllEmployees")
  }

  deleteEmployee(id:number) {
    return this.http.delete<Employee>("/api/EmployeeManagement/DeleteEmployee/"+id)
  }
  
}
