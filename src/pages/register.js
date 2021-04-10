import { loginRequest } from './login';
import { REGISTER_URL } from '../urls';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/authform';
import { axiosHandler, errorHandler } from '../helper';

const Register = (props) => {
    const [ loading, setLoading ] = useState(false);
    const [ RegisterData, setRegisterData ] = useState({});
    const [ showPassword, setShowPassword ] = useState(false);
    const [ error, setError ] = useState(null)

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const result = await axiosHandler({
            method: "post",
            url: REGISTER_URL,
            data: RegisterData
        }).catch(() => setError(errorHandler(e)));
        if(result){
            await loginRequest(props, RegisterData, setError)
        };
        setLoading(false);
    };

    const onChange = (e) => {
        setRegisterData({
            ...RegisterData,
            [e.target.name]: e.target.value,
        });
    };
    
    return(
        <div className='loginContainer'>
            <div className='inner'>
                <div className='logo'>TUK2ME</div>
                <div className='title'>Sign up</div>
                <AuthForm 
                    data={RegisterData} 
                    onSubmit={submit} 
                    showPassword={showPassword} 
                    setShowPassword={setShowPassword} 
                    onChange={onChange}
                    error={error}
                    setError={setError}
                    loading={loading}
                />
                <div className='switchOption'>
                    Already got an account? <Link to='/login'>Sign in</Link>
                </div>
            </div>
        </div>
    )
}

export default Register;