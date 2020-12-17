import { Component, OnInit } from '@angular/core';
import { SkipLinkService } from '../services/skip-link.service';
import { TitleService } from '../services/title.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent implements OnInit {
  skipLinkPath: string;

  constructor(
    public skipLink: SkipLinkService,
    public titleService: TitleService
  ) {}

  ngOnInit(): void {
    this.skipLink.setupSkipLinkPath();
  }
}
