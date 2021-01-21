import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CoreFacadeService {
  cargandoBS = new BehaviorSubject<boolean>(false);


  constructor(private authService: AuthService) { }


  get isAuthtenticate$() {
		return this.authService.isAuthenticatedObs;
	}

	get user$() {
		return this.authService.currentUser;
	}

	set cargando(status: boolean) {
		this.cargandoBS.next(status);
	}

	get cargando$() {
		return this.cargandoBS.asObservable().pipe(distinctUntilChanged(), delay(0));
	}

}
