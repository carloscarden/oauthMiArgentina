import { environment } from 'src/environments/environment';
import { CNRTAuthConfig } from './cnrt.auth.config';

export const authConfig: Array<CNRTAuthConfig> = [
	// CNRT SIA: https://api.cnrt.gob.ar/oidc/.well-known/openid-configuration
	{
		id: 'hydra',
		name: 'cnrt-hydra',
		config: {
			issuer: environment.authConfig.issuer,
			responseType: 'id_token',
			redirectUri: environment.redirect_uri,
			logoutUrl: environment.authConfig.issuer + 'oauth2/auth/sessions/login/revoke',
			clientId: environment.authConfig.clientId,
			scope: '',
			strictDiscoveryDocumentValidation: false,
			disableAtHashCheck: true,
			customUserinfoEndpoint: environment.authConfig.customUserinfoEndpoint,
		},
	},
];
