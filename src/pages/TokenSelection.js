import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { TOK_BONK, TOK_KING, TOK_GUAC, TOK_PRNT } from "./game/playerConfig";
import { Navigate } from "react-router-dom";

const TokenSelection = ({ auth }) => {
    const location = useLocation();

    useEffect(() => {
        let elements = document.querySelector('canvas');
        console.log(elements);
        if (elements != null) elements.remove();
    }, [])

    if (auth.isAuthenticated == false) {
        return <Navigate to="/signup" />
    }
    else if (auth.isAuthenticated == undefined) {
        return <>Loading</>
    }
    return (<>
        <div id="score-board" className="w-3/4 md:w-2/3 lg:w-1/2 mx-auto py-5 md:pt-20">
            <div className="rounded-[50px] bg-[#361728cc] p-10">
                <div id="score-title" className="text-center text-[32px] md:text-[40px] sm:text-[50px] text-orange-300 my-5">
                    Select Token
                </div>
            </div>

        </div>
        <div className="flex justify-evenly items-center pb-10 flex-row w-10/12 mx-auto rounded-lg bg-[#361728cc] pt-2 md:pt-10">
            <div className="hover:scale-[130%] hover:cursor-pointer character">
                <Link to="/game" state={{ player: location.state.player, token: TOK_BONK }}>
                    <img width={200} style={{ borderRadius: "50%" }} src={require('../assets/tokens/bonk.jpg').default} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character">
                <Link to="/game" state={{ player: location.state.player, token: TOK_GUAC }}>
                    <img width={200} style={{ borderRadius: "50%" }} src={require('../assets/tokens/guac.png').default} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character">
                <Link to="/game" state={{ player: location.state.player, token: TOK_KING }}>
                    <img width={200} style={{ borderRadius: "50%" }} src={require('../assets/tokens/king.png').default} />
                </Link>
            </div>
            <div className="hover:scale-[130%] hover:cursor-pointer character">
                <Link to="/game" state={{ player: location.state.player, token: TOK_PRNT }}>
                    <img width={200} style={{ borderRadius: "50%" }} src={require('../assets/tokens/prnt.jpg').default} />
                </Link>
            </div>
        </div>
    </>);
}
const mapStateToProps = (state) => ({
    auth: state.auth,
    alerts: state.alert,
});
export default connect(mapStateToProps, null)(TokenSelection);