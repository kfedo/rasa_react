import store from '../redux/store'
import React from 'react'




// const baseUrl = document.location.protocol + "//" + document.location.hostname + "/rasa";
// const baseUrl = document.location.protocol + "//" + document.location.hostname + ":5005";


class ApiRequest extends React.Component{

    static request(url, method = 'POST', data = {}, headers = {}){
        const redux_state = store.getState()
        url = redux_state.user.baseUrl + url;

        if(method === 'GET')
        {
            url = new URL(url)
            url.search = new URLSearchParams(data)
        }

        return fetch(url, {
            method: method, // or 'PUT'
            //body might create problem if request method is GET and debug is true
            body: method === 'POST'? JSON.stringify(data): null, // data can be `string` or {object}!
            headers:{
                ...headers,
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(response => {
           // console.log('server-response: ', response)
            if(response.status === 401)
            {
                window.location.href = '/'

            }

            return response.json();

        })

    }

    static bindAuth(token, headers = {})
    {
        headers.Authorization = 'Bearer '+token
        return headers
    }

    static get(url, data = {}, headers = {}){
        return ApiRequest.request(url, 'GET', data, headers);
    }

    static post(url, data = {}, headers = {}){
        return ApiRequest.request(url, 'POST', data, headers);
    }

}

export default ApiRequest
