import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Header from './pages/Header';
import Home from './pages/Home';
import NotFound from './components/utils/NotFound';
import Modal from './components/utils/Modal'
import Detection from './pages/Detection';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Header />
                <div className="container">
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/detect" exact component={Detection} />
                        <Route path="*" exact component={NotFound} />
                    </Switch>
                </div>
                <Modal /> 
            </div>
        </Router>
    );
}

export default App;
