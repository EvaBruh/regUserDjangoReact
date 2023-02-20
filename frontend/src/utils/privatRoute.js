import {Route, Redirect} from "react-router-dom";
import {useContext} from "react";
import AuthContext from "../context/AuthContext";

// Проверяет, присутствует ли пользователь или нет. Если пользователь присутствует,
// он передаст все реквизиты дочернему компоненту, и этот маршрут будет отображен.
// В противном случае он будет перенаправлен на страницу входа.

const PrivateRoute = ({ children, ...rest }) => {
    let {user} = useContext(AuthContext);
    return <Route {...rest}>{!user ? <Redirect to="/login"/> : children}</Route>;
};

export default PrivateRoute;