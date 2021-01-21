import { SIAUser } from "./siauser";
import { User } from "./user";


export class UserFactory {
	static getInstance(id: string, userInfo) {
		if (id === 'hydra') {
			return new SIAUser(userInfo);
		}
		return new User(userInfo);
	}
}