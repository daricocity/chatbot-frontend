import Loader from './loader';
import { store } from '../stateManagement/store';
import { LOGOUT_URL, ME_URL, REFRESH_URL } from '../urls';
import { userDetailAction } from '../stateManagement/actions';
import React, { useEffect, useState, useContext } from 'react';
import { axiosHandler, getToken, LastUserChat } from '../helper';

export const tokenName = 'tokenName';

export const logout = (props) => {
    if(localStorage.getItem(tokenName)){
        axiosHandler({
            method: 'get',
            url: LOGOUT_URL,
            token: getToken()
        });
    }
    localStorage.removeItem(tokenName);
    localStorage.removeItem(LastUserChat);
    window.location.href = "/login";
}

export const chechAuthState = async (setChecking, dispatch, props) => {
    let token = localStorage.getItem(tokenName);
    if(!token){
        logout(props);
        return;
    }
    token = JSON.parse(token)
    const userProfile = await axiosHandler({
        method: "get",
        url: ME_URL,
        token: token.access,
    }).catch((e) => null);
    if(userProfile){
        setChecking(false);
        dispatch({
            type: userDetailAction,
            payload: userProfile.data
        })
    } else {
        // Check for refresh token if access has expire
        const getNewAccess = await axiosHandler({
            method: "post",
            url: REFRESH_URL,
            data: {
                refresh: token.refresh
            }
        }).catch((e) => null);
        if(getNewAccess){
            localStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
            chechAuthState(setChecking, dispatch, props);
        } else {
            logout(props);
        }
    }
};

const AuthController = (props) => {

    const [ checking, setChecking ] = useState(true);
    const { dispatch } = useContext(store);

    useEffect(() => {
        chechAuthState(setChecking, dispatch, props);
    }, [])
    
    return(
        <div className="authContainer">
            {checking ? (
                <div className="centerAll"><Loader/></div>
            ) : props.children}
        </div>
    );
}

export default AuthController;