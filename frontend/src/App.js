import './App.scss'
import PublicRoute from "./helpers/PublicRoute";
import {BrowserRouter,Redirect, Route, Switch, withRouter} from "react-router-dom";
import ChatApp from "./components/containers/chat/ChatApp";
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";

import Header from "./components/elements/header";


class App extends Component {


    constructor(props){
        super(props);
        const { cookies } = props;
        this.state = {


        };
    }

    componentDidMount(){
    }


    render(){
        return (
            <React.Fragment >
                <Header/>
                <div className={"container full-height"}>

                    <Switch>
                        <PublicRoute path='/' component={ChatApp} />
                        <Route path='*' exact={true} component={ChatApp} />
                    </Switch>
                </div>
            </React.Fragment>
        )
    }

}

const mapStateToProps = ({user}, ownProps) => ({user})
const mapDispatchToProps = dispatch => {
    return {

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
