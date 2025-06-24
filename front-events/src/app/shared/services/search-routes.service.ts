import { Injectable } from '@angular/core';

export interface SiteRoutes {
  id: string,
  title: string,
  description: string,
  icon: string,
  type: string,
  route: string
  role?:[]
}

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
      id: 'eventos',
      title: 'Todos los eventos',
      description: 'Ver todos los eventos disponibles',
      icon: 'fa-solid fa-circle-dot',
      type: 'route',
      route: '/events/all-events',
      role:['Cliente',this.admin]
    },
    {
      id: 'conciertos',
      title: 'Todos los conciertos',
      description: 'Ver todos los conciertos disponibles',
      icon: 'fa-solid fa-circle-dot',
      type: 'route',
      route: '/events/category/Conciertos',
      role:['Cliente',this.admin]
    },
    {
      id: 'deportes',
      title: 'Todos los eventos deportivos',
      description: 'Ver todos los eventos deportivos disponibles',
      icon: 'fa-solid fa-circle-dot',
      type: 'route',
      route: '/events/category/Deportes',
      role:['Cliente',this.admin]
    },
    {
      id: 'cultura',
      title: 'Todos los eventos culturales',
      description: 'Ver todos los eventos culturales disponibles',
      icon: 'fa-solid fa-circle-dot',
      type: 'route',
      route: '/events/category/Culturales',
      role:['Cliente',this.admin]
    },
    {
      id: 'informativo',
      title: 'Todos los eventos informativos',
      description: 'Ver todos los eventos informativos disponibles',
      icon: 'fa-solid fa-circle-dot',
      type: 'route',
      route: '/events/category/Informativos',
      role:['Cliente',this.admin]
    },
    {
      id: 'crear evento',
      title: 'Publicar Evento',
      description: 'Publicar un nuevo evento',
      icon: 'fa-solid fa-circle-dot',
      type: 'route',
      route: '/events/create',
      role:[this.admin]

    },
    {
      id: 'registro',
      title: 'Crear cuenta',
      description: 'Crear cuenta nueva',
      icon: 'fa-solid fa-circle-dot',
      type: 'route',
      route: '/users/signup',
      role:['Cliente',this.admin]
    },
    {
      id: 'iniciar sesion',
      title: 'Iniciar sesión',
      description: 'Inicia sesion',
      icon: 'fa-solid fa-circle-dot',
      type: 'route',
      route: '/users/login',
      role:['Cliente',this.admin]
    },
    {
      id: 'recuperar contraseña',
      title: 'Reestablecer contraseña',
      description: 'Reestablecer contraseña',
      icon: 'fa-solid fa-circle-dot',
      type: 'route',
      route: '/users/recover-pass',
      role:['Cliente',this.admin]
    }
  ];

  constructor() { }
}
