import Keycloak from 'keycloak-js';


const keycloakConfig = {
    url: process.env.REACT_APP_KEYCLOAK_URL || 'default_url',
    realm: process.env.REACT_APP_KEYCLOAK_REALM || 'default_realm',
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'default_client_id',
};
const keycloak = new Keycloak(keycloakConfig);
export const isAdmin = (): boolean => {
    return keycloak && keycloak.idTokenParsed?.roles?.includes('ADMIN');
};
export default keycloak;
export const isAuthorized = (roles: string[]): boolean => {
    if (keycloak && roles) {
        return roles.some((role) => {
            const hasRealmRole = keycloak.hasRealmRole(role);
            const hasResourceRole = keycloak.hasResourceRole(role);
            return hasRealmRole || hasResourceRole;
        });
    }
    return false;
};
export const getUserId = (): string | null | undefined => {
    if (keycloak && keycloak.tokenParsed) {
        return keycloak.tokenParsed.sub;
    }
    return null;
};
export const getUserPhoneNumber = (): string | null | undefined => {
    if (keycloak && keycloak.tokenParsed) {
        return keycloak.tokenParsed['phoneNumber'];
    }
    return null;
};
export const isUserInGroup = (groupName: string): boolean => {
    if (keycloak && keycloak.idTokenParsed?.user_group_in_jwt) {
        return keycloak.idTokenParsed.user_group_in_jwt.includes(groupName);
    }
    return false;
};