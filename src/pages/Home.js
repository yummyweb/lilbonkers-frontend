import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { SHIBA, ZEPHYR, FIRE, LIGHTNING } from "./game/playerConfig";
import { Navigate } from "react-router-dom";
import CharacterSelection from "./CharacterSelection";

const Home = ({ auth }) => {
    useEffect(() => {
        console.log(auth)
        let elements = document.querySelector('canvas');
        if (elements != null) elements.remove();
    }, [])

    if (auth.isAuthenticated == false) {
        return <Navigate to="/signup" />
    }
    else if (auth.isAuthenticated == undefined) {
        return <>Loading</>
    }
    return (<div>
        <CharacterSelection auth={auth} />
    </div>);
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    alerts: state.alert,
});
export default connect(mapStateToProps, null)(Home);