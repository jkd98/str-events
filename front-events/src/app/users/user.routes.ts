import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { guardiaLoginGuard } from './guards/guardia-login.guard';
import { RecuperarPassFormComponent } from './components/recuperar-pass-form/recuperar-pass-form.component';
import { ReestablecerPassFormComponent } from './components/reestablecer-pass-form/reestablecer-pass-form.component';
import { ConfirmarCuentaComponent } from './components/confirmar-cuenta/confirmar-cuenta.component';

export const userRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginComponent,
                data: {
                    breadcrumb: 'Iniciar Sesión',
                    icon: 'home',
                    description: 'Página de inicio con resumen de contenidos',
                    excludeFromSitemap: true
                },
                canActivate:[guardiaLoginGuard]
            },
            {
                path: 'signup',
                component: RegistroUsuarioComponent,
                data: {
                    breadcrumb: 'Crear Cuenta',
                    icon: 'home',
                    description: 'Página de inicio con resumen de contenidos',
                    excludeFromSitemap: true
                }
            },
            {
                path: 'recover-pass',
                component: RecuperarPassFormComponent,
                data: {
                    breadcrumb: 'Recuperar Contraseña',
                    icon: 'home',
                    description: 'Página de recuperar contraseña',
                    excludeFromSitemap: true
                }
            },
            {
                path: 'reset-pass/:tkn',
                component: ReestablecerPassFormComponent,
                data: {
                    breadcrumb: 'Reestablecer Contraseña',
                    icon: 'home',
                    description: 'Página de reestablecer contraseña',
                    excludeFromSitemap: true
                }
            },
            {
                path: 'confirm/:tkn',
                component: ConfirmarCuentaComponent,
                data: {
                    breadcrumb: 'Confirmar Cuenta',
                    icon: 'home',
                    description: 'Página para confirmar la cuenta',
                    excludeFromSitemap: true
                }
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    }
];
