
import { Route } from 'react-router-dom'
import React, { Component } from 'react'


const store = require( '../redux/store')


export default function PublicRoute({ component: Component, ...rest }) {

    return (
        <Route
            {...rest}
            render={props =>{

                return (
                    <Component {...props} />
                )


            }

            }
        />
    );
}
