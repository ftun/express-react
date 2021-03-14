import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from './App';
import NotFound from './NotFound';

// import Client from './views/client/index';
import Chat from './views/chat/index';

const Routers = () => {
    return <Router>
                <Switch>
                    <Route exact path='/' component={Chat} />
                    <Route component={NotFound} />
                </Switch>
            </Router>;
};

export default Routers;
