import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../_models/usuario';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc-codeflow-pkce';
import { CNRTAuthConfig } from '../config/cnrt.auth.config';
import { User } from '../_models/user';
import { UserFactory } from '../_models/user-factory';
import { authConfig } from '../config/authConfig';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	protected usuario: Usuario;

	private currentUserSubject = new BehaviorSubject<User>(null);
	public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
	private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);


	constructor(
		private oauthService: OAuthService
	) { }


	/**
	   * Inicializa el Authenticator.
	   * @return AuthService this
	   */
	initialize(): AuthService {
		console.log("caca")
		this.oauthService.configure(this.getCurrentConfig()['config']);
		console.log(this.getCurrentConfig()['config']);
		this.oauthService.tokenValidationHandler = new JwksValidationHandler();
		this.oauthService.setStorage(localStorage);

		this.oauthService.events.subscribe((e) => {
			console.log(e);
			if (['discovery_document_load_error', 'discovery_document_validation_error'].indexOf(e.type) >= 0) {
				this.clearUserInfo();
			} else if (e.type === 'session_terminated') {
				if (this.oauthService.getRefreshToken()) {
					this.oauthService.refreshToken();
				} else {
					this.clearUserInfo();
					// this.router.navigate(['/login']);
				}
			} else if (e.type === 'token_refreshed') {
				this.oauthService.loadUserProfile().then(() => { });
			} else if (e.type === 'token_expires') {
				this.oauthService.refreshToken();
			} else if (e.type === 'user_profile_loaded') {
				this.userChangeCallback();
			} else if (e.type === 'logout') {
				// this.router.navigate(['/login']);
			}
		});

		this.oauthService.loadDiscoveryDocument().then(() => {
			this.oauthService
				.tryLogin()
				.then(() => {
					if (this.oauthService.getRefreshToken()) {
						this.oauthService.refreshToken();
					}
				})
				.catch((msg) => {
					this.clearUserInfo();
				});
		});
		return this;
	}

	/**
	   * Nos lleva a la pantalla de login
	   */
	login(): void {
		this.oauthService.initAuthorizationCodeFlow();
	}



	/**
	   * Cierra la sesión, tanto en el endpoint como en nuestro dispositivo.
	   * @return AuthService this
	   */
	logout(): AuthService {
		// @TODO #4573 Terminar la sessión al desloguear
		this.oauthService.logOut();

		return this;
	}




	clearUserInfo(noRedirect: boolean = false) {
		this.oauthService.logOut(false);
	}


	/**
	   * Retorna el id_token (JWT) de OAuth
	   */
	getIdToken(): string {
		return this.oauthService.getIdToken();
	}

	/**
	 * Retorna el access_token de OAuth
	 */
	getAccessToken(): string {
		return this.oauthService.getAccessToken();
	}


	/**
	   * Nos responde si el usuario está autenticado.
	   */
	isAuthenticated(): boolean {
		const authOk = this.oauthService.hasValidIdToken();
		this.isAuthenticatedSubject.next(authOk);
		return authOk;
	}


	get isAuthenticatedObs() {
		return this.isAuthenticatedSubject.asObservable().pipe(distinctUntilChanged());
	}


	/**
	   * Obtiene una instancia del usuario en cuestión. Puede ser un usuario de google,
	   * de AFIP. La clase usuario, básicamente, parsea la información devuelta por el
	   * IDP y la normaliza para nuestro uso.
	   * @return User
	   */
	getUser() {
		if (null !== this.getCurrentConfig()) {
			return UserFactory.getInstance(this.getCurrentConfig()['id'], this.getIdentityClaims());
		}

		return null;
	}


	userChangeCallback() {
		const user = this.getUser();
		if (user && user.getId()) {
			if (!this.usuario || this.usuario.id !== user.getId()) {
				this.usuario = Usuario.fromUser(user);
			}

			// Validamos que el usuario posea algunos de los roles utilizados en este proyecto
			if (user && user.roles.length > 0 && !user.hasAnyRol([])) {
				// AppAlertService.swalError(
				//   "El usuario no posee ninguno de los roles necesarios para esta aplicación"
				// );
			}
			this.currentUserSubject.next(user);
		} else {
			this.usuario = null;
			this.currentUserSubject.next(null);
		}
	}

	/**
	   * Obtiene la configuración de autenticación actual.
	   * Cada una de estas representa la configuración del IDP.
	   *
	   * @return CNRTAuthConfig
	   */
	getCurrentConfig(): CNRTAuthConfig {
		return authConfig.find((c) => c.id === environment.current_idp);
	}


	/**
	   * Devuelve información sobre el usuario logueado.
	   */
	getIdentityClaims() {
		return this.oauthService.getIdentityClaims();
	}

}
