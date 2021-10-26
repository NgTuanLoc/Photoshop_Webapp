

import React from 'react';
import Header from './components/Header';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/Home';
import Gendering from './components/Gendering';
import NotFound from './utils/NotFound';

import Modal from './utils/Modal'

const App = () => {
    return (
        <Router>
            <div className="app">
                <Header />
                <div className="container">
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/gender" exact component={Gendering} />
                        <Route path="*" exact component={NotFound} />
                    </Switch>
                </div>
                <Modal /> 


            </div>
        </Router>
    );
}

export default App;
