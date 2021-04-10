import React from 'react';
import {Link} from 'react-router-dom';
import eyeopen from "../assets/eyeopen.png";
import eyeclose from "../assets/eyeclose.png";
import closeWhite from '../assets/close-white.png';
import Loader from './loader';

const AuthForm = (props) => {
    return(
        <>
            {props.error && <div className="errorHolder">
                <div dangerouslySetInnerHTML={{__html: props.error}} />
                <img src={closeWhite} onClick={() => props.setError(null)} alt="close"/>
            </div>}
            <form onSubmit={props.onSubmit}>
                <input 
                    value={props.data.username} 
                    onChange={props.onChange} 
                    name="username" 
                    className='input-field' 
                    placeholder='Username' 
                    required
                />
                {!props.login && (
                    <div className='input-container'>
                        <input 
                            value={props.data.email} 
                            onChange={props.onChange} 
                            name="email" 
                            className='input-field' 
                            placeholder='Email Address'
                            required 
                        />
                    </div>
                )}
                <div className='input-container'>
                    <input 
                        value={props.data.password} 
                        onChange={props.onChange} 
                        name="password" 
                        className='input-field' 
                        placeholder='Password' 
                        type={!props.showPassword ? 'password' : 'text'} 
                        autoComplete='new-password'
                        required 
                    />
                    <img src={!props.showPassword ? eyeopen : eyeclose} onClick={() => props.setShowPassword(!props.showPassword)} alt="close" />
                </div>
                {props.login && (
                    <div className='flex justify-end'>
                        <Link to='/'>Forgot Password</Link>
                    </div>
                )}
                <button type='submit' disabled={props.loading}>
                    { props.loading ? (
                        <center><Loader/></center>
                    ) : props.login ? 'Login' : 'Register' }
                </button>
            </form>
        </>
    )
}

export default AuthForm;