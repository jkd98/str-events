import { Component, computed, inject, OnInit } from '@angular/core';
import { Evento, EventService } from '../../services/event.service';
import { UsuarioService } from '../../../users/services/usuario.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  imports: [DatePipe,LoaderComponent],
  templateUrl: './category-sports.component.html',
  styleUrl: './category-sports.component.css'
})
export class CategorySportsComponent implements OnInit {
  private userServ = inject(UsuarioService);
  private eventService = inject(EventService);
  private router = inject(Router);
  public baseURL = environment.apiUrl;
  public loading = this.eventService.cargandoEventos;



  public usr = computed(() => {
    let usr = JSON.parse(this.userServ.user() || '{}');
    return usr;
  })

  public events = computed(() => {
    let evts = this.eventService.eventos().map(ev => {
      ev.reservated = this.isUserParticipant(ev);
      const regex1 = /^http/;
      if (ev.image != null && !regex1.test(ev.image || '')) {
        //console.log(regex1.test(ev.image||''));
        ev.image = this.baseURL + '/public/uploads/' + ev.image;
      }
      return ev;
    })

    return evts;
  });

  ngOnInit(): void {

    //this.eventService.cargarEventos();
    this.eventService.buscar({ areaInteres: 'Deportes' }).subscribe();;
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
}
