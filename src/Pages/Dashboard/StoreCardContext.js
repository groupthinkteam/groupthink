import React from 'react';
import {useLocalStore} from 'mobx-react';

export const StoreCardContext = React.createContext();

const StoreProvider = ({children}) =>{
    const store = useLocalStore(()=>({
        bugs:['sd'],
    }))
    return(
        <StoreCardContext.Provider value={store} >{children}</StoreCardContext.Provider>
    )
}
export default StoreProvider;