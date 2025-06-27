import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
declare const grecaptcha: any;

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['../login/login.component.css', './registro-usuario.component.css']

})
export class RegistroUsuarioComponent implements OnInit {
  ngOnInit(): void {
    (window as any).captchaResolved = this.onCaptchaResolved.bind(this); // opcional si usas callback

    this.loadRecaptcha().then(() => {
      this.renderCaptcha();
    }).catch(() => {
      console.error('Error al cargar reCAPTCHA');
    });
  }
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  // Patrones de validación
  private emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  private phonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
  private strongPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasUpperCase && hasNumber && hasSpecialChar;

    return valid ? null : { weakPassword: true };
  };

  // Definir el validador primero
  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('pass');
    const rpass = control.get('rpass');
    return pass && rpass && pass.value !== rpass.value ? { passwordsNotMatch: true } : null;
  };

  showTimeoutDialog = signal(false); // para mostrar u ocultar el modal
  private router = inject(Router);

  captchaToken: string = '';
  captchaValido = false; // bandera para controlar el botón

  // Luego definir el FormGroup que lo usa
  registroForm: FormGroup = this.fb.group({
    name: ['jose', [Validators.required, Validators.minLength(2)]],
    lastN: ['atole', [Validators.required, Validators.minLength(2)]],
    email: ['josesitoelalto@gmail.com', [Validators.required, Validators.pattern(this.emailPattern)]],
    pass: ['Pass*12', [Validators.required, Validators.minLength(6),this.strongPasswordValidator]],
    rpass: ['Pass*12', [Validators.required]],
    address: ['Av. Ilinois', [Validators.required]],
    phone: ['', [Validators.pattern(this.phonePattern)]]
  }, { validators: this.passwordMatchValidator });

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const { name, lastN, email, pass, address, phone } = this.registroForm.value;

    const userData = {
      name,
      lastN,
      email,
      pass,
      address,
      ...(phone && { phone })
    };

    this.usuarioService.registrarUsuario(userData).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          console.log('Usuario registrado:', res.data);
          this.registroForm.reset();
          this.showTimeoutDialog.set(true);

        } else {
          alert(res.msg || 'Error en el registro');
        }
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        //alert('Ocurrió un error al registrar el usuario');
      }
    });

  }


  onCaptchaResolved() {
    const token = grecaptcha.getResponse();

    if (token) {
      this.captchaToken = token;
      this.captchaValido = true;
    } else {
      this.captchaToken = '';
      this.captchaValido = false;
    }
  }

  private loadRecaptcha(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('recaptcha-script')) {
        return resolve(); // ya está cargado
      }

      const script = document.createElement('script');
      script.id = 'recaptcha-script';
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      (window as any).onRecaptchaLoad = () => {
        resolve();
      };

      script.onerror = reject;
    });
  }

  private renderCaptcha(): void {
    (window as any).grecaptcha.render('recaptcha-container', {
      sitekey: environment.sitekey,
      callback: () => {
        this.captchaValido = true;
      }
    });
  }

  onClose() {
    this.showTimeoutDialog.set(false);
    this.router.navigate(['/events/home'])
  }
}