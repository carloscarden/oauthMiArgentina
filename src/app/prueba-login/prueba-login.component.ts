import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { CoreFacadeService } from '../_services/core-facade.service';

@Component({
	selector: 'app-prueba-login',
	templateUrl: './prueba-login.component.html',
	styleUrls: ['./prueba-login.component.scss']
})
export class PruebaLoginComponent implements OnInit {
	public usuario: User;

	constructor(
		private coreFacade: CoreFacadeService,
		private authService: AuthService,
		private httpclient: HttpClient

	) { }

	ngOnInit(): void {

		this.coreFacade.user$.subscribe(
			userResult => {
				console.log(userResult);
				if (this.usuario == undefined) {
					if (userResult !== null) {
						this.usuario = userResult;
					}
				}
			},
			errorCoreFace => {
				console.log('errorCoreFace ', errorCoreFace);
			}

		);
	}


	get user$() {
		return this.coreFacade.user$;
	}

	logout() {
		localStorage.removeItem('seleccionoEmpresa');
		this.authService.logout();

	}

	goToLogin() {
		this.authService.login();
	}


}
