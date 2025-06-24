import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

export interface Usuario {
  _id?: string;
  name: string;
  email: string;
  pass?: string;
  confirmado?: boolean;
}

interface ApiResponse<T> {
  status: string;
  msg: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private router = inject(Router);

  public usuarios = signal<Usuario[]>([]);
  public usuarioSeleccionado = signal<Usuario | null>(null);
  public user = signal<string | null>(null);

  public cargando = signal(false);
  public fase = signal('login');

  public error = signal<string | null>(null);

  public totalUsuarios = computed(() => this.usuarios().length);

  constructor() {
    //this.cargarUsuarios();
    this.user.set(window.sessionStorage.getItem('usr'));

  }

  mostrarErrores = effect(() => {
    if (this.error()) {
      console.error('Error en UsuarioService:', this.error());
      alert(this.error());
    }
  });

  cargarUsuarios() {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<ApiResponse<Usuario[]>>(`${environment.apiUrl}/users`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.usuarios.set(res.data);
            } else {
              this.error.set(res.msg);
            }
            this.cargando.set(false);
          },
          error: (err) => {
            this.error.set(err['error'].msg);
            this.cargando.set(false);
          }
        })
      )
      .subscribe();
  }

  registrarUsuario(usuario: { name: string; email: string; pass: string }) {
    this.error.set(null);
    return this.http.post<ApiResponse<{ id: string }>>(
      `${environment.apiUrl}/users/registro`,
      usuario // ← ya no usamos FormData
    ).pipe(
      tap({
        next: (res) => {
          if (res.status !== 'success') {
            this.error.set(res.msg);
          }
        },
        error: (err) => {
          this.error.set(err['error'].msg);
        }
      })
    );
  }


  obtenerUsuario(id: string) {
    this.http.get<ApiResponse<Usuario>>(`${environment.apiUrl}/users/${id}`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.usuarioSeleccionado.set(res.data);
            } else {
              this.error.set(res.msg);
            }
          },
          error: (err) => {
            this.error.set(err['error'].msg);
          }
        })
      )
      .subscribe();
  }

  eliminarUsuario(id: string) {
    this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/users/${id}`)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.usuarios.update(users => users.filter(u => u._id !== id));
            } else {
              this.error.set(res.msg);
            }
          },
          error: (err) => {
            this.error.set(err['error'].msg);
          }
        })
      )
      .subscribe();
  }

  editarUsuario(id: string, data: Partial<Usuario>) {
    this.http.put<ApiResponse<Usuario>>(`${environment.apiUrl}/users/${id}`, data)
      .pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              this.usuarios.update(users => users.map(u => u._id === id ? res.data : u));
              if (this.usuarioSeleccionado()?._id === id) {
                this.usuarioSeleccionado.set(res.data);
              }
            } else {
              this.error.set(res.msg);
            }
          },
          error: (err) => {
            this.error.set(err['error'].msg);
          }
        })
      )
      .subscribe();
  }

  loginUsuario(email: string, pass: string) {
    this.error.set(null);

    return this.http.post<ApiResponse<Usuario>>(
      `${environment.apiUrl}/users/login`,
      { email, pass },
      {
        withCredentials: true // necesario para que la cookie se guarde
      }
    ).pipe(
      tap({
        next: (res) => {
          if (res.status === '2fa') {
            /* this.usuarioSeleccionado.set(res.data);
            window.sessionStorage.setItem('usr', JSON.stringify( this.usuarioSeleccionado() ) );
            this.user.set(window.sessionStorage.getItem('usr'));
            console.log(this.user());
            this.router.navigate(['/events/home']) */
            this.fase.set('codigo');

          } else {
            this.error.set(res.msg);
          }
        },
        error: (err) => {
          console.log(err);
          this.error.set(err['error'].msg);
        }
      })
    );
  }

  verificarCodigo(email: string, codigo: string) {
    console.log('verificando...')
    this.error.set(null);

    return this.http.post<ApiResponse<Usuario>>(
      `${environment.apiUrl}/users/verificar-codigo`,
      { email, codigo },
      {
        withCredentials: true // necesario para que la cookie se guarde
      }
    ).pipe(
      tap({
        next: (res) => {
          if (res.status === 'success') {
            console.log(res)
            this.usuarioSeleccionado.set(res.data);
            window.sessionStorage.setItem('usr', JSON.stringify(this.usuarioSeleccionado()));
            this.user.set(window.sessionStorage.getItem('usr'));
            console.log(this.user());
            this.fase.set('login');
            this.router.navigate(['/events/home'])

          } else {
            this.error.set(res.msg);
          }
        },
        error: (err) => {
          console.log(err);
          this.error.set(err['error'].msg);
        }
      })
    );
  }

  logout() {
    return this.http.post<any>(`${environment.apiUrl}/users/logout`, {}, { withCredentials: true });
  }

  recuperarPass(email: string) {
    this.error.set(null);

    return this.http.post<ApiResponse<Usuario>>(
      `${environment.apiUrl}/users/olvide-password`,
      { email },
      {
        withCredentials: true // necesario para que la cookie se guarde
      }
    ).pipe(
      tap({
        next: (res) => {
          if (res.status === 'success') {
            /* this.usuarioSeleccionado.set(res.data);
            window.sessionStorage.setItem('usr', JSON.stringify( this.usuarioSeleccionado() ) );
            this.user.set(window.sessionStorage.getItem('usr'));
            console.log(this.user());
            this.router.navigate(['/events/home']) */
            //this.fase.set('codigo');
            //this.router.navigate(['']);
            console.log('success');

          } else {
            this.error.set(res.msg);
          }
        },
        error: (err) => {
          console.log(err);
          this.error.set(err['error'].msg);
        }
      })
    );
  }

  comporbarTKN(tkn: string) {
    this.error.set(null);

    return this.http.get<ApiResponse<Usuario>>(
      `${environment.apiUrl}/users/olvide-password/${tkn}`,
      {
        withCredentials: true // necesario para que la cookie se guarde
      }
    )
  }

  reestablecerPass(tkn:string,pass: string,rpass:string) {
    this.error.set(null);

    return this.http.post<ApiResponse<Usuario>>(
      `${environment.apiUrl}/users/olvide-password/${tkn}`,
      { pass,rpass },
      {
        withCredentials: true // necesario para que la cookie se guarde
      }
    )
  }

    confirmAccount(tkn: string) {
    this.error.set(null);

    return this.http.get<ApiResponse<Usuario>>(
      `${environment.apiUrl}/users/confirmar/${tkn}`,
      {
        withCredentials: true // necesario para que la cookie se guarde
      }
    )
  }

  suscrip(email:string) {
    this.error.set(null);

    return this.http.post<ApiResponse<Usuario>>(
      `${environment.apiUrl}/events/suscrip`,
      { email },
      {
        withCredentials: true // necesario para que la cookie se guarde
      }
    )
  }

}
