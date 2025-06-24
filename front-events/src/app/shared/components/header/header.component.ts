import { Component, inject, signal } from '@angular/core';
import { SearchRoutesService } from '../../services/search-routes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private searchService = inject(SearchRoutesService);
  private paths = this.searchService.routesToNavigateAdmin;
  private router = inject(Router);
  results: any[] = [];

  buscar(term: string) {
    //console.log(term);
    if(term===''||term===null){
      this.results = [];
      return;
    }
    const regexp1 = /term/;
    const res = this.paths.filter(p => p.title.toLowerCase().includes(term) || p.id.toLowerCase().includes(term));
    console.log(res);
    this.results = res;
  }

  navegar(path: any) {
    this.router.navigate([path]);
  }


}
