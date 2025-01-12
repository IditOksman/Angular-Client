import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface ApiResponse {
  data: any;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title: string = 'nushka';
  responseData: any;

  constructor(private http: HttpClient) {}

  getData() {
    this.http
      .get<ApiResponse>('http://localhost:3000/api/python-data')
      .subscribe(
        (response) => {
          this.responseData = response;
          console.log('Response:', response);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
}
