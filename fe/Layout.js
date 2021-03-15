import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Axios from '../helpers/axios';

const Layout = props => {
    const [existSession, setExistSession] = useState(true);

    // useEffect(() => {
    //     const getInit = async () => {
    //         const res = await Axios({ url : '/api' });
    //         let exist = res.user ? true : false;
    //         console.log(exist, res.user);
    //         setExistSession(exist);
    //     }
	//     getInit();
	// });

    const getLogOut = e => {
        const res = Axios({ url : '/api/logOut' });
        // setExistSession(false);
    };

    return <Router>
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    {
                        // <a className="navbar-item" href="/">
                        //     <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />
                        // </a>
                    }
                    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        <Link to="/" className="navbar-item">Home</Link>
                        {existSession && <a className="navbar-item">Documentation</a>}
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">More</a>
                            <div className="navbar-dropdown">
                                <a className="navbar-item">About</a>
                                <a className="navbar-item">Jobs</a>
                                <a className="navbar-item">Contact</a>
                                <hr className="navbar-divider" />
                                <a className="navbar-item">Report an issue</a>
                            </div>
                        </div>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <Link to="/signIn" className="button is-primary">Sign up</Link>
                                <a className="button is-danger" onClick={getLogOut}>Logout</a>
                                <Link to="/logIn" className="button is-light">Log in</Link>
                                {
                                     //!existSession && <Link to="/signIn" className="button is-primary">Sign up</Link>
                                }
                                {
                                    // existSession ?
                                    // <a className="button is-danger" onClick={getLogOut}>Logout</a> :
                                    // <Link to="/logIn" className="button is-light">Log in</Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main>
                <section className="section">
                    <div className="container">{props.children}</div>
                </section>
            </main>
            <footer className="footer">
                <div className="content has-text-centered">
                    <p><strong>Example</strong></p>
                </div>
            </footer>
        </Router>;
};

export default Layout;
