import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from './App';
import NotFound from './NotFound';

const Routers = () => {
    return <Router>
                <Switch>
                    <Route exact path='/' component={App} />
                    <Route component={NotFound} />
                </Switch>
            </Router>;
};

export default Routers;