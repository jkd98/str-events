import { Injectable, Signal, computed, signal } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface BreadcrumbEntry {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsT1Service {
  private readonly _breadcrumbs = signal<BreadcrumbEntry[]>([]);
  public readonly breadcrumbSignal: Signal<BreadcrumbEntry[]> = computed(() => this._breadcrumbs());

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const rootSnapshot = this.router.routerState.snapshot.root;
        const breadcrumbs = this.buildBreadcrumbs(rootSnapshot);
        this._breadcrumbs.set(breadcrumbs);
      });
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: BreadcrumbEntry[] = []
  ): BreadcrumbEntry[] {
    const routeURL = route.url.map(segment => segment.path).join('/');
    if (routeURL) {
      url += `/${routeURL}`;
    }

    const label = route.data['breadcrumb'];

    if (label) {
      const lastBreadcrumb = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : null;

      // Evitar duplicados: si el label es igual al último no lo agregamos
      if (!lastBreadcrumb || lastBreadcrumb.label !== label) {
        breadcrumbs.push({ label, url });
      }
    }

    for (const child of route.children) {
      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

}
