import { Component, inject } from '@angular/core';
import { SearchRoutesService } from '../../services/search-routes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-map',
  imports: [],
  templateUrl: './site-map.component.html',
  styleUrl: './site-map.component.css'
})
export class SiteMapComponent {
  private searchRService = inject(SearchRoutesService);
  private router = inject(Router);
  public routes = this.searchRService.routesToNavigateAdmin;
  
  navigate(route: string) {
    this.router.navigate([route]);
  }
}
