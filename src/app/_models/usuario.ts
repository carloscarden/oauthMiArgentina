import { User } from "./user";

export class Usuario {

    id!: number;
    identifier!: string;
    apellido: string;
    nombre: string;
    email: string;

    constructor(data: { id: number; identifier: string; apellido: string; nombre: string; email: string; } | undefined) {
        if (data) {
            this.id = data.id;
            this.identifier = data.identifier;
            this.apellido = data.apellido;
            this.nombre = data.nombre;
            this.email = data.email;
        }
    }


    static fromUser(user: User): Usuario {
        const usuario: Usuario = new Usuario(undefined);

		usuario.identifier = user.getIdentifier();
		usuario.apellido = user.getFamilyName();
		usuario.nombre = user.getGivenName();
		usuario.email = null;

		return usuario;
    }
}
