import { Component, inject } from '@angular/core';
import { SearchRoutesService } from '../../services/search-routes.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private searchService = inject(SearchRoutesService);
  private paths = this.searchService.routesToNavigateAdmin;

  buscar(term: string) {
    //console.log(term);
    const regexp1 = /term/;
    const result = this.paths.filter(p=> p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) );
    console.log(result);
  }

}
