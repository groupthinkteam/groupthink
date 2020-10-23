import React from "react"
import { storeObject } from "./store"
import { observer, useLocalObservable } from "mobx-react-lite"

export const StoreContext = React.createContext(null)

export const StoreProvider = observer(({ children }) => {
    const store = useLocalObservable(() => storeObject)
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )
})