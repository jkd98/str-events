import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-pass-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './recuperar-pass-form.component.html',
  styleUrls: ['./recuperar-pass-form.component.css', '../login/login.component.css']
})
export class RecuperarPassFormComponent {
  private fb = inject(FormBuilder);
  public usuarioService = inject(UsuarioService);
  showTimeoutDialog = signal(false); // para mostrar u ocultar el modal
  private router = inject(Router);

  recuperarForm: FormGroup = this.fb.group({
    email: ['davidlrj9999@gmail.com', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }
    const { email } = this.recuperarForm.value;

    this.usuarioService.recuperarPass(email).subscribe((res) => {
      if(res.status==='success'){
        console.log(email);
        this.showTimeoutDialog.set(true);
      }
    });
  }

  onClose() {
    this.showTimeoutDialog.set(false);
    this.router.navigate(['/events/home'])
  }
}
