import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  siteTitle: string = 'The Breitenfeldt Blog';
  subTitle: string = 'Home';
  renderer: Renderer2;

  constructor(
    private ngTitleService: Title,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setPageTitle(subTitle: string): void {
    this.subTitle = subTitle;
    this.ngTitleService.setTitle(`${this.subTitle} - ${this.siteTitle}`);
    setTimeout(() => {
      this.renderer.selectRootElement('#content-title', true).focus();
    }, 200);
  }

  getSiteTitle(): string {
    return this.siteTitle;
  }

  getSubTitle(): string {
    return this.subTitle;
  }
}
