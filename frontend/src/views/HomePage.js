import {useContext} from "react";
import Userinfo from "../components/Userinfo";
import AuthContext from "../context/AuthContext";

const Home = () => {
    const {user} = useContext(AuthContext);
    return (
        <section>
            {user && <Userinfo user={user} />}
            <h1> HomePage here!</h1>
        </section>
    );
};

export default Home;