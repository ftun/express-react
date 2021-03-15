import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from './App';
import NotFound from './NotFound';

// import Client from './views/client/index';
const Chat = lazy(() => import ( './views/chat/index'));
const SignUp = lazy(() => import ( './views/SignUp'));
const LogIn = lazy(() => import ( './views/LogIn'));

const Routers = () => {
    return <Suspense fallback={<progress class="progress is-small is-primary" max="100">15%</progress>}>
        <Switch>
            <Route exact path='/' component={Chat} />
            <Route exact path='/signIn' component={SignUp} />
            <Route exact path='/logIn' component={LogIn} />
            <Route component={NotFound} />
        </Switch>
    </Suspense>;
};

export default Routers;
