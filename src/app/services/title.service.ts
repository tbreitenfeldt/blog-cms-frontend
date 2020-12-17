import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  siteTitle: string = 'The Breitenfeldt Blog';
  subTitle: string;

  constructor(private ngTitleService: Title) {}

  setPageTitle(subTitle: string): void {
    this.subTitle = subTitle;
    this.ngTitleService.setTitle(`${this.subTitle} - ${this.siteTitle}`);
  }
}
