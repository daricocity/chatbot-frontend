import React, { createContext, useReducer } from 'react';
import { activeChatReducer, activeChatState, updateChatReducer, updateChatState, userDetailReducer, userDetailState, activeChatUserState, activeChatUserReducer, triggerRefreshUserListReducer, triggerRefreshUserListState } from './reducers';

const reduceReducers = (...reducers) => (prevState, value, ...args) => {
    return reducers.reduce(
    (newState, reducer) => reducer(newState, value, ...args), prevState
)};

const combinedReducers = reduceReducers(
    userDetailReducer,
    updateChatReducer,
    activeChatReducer,
    activeChatUserReducer,
    triggerRefreshUserListReducer,
);

const initialState = {
    ...userDetailState,
    ...updateChatState,
    ...activeChatState,
    ...activeChatUserState,
    ...triggerRefreshUserListState,
};

const store = createContext(initialState);
const {Provider} = store;

const StoreProvider = ({children}) => {
    const [state, dispatch] = useReducer(combinedReducers, initialState);
    return <Provider value={{ state, dispatch}}>{children}</Provider>;
}

export { store, StoreProvider };