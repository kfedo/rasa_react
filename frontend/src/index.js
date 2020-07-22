import * as serviceWorker from './serviceWorker';
import 'jquery';
import 'materialize-css/dist/css/materialize.min.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-material-design/dist/css/bootstrap-material-design.css';
import './less/pages/app.less';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {BrowserRouter,Redirect, Route, Switch} from "react-router-dom";
import store from './redux/store';
import './index.scss';

import App from './App';
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter basename={""}>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
