import 'jquery';
import $ from 'jquery';
import M from 'materialize-css';
import Iframe from 'react-iframe'
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect"
const { logout} = require('../../redux/actions/userAction');
const store = require( '../../redux/store');


class Header extends Component{
    constructor(props){
        super(props)

        // this.logout = this.logout.bind(this);
        this.state = {
            // view_mode: cookies.get('view_mode')||null,
            // disable_menu : props.location.search.indexOf('disable_menu') > 0,
            isSideNavOpen: false,
            class_sideNavOpen: ''
        }


        this.changeSideNav = this.changeSideNav.bind(this);

        this.select_regulars_header = this.select_regulars_header.bind(this);

    }

    componentDidMount(){
        var options={
              edge: 'right', // <--- CHECK THIS OUT
        }
        M.Sidenav.init(this.slide_out, options);


        // var elems = document.querySelectorAll('.dropdown-trigger');
        // var instances = M.Dropdown.init(elems, options);

    }

    select_regulars_header(){
        this.changeSideNav();
        store.default.dispatch({
            type:'',
            from:null
        });
    }

    changeSideNav(){

        var instance = M.Sidenav.getInstance(this.slide_out);
        instance.close();


    }

    logout(){

        this.props.logout();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // if(this.props.user.type === "OPEN_IFRAME" ){
        //     M.Sidenav.getInstance(this.slide_out).open()
        // }
    }

    render(){
        const {c_id} = this.props.user;

        // const {disable_menu} = this.state;

        return (

            <nav className={'light-blue lighten-1' } role={"navigation"} >
                <div className={'nav-wrapper container'}>
                    <a id="logo-container" href="#" className="left" style={{color:"rgb(240, 236, 211)", fontSize:20}}>Scarlet </a>


                    <div className="right title-desc">
                        <span>The Next Generation (IPASE) </span><br/>
                        <span>Internet Personal Assistant Search Engine</span>
                    </div>
                    <ul id="nav-mobile" className="sidenav" ref={slide_out => this.slide_out = slide_out}>

                        <i onClick={()=>this.changeSideNav()} style={{margin:"-14px 0", color:"black"}} className="right material-icons">close</i>

                        <div className="col full-height cluster-content" >

                            {this.props.user.type ==='OPEN_IFRAME' &&
                            <Iframe
                                src={this.props.user.i_url}
                                className="col full-width-height"
                            />
                            }


                        </div>
                        <li>

                        </li>

                    </ul>
                    <a href="#" style={{display:"none"}} data-target="nav-mobile" className="sidenav-trigger"><i
                        className="material-icons">menu</i></a>

                </div>


            </nav>



        )
    }
}
const mapStateToProps = (user)=> (user);
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        logout: data => logout(dispatch, data),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
