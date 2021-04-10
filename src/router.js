import React from 'react';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AuthController from './components/authController';

const Router = () => {
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/login' component={Login} exact />
                <Route path='/register' component={Register} exact />
                <Route path='/' component={(props) => (
                    <AuthController {...props}>
                        <Route path='/' exact component={Home} />
                    </AuthController>
                )} />
            </Switch>
        </BrowserRouter>
    )
}

export default Router;