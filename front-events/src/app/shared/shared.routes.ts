import { Routes } from '@angular/router';
import { MsgGeneralComponent } from './components/msg-general/msg-general.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

export const sharedRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'msg-gnrl/:tkn',
                component: MsgGeneralComponent,
                data: {
                    descripcion:'Pagina para avisar si el token ha sido valido',
                    breadcrumb: 'Mensaje del sitio',
                    icon: 'home',
                },
            },
            {
                path: 'not-found',
                component: ErrorPageComponent,
                data: {
                    breadcrumb: 'Mensaje de error',
                    icon: 'home',
                },
            },
            {
                path: '**',
                redirectTo: 'msg-gnrl'
            }
        ]
    }
];
