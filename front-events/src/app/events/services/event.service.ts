import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface Evento {
  _id?: string;
  eventName: string;
  date: string;
  maxCapacity: number;
  city?: any;
  areaInteres?: any;
  participants?: any[];
  createdBy?: string;
  image?: string;
  reservated?: boolean;
  published?: boolean;
  category?: string;
}

interface ApiResponse<T> {
  status: string;
  msg: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);
  private router = inject(Router);
  // Señales para manejar estado
  public eventos = signal<Evento[]>([]);
  public eventoSeleccionado = signal<Evento | null>(null);
  public cargandoEventos = signal(false);
  public error = signal<string | null>(null);

  // Computed para obtener el total de eventos
  public totalEventos = computed(() => this.eventos().length);

  constructor() {
    //this.cargarEventos();
  }

  // Efecto para mostrar errores (ejemplo simple)
  mostrarErrores = effect(() => {
    if (this.error()) {
      console.error('Error en EventService:', this.error());
      // Podrías mostrar notificaciones aquí
      alert(this.error());
    }
  });

  cargarEventos() {
    if (this.cargandoEventos()) return;
    this.cargandoEventos.set(true);
    this.error.set(null);

    this.http.get<ApiResponse<Evento[]>>(`${environment.apiUrl}/events`)
      .pipe(
        tap({
          next: (resp) => {
            if (resp.status === 'success') {
              this.eventos.set(resp.data);
              console.log(this.eventos());
            } else {
              this.error.set(resp.msg);
            }
            this.cargandoEventos.set(false);
          },
          error: (err) => {
            this.error.set(err['error'].msg);
            this.cargandoEventos.set(false);
          }
        })
      )
      .subscribe();
  }

  obtenerEventoPorId(id: string) {
    this.error.set(null);
    return this.http.get<ApiResponse<Evento>>(`${environment.apiUrl}/events/${id}`)
      .pipe(
        tap({
          next: (resp) => {
            if (resp.status === 'success') {
              this.eventoSeleccionado.set(resp.data);
            } else {
              this.error.set(resp.msg);
            }
          },
          error: (err) => {
            this.error.set(err['error'].msg);
          }
        })
      );
  }

  crearEvento(formData: FormData) {
    this.error.set(null);
    return this.http.post<ApiResponse<Evento>>(`${environment.apiUrl}/events`, formData, {
      withCredentials: true
    }).pipe(
      tap({
        next: (resp) => {
          if (resp.status === 'success') {
            // Agrega el nuevo evento al listado
            this.eventos.update(list => [resp.data, ...list]);
          } else {
            this.error.set(resp.msg);
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    );
  }

  editarEvento(id: string, datos: FormData) {
    this.error.set(null);
    return this.http.put<ApiResponse<Evento>>(`${environment.apiUrl}/events/${id}`, datos, {
      withCredentials: true
    }).pipe(
      tap({
        next: (resp) => {
          if (resp.status === 'success') {
            this.eventos.update(list => list.map(ev => ev._id === id ? resp.data : ev));
            if (this.eventoSeleccionado()?._id === id) {
              this.eventoSeleccionado.set(resp.data);
            }
          } else {
            this.error.set(resp.msg);
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    );
  }

  eliminarEvento(id: string) {
    this.error.set(null);
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/events/${id}`, {
      withCredentials: true
    }).pipe(
      tap({
        next: (resp) => {
          if (resp.status === 'success') {
            this.eventos.update(list => list.filter(ev => ev._id !== id));
            if (this.eventoSeleccionado()?._id === id) {
              this.eventoSeleccionado.set(null);
            }
          } else {
            this.error.set(resp.msg);
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    );
  }

  cambiarEstadoPublicado(id: string) {
    this.error.set(null);
    return this.http.patch<ApiResponse<Evento>>(`${environment.apiUrl}/events/${id}/publicar`, {}, {
      withCredentials: true
    }).pipe(
      tap({
        next: (resp) => {
          if (resp.status === 'success') {
            console.log(resp.data);
            this.eventos.update(list => list.map(ev => ev._id === id ? resp.data : ev));
            /* if (this.eventoSeleccionado()?._id === id) {
              this.eventoSeleccionado.set(resp.data);
            } */
          } else {
            this.error.set(resp.msg);
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    );
  }

  agregarParticipante(idEvento: string, idUsuario: string) {
    this.error.set(null);
    return this.http.post<ApiResponse<Evento>>(`${environment.apiUrl}/events/${idEvento}/participantes`, { idUsuario }, {
      withCredentials: true
    }).pipe(
      tap({
        next: (resp) => {
          if (resp.status === 'success') {
            this.eventos.update(list => list.map(ev => ev._id === idEvento ? resp.data : ev));
            alert('Has hecho una reservación!')
          } else {
            this.error.set(resp.msg);
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    );
  }

  anularReserva(idEvento: string, idUsuario: string) {
    this.error.set(null);
    return this.http.delete<ApiResponse<Evento>>(`${environment.apiUrl}/events/${idEvento}/participantes`, {
      body: { idUsuario },
      withCredentials: true
    }).pipe(
      tap({
        next: (resp) => {
          if (resp.status === 'success') {
            alert('Has anulado tu reservación!')
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    );

  }

  buscar(filtros: {
    nombre?: string,
    areaInteres?: string,
    category?: string
  }) {
    this.cargandoEventos.set(true);
    this.error.set(null);
    let params = new HttpParams();

    if (filtros.nombre) {
      params = params.set('nombre', filtros.nombre);
    }

    if (filtros.areaInteres) {
      params = params.set('areaInteres', filtros.areaInteres);
    }

    if (filtros.category) {
      params = params.set('category', filtros.category);
    }


    return this.http.get<ApiResponse<Evento[]>>(`${environment.apiUrl}/events/buscar`,{params})
      .pipe(
        tap({
          next: (resp) => {
            if (resp.status === 'success') {
              this.eventos.set(resp.data);
              this.router.navigate(['/events/all-events']);
              console.log(this.eventos());
            } else {
              this.error.set(resp.msg);
            }
            this.cargandoEventos.set(false);
          },
          error: (err) => {
            this.error.set(err['error'].msg);
            this.cargandoEventos.set(false);
          }
        })
      )
      .subscribe();
  }
}
