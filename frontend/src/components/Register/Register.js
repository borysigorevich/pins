import React, {useRef, useState} from 'react';
import './Register.css'
import {Room, Cancel} from "@material-ui/icons";
import axios from "axios";

const Register = ({setShowRegister}) => {
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async e => {
        e.preventDefault()
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        try {
            await axios.post('/users/register', newUser)
            setError(false)
            setSuccess(true)
        } catch (error) {
            setError(true)
        }
    }

    return (
        <div className={'registerContainer'}>
            <div className="logo">
                <Room/> Boris Pin
            </div>
            <form onSubmit={handleSubmit}>
                <input ref={nameRef} type="text" placeholder={'username'}/>
                <input ref={emailRef} type="email" placeholder={'email'}/>
                <input ref={passwordRef} type="password" placeholder={'password'}/>
                <button className={'registerBtn'}>Register</button>
                {success && <span className={'success'}>Successful. You can login now!</span>}
                {error && <span className={'failure'}>Something went wrong!</span>}
            </form>
            <Cancel className={'registerCancel'} onClick={() => setShowRegister(false)}/>
        </div>
    );
};

export default Register;