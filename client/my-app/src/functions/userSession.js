export const saveUserSession = (token, user) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userSessionData', JSON.stringify(user)); // <-- Guarda el objeto user como JSON string
};

export const getUserSession = () => {
    const token = sessionStorage.getItem('authToken');
    const userSessionData = sessionStorage.getItem('userSessionData');

    if (token && userSessionData) {
        try {
            // Asegúrate de parsear el JSON de vuelta a un objeto
            const user = JSON.parse(userSessionData); 
            // Devuelve el objeto completo del usuario, incluyendo el rol
            return { ...user, token }; 
        } catch (e) {
            console.error("Error al parsear userSessionData de sessionStorage:", e);
            clearUserSession();
            return null;
        }
    }
    return null;
};

export const clearUserSession = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userSessionData');
};
