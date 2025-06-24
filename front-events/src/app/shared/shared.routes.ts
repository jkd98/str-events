import { Routes } from '@angular/router';
import { MsgGeneralComponent } from './components/msg-general/msg-general.component';

export const sharedRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'msg-gnrl/:tkn',
                component: MsgGeneralComponent,
                data: {
                    breadcrumb: 'Mensaje del sitio',
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
