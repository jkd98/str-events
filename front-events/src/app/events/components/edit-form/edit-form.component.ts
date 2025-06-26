import { Component, computed, inject, OnInit } from '@angular/core';
import { EventFormComponent } from '../event-form/event-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento, EventService } from '../../services/event.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CityService } from '../../../cities/services/cities.service';
import { AreaService } from '../../../areas/services/area.service';

@Component({
  selector: 'app-edit-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css', '../../../users/components/login/login.component.css']
})
export class EditFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private eventsService = inject(EventService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public eventSelected?: Partial<Evento>;

  private citiesService = inject(CityService);
  private areaService = inject(AreaService);
  cities = computed(this.citiesService.ciudades)
  areas = computed(this.areaService.areas);
  categories = [];
  idEvent = '';
  myForm: FormGroup = this.fb.group({
    eventName: ['', [Validators.required, Validators.minLength(3)]],
    date: ['', Validators.required],
    city: ['', Validators.required],
    areaInteres: ['', Validators.required],
    category: ['', Validators.required],
    maxCapacity: [1, [Validators.required, Validators.min(1)]],
    image: [null],  // Aquí guarda la imagen
  });

  ngOnInit(): void {
    // Suscribirse a cambios en el área de interés
    this.myForm.get('areaInteres')?.valueChanges.subscribe(areaId => {
      const selectedArea: any = this.areas().find(area => area._id === areaId);
      this.categories = selectedArea!.categorias;
      console.log(selectedArea)
      // Reiniciar categoría seleccionada al cambiar de área
      this.myForm.get('category')?.setValue('');
    });

    this.idEvent = this.route.snapshot.paramMap.get('id') || '';
    console.log(this.idEvent);
    
    this.eventsService.obtenerEventoPorId(this.idEvent).subscribe((resp) => {
      console.log(resp);
      this.eventSelected = resp.data;
      console.log(this.eventSelected);
      
      this.myForm.patchValue({
        eventName: this.eventSelected.eventName,
        date: this.eventSelected.date!.substring(0,10),
        city: this.eventSelected.city._id,
        areaInteres: this.eventSelected.areaInteres._id,
        category: this.eventSelected.category,
        maxCapacity: this.eventSelected.maxCapacity,
      })
    })

  }

  selectedFile?: File;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      this.selectedFile = undefined;
      this.myForm.patchValue({ image: null });
      return;
    }
    this.selectedFile = input.files[0];
    this.myForm.patchValue({ image: this.selectedFile });
    this.myForm.get('image')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    // Construimos FormData para enviar con la imagen
    const formData = new FormData();
    formData.append('eventName', this.myForm.get('eventName')?.value);
    formData.append('date', this.myForm.get('date')?.value);
    formData.append('city', this.myForm.get('city')?.value);
    formData.append('areaInteres', this.myForm.get('areaInteres')?.value);
    formData.append('category', this.myForm.get('category')?.value);
    formData.append('maxCapacity', this.myForm.get('maxCapacity')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
    console.log('FormData preparado para enviar:', formData);

    // Aquí deberías llamar a tu servicio Angular para enviar formData al backend
    // Ejemplo:
    this.eventsService.editarEvento(this.idEvent,formData).subscribe((resp)=>{
      console.log(resp);
      if(resp.status==='success'){
        // Reiniciamos formulario y archivo
        this.myForm.reset({ maxCapacity: 1 });
        this.selectedFile = undefined;
        this.router.navigate(['/events/all-events'])
      }
    });


  }
}
