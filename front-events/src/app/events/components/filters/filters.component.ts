import { Component, computed, inject, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AreaService } from '../../../areas/services/area.service';

@Component({
  selector: 'app-filters',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements OnInit {

  private eventService = inject(EventService);
  private fb = inject(FormBuilder);
  private areaService = inject(AreaService);

  public filtros = this.fb.group({
    nombre: [''],
    areaInteres: [''],
    category: ['']
  });

  areas = computed(this.areaService.areas);
  categorias = [];

  ngOnInit(): void {
    this.filtros.get('areaInteres')?.valueChanges.subscribe(name => {
      const selectedArea: any = this.areas().find(area => area.name === name);
      this.categorias = selectedArea!.categorias;
      console.log(selectedArea)
      // Reiniciar categoría seleccionada al cambiar de área
      this.filtros.get('category')?.setValue('');
    });
  }

  buscar() {
    const filtro = {
      nombre: this.filtros.controls['nombre'].value || '',
      areaInteres: this.filtros.controls['areaInteres'].value || '',
      category: this.filtros.controls['category'].value || '',
    }

    this.eventService.buscar(filtro).subscribe();
  }

}
