import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiResponse, Evento, EventService } from '../../events/services/event.service';
import { map, Observable } from 'rxjs';

export const infoBreadcrumbsResolver: ResolveFn<Observable<string>> = (route, state) => {
  const id = route.params['id'];
  const eventService = inject(EventService);
  return eventService.obtenerEventoPorId(id).pipe(
    map(res => 'Editar evento: ' + res.data['eventName'])
  );
};
