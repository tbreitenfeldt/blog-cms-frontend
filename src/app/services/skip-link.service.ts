import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SkipLinkService {
  path: string;

  constructor(private router: Router) {}

  setupSkipLinkPath(id: string = 'main-content'): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.router.url.endsWith(`#${id}`)) {
          this.path = `${this.router.url}#${id}`;
        }
      });
  }
}
