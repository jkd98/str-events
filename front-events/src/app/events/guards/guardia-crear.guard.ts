import { computed, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../../users/services/usuario.service';

export const guardiaCrearGuard: CanActivateFn = (route, state) => {
  const userServ = inject(UsuarioService);
  const ROLE = '4DMlN';
  let user = computed(()=> JSON.parse( userServ.user() || '{}') )
  const router = inject(Router);
  if(user().role===ROLE){
    return true;
  }
  router.navigate(['events/home']);
  return false;
};
