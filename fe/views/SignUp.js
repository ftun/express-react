import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { AuthContext } from '../components/AuthContext';
import { getFormValuesOnChange, getInputCSSOnBlur } from '../components/Helpers';
import Axios from '../../helpers/axios';

const SignIn = props => {
    /* States */
    const [values, setValues] = useState({});
    const [error, setError] = useState('');
    /* Context de la session */
    const AuthConsumer = useContext(AuthContext);

    /**
    * Obtienen los valores del formulario y los almacena en el states
    * @param object DOM
    * @return mixed
    */
    const handleOnChange = e => {
        let tempValues = getFormValuesOnChange(e, values);
        return setValues(tempValues);
    };

    /**
    * Envia los datos al backend
    * @param object DOM
    * @return mixed
    */
    const handelOnSubmit = async e => {
        e.preventDefault();
        const res = await Axios({ url : '/api/signIn', method : 'POST', data : values });
        if (res.error) return setError(res.message);
        return AuthConsumer.setExistSession(true);
    };

    if (AuthConsumer.existSession) return <Redirect to="/" />;
    return <div className="container">
        <div className="notification">
            <div className="columns is-mobile">
                <div className="column is-half is-offset-one-quarter">
                    <h1 className="title">Sing In</h1>
                    <form onSubmit={handelOnSubmit}>
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input" type="text" placeholder="User" required name="user" onChange={handleOnChange} onBlur={getInputCSSOnBlur}/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-user"></i>
                                </span>
                                <span className="icon is-small is-right">
                                    <i className="fas fa-check"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input" type="email" placeholder="Email" required name="email" onChange={handleOnChange} onBlur={getInputCSSOnBlur}/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-envelope"></i>
                                </span>
                                <span className="icon is-small is-right">
                                    <i className="fas fa-check"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input" type="password" placeholder="Password" required name="password" onChange={handleOnChange} onBlur={getInputCSSOnBlur}/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-lock"></i>
                                </span>
                                <span className="icon is-small is-right">
                                    <i className="fas fa-check"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field"><p className="help is-danger">{error}</p></div>
                        <div className="field">
                            <p className="control">
                                <button className="button is-primary" type="submit">Submit</button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    ;
};

export default SignIn;
