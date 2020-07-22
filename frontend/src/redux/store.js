import { createStore, applyMiddleware, compose } from 'redux'
// import Reactotron from '../ReactotronConfig'
import rootReducer from './reducers/index'
// import {echoMiddleware} from './_middlewares/index';
import thunk from "redux-thunk";
// const middlewares = [thunk, echoMiddleware];
const middlewares = [thunk];


const composeEnhancers =  (process.env.NODE_ENV !== 'production1' &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

const store = createStore(
    rootReducer, /* preloadedState, */
    composeEnhancers(applyMiddleware(...middlewares)
    )
)


export default store
