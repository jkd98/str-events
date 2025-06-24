import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-confirmar-cuenta',
  imports: [],
  templateUrl: './confirmar-cuenta.component.html',
  styleUrl: './confirmar-cuenta.component.css'
})
export class ConfirmarCuentaComponent implements OnInit{
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UsuarioService);
  private id = '';
  public msg = '';
  public success = false;
  private ruta = '';

    ngOnInit(): void {
      this.id = this.route.snapshot.paramMap.get('tkn') || '';
      this.userService.confirmAccount(this.id).pipe(
        tap({
          next: (res) => {
            if (res.status === 'success') {
              console.log(res);
              this.msg = res.msg;
              this.success = true;
              this.ruta = `/users/login`;
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
  
    onClose() {
      this.router.navigate([this.ruta]);
    }

}
