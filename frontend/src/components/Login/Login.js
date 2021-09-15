import React, {useRef, useState} from 'react';
import './Login.css'
import {Room, Cancel} from "@material-ui/icons";
import axios from "axios";

const Login = ({setShowLogin, myStorage, setCurrentUser}) => {
    const [error, setError] = useState(false)

    const nameRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async e => {
        e.preventDefault()
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value
        }
        try {
            const res = await axios.post('/users/login', user)
            myStorage.setItem('user', res.data.username)
            setCurrentUser(res.data.username)
            setShowLogin(false)
            setError(false)
        } catch (error) {
            setError(true)
        }
    }

    return (
        <div className={'loginContainer'}>
            <div className="logo">
                <Room/> Boris Pin
            </div>
            <form onSubmit={handleSubmit}>
                <input ref={nameRef} type="text" placeholder={'username'}/>
                <input ref={passwordRef} type="password" placeholder={'password'}/>
                <button className={'loginBtn'}>Login</button>
                {error && <span className={'failure'}>Something went wrong!</span>}
            </form>
            <Cancel className={'loginCancel'} onClick={() => setShowLogin(false)}/>
        </div>
    );
};

export default Login;