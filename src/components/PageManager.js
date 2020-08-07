import React, { useState } from "react"
import auth from "../firebaseAPI/firebaseAPI"
import LoginPage from "./pages/LoginPage"

export default function PageManager() {
    // state is used to determine whether to redirect to login page
    const [isLoggedIn, setLoginState] = useState(false);

    return (
        <div>
            {isLoggedIn
                ? <p>You are now logged in</p>
                : <LoginPage callback={setLoginState} />
            }
        </div>
    )


}