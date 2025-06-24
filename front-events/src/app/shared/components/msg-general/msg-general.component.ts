import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../users/services/usuario.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-msg-general',
  imports: [],
  templateUrl: './msg-general.component.html',
  styleUrl: './msg-general.component.css'
})
export class MsgGeneralComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UsuarioService);
  private id = '';
  public msg = '';
  public success = false;
  ruta = ''

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('tkn') || '';
    this.userService.comporbarTKN(this.id).pipe(
      tap({
        next: (res) => {
          if (res.status === 'success') {
            console.log(res);
            this.msg = res.msg;
            this.success = true;
            this.ruta = `/users/reset-pass/${this.id}`;
          } else {
            this.msg = res.msg;
            this.success = false;
            this.ruta = '/events/inicio';
          }
        },
        error: (err) => {
          this.msg = err['error'].msg;
          this.success = false;
          this.ruta = '/events/inicio';
        }
      })
    ).subscribe();

  }

  onClose(ruta: string) {
    this.router.navigate([ruta]);
  }

}
