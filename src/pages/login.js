import { LOGIN_URL } from '../urls';
import { Link } from 'react-router-dom';
import google from "../assets/google.png";
import Loader from '../components/loader';
import twitter from "../assets/twitter.png";
import AuthForm from '../components/authform';
import React, { useState, useEffect } from 'react';
import { axiosHandler, errorHandler } from '../helper';
import { chechAuthState, tokenName } from '../components/authController';

export const loginRequest = async (props, data, setError) => {
    const result = await axiosHandler({
        method: "post",
        url: LOGIN_URL,
        data: data
    }).catch((e) => setError(errorHandler(e)));
    if(result){
        localStorage.setItem(tokenName, JSON.stringify(result.data))
        props.history.push('/');
    };
}

const Login = (props) => {
    const [ loading, setLoading ] = useState(false);
    const [ LoginData, setLoginData ] = useState({});
    const [ showPassword, setShowPassword ] = useState(false);
    const [ error, setError ] = useState(null)
    const [ checking, setChecking ] = useState(localStorage.getItem(tokenName));

    // To redirect user to home page when login page is visited after login
    useEffect(() => {
        if(checking){
        chechAuthState(
            () => null,
            () => props.history.push('/'),
            props
        )}
    }, [])

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        await loginRequest(props, LoginData, setError);
        setLoading(false)
    };

    const onChange = (e) => {
        setLoginData({
            ...LoginData,
            [e.target.name]: e.target.value,
        });
    };

    return(
        <div className='loginContainer'>
            {checking ? (
                <div className="centerAll"><Loader/></div>
            ) : (
                <div className='inner'>
                    <div className='logo'>TUK2ME</div>
                    <div className='title'>Sign in</div>
                    <AuthForm 
                        login 
                        data={LoginData} 
                        onSubmit={submit} 
                        showPassword={showPassword} 
                        setShowPassword={setShowPassword} 
                        onChange={onChange}
                        error={error}
                        setError={setError}
                        loading={loading}
                    />
                    <div className='grid grid-2 grid-gap-2'>
                        <div className='socialButton'>
                            <img src={twitter} alt="twitter" /> <span>Twitter</span>
                        </div>
                        <div className='socialButton'>
                            <img src={google} alt="google" /> <span>Google</span>
                        </div>
                    </div>
                    <div className='switchOption'>
                        Don't have account yet? <Link to='/register'>Sign up</Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login;