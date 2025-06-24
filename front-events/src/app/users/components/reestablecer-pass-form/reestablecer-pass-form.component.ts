import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-reestablecer-pass-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reestablecer-pass-form.component.html',
  styleUrls: ['./reestablecer-pass-form.component.css', '../login/login.component.css']
})
export class ReestablecerPassFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  public usuarioService = inject(UsuarioService);
  showTimeoutDialog = signal(false); // para mostrar u ocultar el modal
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  // Definir el validador primero
  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('pass');
    const rpass = control.get('rpass');
    return pass && rpass && pass.value !== rpass.value ? { passwordsNotMatch: true } : null;
  };
  private id = '';
  public msg = '';
  private ruta = '';
  public error = false;


  recuperarForm: FormGroup = this.fb.group({
    pass: ['', [Validators.required, Validators.minLength(6)]],
    rpass: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('tkn') || '';
  }

  onSubmit() {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }
    const { pass,rpass } = this.recuperarForm.value;

    this.usuarioService.reestablecerPass(this.id, pass,rpass).pipe(
      tap({
        next: (res) => {
          if (res.status === 'success') {
            this.showTimeoutDialog.set(true);
            this.msg = res.msg;
            this.ruta = `/users/login`;

            this.error = false;
          } else {
            this.msg = res.msg;
          }
        },
        error: (err) => {
          console.log(err);
          //this.error.set(err['error'].msg);
          this.showTimeoutDialog.set(true);
          this.msg = err['error'].msg;
          this.ruta = `/users/reset-pass/${this.id}`;
          this.error = true;
        }
      })
    ).subscribe();
  }

  onClose() {
    this.showTimeoutDialog.set(false);
    this.router.navigate([this.ruta])
  }
}
