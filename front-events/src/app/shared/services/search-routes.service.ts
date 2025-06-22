import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchRoutesService {
  private admin = '4DMlN';
  public routesToNavigateAdmin = [
    {
      id: 'inicio',
      title: 'Inicio',
      description: 'Volver a la página de inicio',
      icon: 'fa-solid fa-house',
      type: 'route',
      route: '/events/home',
      role:['Cliente',this.admin]
    },
    {
      id: 'publicar evento',
      title: 'Publicar Evento',
      description: 'Publicar un nuevo evento',
      icon: 'fa-solid fa-house',
      type: 'route',
      route: '/events/create',
      role:[this.admin]

    },
    {
      id: 'eventos',
      title: 'Todos los eventos',
      description: 'Ver todos los eventos disponibles',
      icon: 'fa-solid fa-house',
      type: 'route',
      route: '/events/all-events',
      role:['Cliente',this.admin]
    },
    {
      id: 'crear cuenta',
      title: 'Crear cuenta',
      description: 'Crear cuenta nueva',
      icon: 'fa-solid fa-house',
      type: 'route',
      route: '/users/signup',
      role:['Cliente',this.admin]
    },
    {
      id: 'iniciar sesion',
      title: 'Iniciar sesión',
      description: 'Inicia sesion',
      icon: 'fa-solid fa-house',
      type: 'route',
      route: '/users/login',
      role:['Cliente',this.admin]
    }
  ];

  constructor() { }
}
