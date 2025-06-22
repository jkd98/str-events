import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UsuarioService } from '../../../users/services/usuario.service';
import { Router } from '@angular/router';
import { Evento, EventService } from '../../services/event.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { FiltersComponent } from '../../components/filters/filters.component';

@Component({
  imports: [DatePipe,FiltersComponent],
  templateUrl: './admin-events-page.component.html',
  styleUrl: './admin-events-page.component.css'
})
export class AdminEventsPageComponent implements OnInit {

  private userServ = inject(UsuarioService);
  private router = inject(Router);
  private eventService = inject(EventService);
  public baseURL = environment.apiUrl;
  public events = computed(() => {
    let evts = this.eventService.eventos().map(ev => {
      ev.reservated = this.isUserParticipant(ev);
      const regex1 = /^http/;
      if (ev.image != null && !regex1.test(ev.image||'') ) {
        //console.log(regex1.test(ev.image||''));
        ev.image = this.baseURL + '/public/uploads/' + ev.image;
      }
      return ev;
    })

    return evts;
  });

  public ROLE = '4DMlN';
  public usr = computed(() => {
    let usr = JSON.parse(this.userServ.user() || '{}');
    return usr;
  })
  public reservated = signal(false);

  ngOnInit(): void {

    this.eventService.cargarEventos();
  }

  reservation(id: string, item: Evento) {
    if (Object.keys(this.usr()).length === 0) {
      this.router.navigate(['/users/login']);
      return;
    }

    //Registrar al evento
    const { _id: idUsuario } = this.usr();
    console.log(id, idUsuario);
    this.eventService.agregarParticipante(id, idUsuario).subscribe(() => {
      this.ngOnInit()
    });

  }

  anularReservacion(id: string, item: Evento) {
    const { _id: idUsuario } = this.usr();
    this.eventService.anularReserva(id, idUsuario).subscribe(() => {
      this.ngOnInit()
    });
  }

  isUserParticipant(event: Evento) {
    const reserv = event.participants?.some(p => p._id === this.usr()._id) || false;
    //console.log(reserv);
    return reserv;
  }

  onEdit(id: string) {
    console.log('Editando:', id);
    this.router.navigate(['/events/edit/', id]);
  }
  onDelete(id: string) {
    console.log('Eliminando:', id);
    this.eventService.eliminarEvento(id).subscribe();
  }
  onPublished(id: string) {
    console.log('Despublicando:', id);
    this.eventService.cambiarEstadoPublicado(id).subscribe();
  }

}
