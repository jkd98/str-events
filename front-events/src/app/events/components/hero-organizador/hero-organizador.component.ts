import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../../users/services/usuario.service';
import { tap } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-organizador',
  imports: [ReactiveFormsModule],
  templateUrl: './hero-organizador.component.html',
  styleUrl: './hero-organizador.component.css'
})
export class HeroOrganizadorComponent {
  private usrServ = inject(UsuarioService);
  private fb = inject(FormBuilder);
  susForm = this.fb.group({ email: [''] });
  suscrip() {
    const { email } = this.susForm.value;
    this.usrServ.suscrip(email!).pipe(
      tap({
        next: (res) => {
          this.susForm.reset({email:''});
          if (res.status === 'success') {
            console.log(res);
            /* this.msg = res.msg;
            this.success = true;
            this.ruta = `/users/login`; */

            alert(res.msg);
          } else {
            /* this.msg = res.msg;
            this.success = false;
            this.ruta = '/events/inicio'; */
          }
        },
        error: (err) => {
          /* this.msg = err['error'].msg;
          this.success = false;
          this.ruta = '/events/inicio'; */
          alert(err['error'].msg);

        }
      })
    ).subscribe(() => {

    });
  }

}
