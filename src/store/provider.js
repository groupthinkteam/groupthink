import React from "react"
import { storeObject } from "./store"
import { observer, useLocalObservable } from "mobx-react-lite"
import { configure } from "mobx"

configure({
    enforceActions: "never",
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
    disableErrorBoundaries: true
})

export const StoreContext = React.createContext(null)

export const StoreProvider = observer(function StoreProvider({ children }) {
    const store = useLocalObservable(() => storeObject)
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )
})