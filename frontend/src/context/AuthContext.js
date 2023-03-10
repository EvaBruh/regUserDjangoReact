import { createContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import {useHistory} from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null);

    const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")) : null);

    const [loading, setLoading] = useState(true);
    const history = useHistory();

    // Требует имя и пароль, если юзер существует и актуален-логин. Токены хранятся в локалСторе
    const loginUser = async (username, password) => {
        const response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            history.push("/");
        } else {
            alert("Somethin wrong ;-/");
        }
    };

    // Рега юзера в БД. Валидация полей на бэке. Успех=>уходим на страницу логина.
    const registerUser = async (username, password, password2) => {
        const response =await fetch('http://127.0.0.1:8000/api/register/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                password2
            })
        });
        if (response.status === 201) {
            history.push("/login/");
        } else {
            alert("Something wrong!");
        }
    };

    // Выход и очистка стора
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        history.push("/");
    };

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    };

// Когда authTokens и loading state изменен,
// User state in changed( useEffect вызывает это изменение). jwt_decode просто декодирует токен доступа.
    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};