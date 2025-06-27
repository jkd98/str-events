import { Routes } from '@angular/router';
import { EventsHomePageComponent } from './pages/events-home-page/events-home-page.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { guardiaCrearGuard } from './guards/guardia-crear.guard';
import { AdminEventsPageComponent } from './pages/admin-events-page/admin-events-page.component';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { CategoryConcertsComponent } from './pages/category-concerts/category-concerts.component';
import { CategorySportsComponent } from './pages/category-sports/category-sports.component';
import { CategoryInfoComponent } from './pages/category-info/category-info.component';
import { CategoryCulturalComponent } from './pages/category-cultural/category-cultural.component';
import { SiteMapComponent } from '../shared/components/site-map/site-map.component';
import { infoBreadcrumbsResolver } from '../shared/resolvers/info-breadcrumbs.resolver';
import { EventsLayoutComponent } from './pages/events-layout/events-layout.component';
import { AdminEventsLayoutComponent } from './pages/admin-events-layout/admin-events-layout.component';

export const eventRoutes: Routes = [

    {
        path: 'home',
        component: EventsHomePageComponent,
        data: {
            breadcrumb: 'Home',
            icon: 'home',
            description: 'Página de inicio con resumen de contenidos',
            excludeFromSitemap: true
        }
    },
    {
        path: 'create',
        component: EventFormComponent,
        data: {
            breadcrumb: 'Publicar Evento',
            icon: 'create',
            description: 'Página para publicar un nuevo evento',
            excludeFromSitemap: true
        },
        canActivate: [guardiaCrearGuard]
    },
    {
        path: 'all-events',
        component: AdminEventsLayoutComponent,
        data: {
            breadcrumb: 'Todos los eventos',
            icon: 'all-events',
            description: 'Página para ver todos los eventos',
            excludeFromSitemap: true
        },
        children: [
            {
                path: '',
                component: AdminEventsPageComponent,
            },
            {
                path: 'edit/:id',
                component: EditFormComponent,
                resolve: { breadcrumb: infoBreadcrumbsResolver },
                data: {
                    breadcrumb: 'Editar Evento',
                    icon: 'all-events',
                    description: 'Página para editar un evento',
                    excludeFromSitemap: true
                },
                canActivate: [guardiaCrearGuard]
            }
        ]
    },
    {
        path: 'category/Conciertos',
        component: CategoryConcertsComponent,
        data: {
            breadcrumb: 'Todos los conciertos',
            icon: 'all-events',
            description: 'Página para ver todos los eventos ',
            excludeFromSitemap: true
        }
    },
    {
        path: 'category/Deportes',
        component: CategorySportsComponent,
        data: {
            breadcrumb: 'Todos los eventos deportivos',
            icon: 'all-events',
            description: 'Página para ver todos los eventos ',
            excludeFromSitemap: true
        }
    },
    {
        path: 'category/Informativos',
        component: CategoryInfoComponent,
        data: {
            breadcrumb: 'Todos los eventos informativos',
            icon: 'all-events',
            description: 'Página para ver todos los eventos ',
            excludeFromSitemap: true
        }
    },
    {
        path: 'category/Culturales',
        component: CategoryCulturalComponent,
        data: {
            breadcrumb: 'Todos los eventos culturales',
            icon: 'all-events',
            description: 'Página para ver todos los eventos ',
            excludeFromSitemap: true
        }
    },
    {
        path: 'site-map',
        component: SiteMapComponent,
        data: {
            breadcrumb: 'Mapa del sitio',
            icon: 'all-events',
            description: 'Página que muestra el mapa del sitio',
            excludeFromSitemap: true
        },
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
