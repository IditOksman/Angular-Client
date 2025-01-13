import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { interval, of, Subscription } from 'rxjs';
import {
  catchError,
  retry,
  startWith,
  switchMap,
  tap,
  timeout,
} from 'rxjs/operators';

export interface NewsItem {
  title: string;
  content: string;
  category: string;
  timestamp: string;
  keywords: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  newsItems: NewsItem[] = [];
  private subscription: Subscription = new Subscription();
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.subscription = interval(10000)
      .pipe(
        startWith(0),
        switchMap(() => this.getNews())
      )
      .subscribe({
        next: (news) => {
          console.log('Received news:', news); // Debug log
          this.newsItems = news;
        },
        error: (error) => {
          console.error('Error fetching news:', error);
        },
        complete: () => {
          console.log('News subscription completed');
        },
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getNews() {
    return this.http.get<NewsItem[]>('http://localhost:3000/api/news').pipe(
      tap((response) => console.log('Raw API response:', response)), // Debug log
      timeout(5000),
      retry(3),
      catchError((error) => {
        console.error('API Error:', error);
        return of([]);
      })
    );
  }
  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      Technology: '#3498db',
      Business: '#e74c3c',
      World: '#f39c12',
      Science: '#2ecc71',
    };
    return colors[category] || '#95a5a6';
  }

  getTimeElapsed(timestamp: string): string {
    const now = new Date();
    const published = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - published.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }
}
