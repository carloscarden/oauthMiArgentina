import { Empresa } from "./empresa";
import { Rol } from "./rol";
import { Usuario } from "./usuario";

export class User {
	private usuario: Usuario;
	roles: Rol[];
	empresas: Empresa[];
	permisos: string[];

	constructor(protected userInfo: any) {
		if (userInfo) {
			this.roles = [];
			if (userInfo.roles) {
				for (let i = 0; i < userInfo.roles.length; i++) {
					this.roles.push(new Rol(userInfo.roles[i]));
				}
			}

			this.empresas = [];
			if (userInfo.empresas) {
				for (let i = 0; i < userInfo.empresas.length; i++) {
					this.empresas.push(new Empresa(userInfo.empresas[i]));
				}
			}

			this.permisos = userInfo.permisos;
		}
	}

	getIdentifier() {
		if (this.userInfo) {
			const doc: string = ['cuit', 'cuil', 'dni', 'pasaporte', 'id'].find(
				(d) => d in this.userInfo && this.userInfo[d] && this.userInfo[d].length > 0
			);

			if (doc) {
				return this.userInfo[doc];
			}
		}

		return null;
	}

	/**
	 * Determina si el usuario tiene al menos uno de los roles enviados por parámetro
	 * @param rolList lista de roles a verificar
	 */
	hasAnyRol(rolList: string[]) {
		if (this.roles && rolList) {
			for (let i = 0; i < rolList.length; i++) {
				if (this.roles.find((r) => r.nombre === rolList[i])) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Determina si el usuario tiene todos los roles enviados por parámetro
	 * @param rolList lista de roles a verificar
	 */
	hasRoles(rolList: string[]) {
		if (this.roles && rolList) {
			for (let i = 0; i < rolList.length; i++) {
				if (!this.roles.find((r) => r.nombre === rolList[i])) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Determina si el usuario tiene una empresa
	 * @param idEmpresa a verificar
	 */
	hasEmpresa(idEmpresa) {
		if (this.empresas && idEmpresa) {
			if (this.empresas.find((e) => e.idEmpresa === idEmpresa)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Determina si el usuario tiene al menos uno de los permisos enviados por parámetro
	 * @param permList lista de permisos a verificar
	 */
	hasAnyPermiso(permList: string[]) {
		if (this.permisos && permList) {
			for (let i = 0; i < permList.length; i++) {
				if (this.permisos.find((r) => r === permList[i])) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Determina si el usuario tiene todos los permisos enviados por parámetro
	 * @param permList lista de permisos a verificar
	 */
	hasPermiso(permList: string[]) {
		if (this.permisos && permList) {
			for (let i = 0; i < permList.length; i++) {
				if (!this.permisos.find((r) => r === permList[i])) {
					return false;
				}
			}
		}

		return true;
	}

	getId() {
		if (this.userInfo && 'id' in this.userInfo) {
			return this.userInfo.id;
		}
	}

	getUsername() {
		if (this.userInfo && 'given_name' in this.userInfo) {
			return this.userInfo.given_name;
		}
	}

	getDisplayName() {
		if (this.userInfo && 'given_name' in this.userInfo) {
			return this.userInfo.given_name;
		}
		return null;
	}

	getPictureUrl() {
		if (this.userInfo && 'picture' in this.userInfo) {
			return this.userInfo.picture;
		}
		return null;
	}

	getFamilyName() {
		if (this.userInfo && 'family_name' in this.userInfo) {
			return this.userInfo.family_name;
		}
		return null;
	}

	getGivenName() {
		if (this.userInfo && 'given_name' in this.userInfo) {
			return this.userInfo.given_name;
		}
		return null;
	}

	getUsuario() {
		return this.usuario;
	}

	setUsuario(usuario: Usuario) {
		this.usuario = usuario;

		return this;
	}

	getUserRoles() {
		if (this.userInfo && this.userInfo.roles) {
			return this.userInfo.roles;
		}
	}

}