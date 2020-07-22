
import React from 'react';
import $ from 'jquery';
import Messages from './Messages';
import ChatInput from './ChatInput';
import * as Constants from '../../Constants';
import Feedback from './Feedback';
import About from './About';

import {EMPTY_TYPE, WebHookAction} from '../../../redux/actions/userAction'
import connect from 'react-redux/es/connect/connect'
import socketIOClient from "socket.io-client";
const store = require( '../../../redux/store');


class ChatApp extends React.Component {

    constructor(props) {
        super();
        this.state = {
            myWidgetParam: [],
            loading: false, showFeedback: false, overlay: false, showAbout: false, i_url: null
        };
        this.uuid = this.getUuid();
        this.sendHandler = this.sendHandler.bind(this);
        this.showStart = this.showStart.bind(this);
        this.showFeedbackModal = this.showFeedbackModal.bind(this);
        this.hideFeedbackModal = this.hideFeedbackModal.bind(this);
        this.showAboutModal = this.showAboutModal.bind(this);
        this.hideAboutModal = this.hideAboutModal.bind(this);
        this.showOverlay = this.showOverlay.bind(this);
        this.hideOverlay = this.hideOverlay.bind(this);

    }

    componentDidMount() {
        if (!window.myWidgetParam) {
            window.myWidgetParam = [];
        }
        var s = document.getElementsByTagName('script')[0];
        var script1 = document.createElement('script');
        script1.src = '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js'
        s.parentNode.insertBefore(script1, s);


        if (!this.props.isAdmin) {
            setTimeout(() => {
                this.showStart();
            }, 500);
        }

        // this.createSocket();
        // this.getLocation();

    }
    getLocation = () =>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getUserPosition, this.handleLocationAccessError);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    getUserPosition = (position) => {
        let coordinate = "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
        console.log("location: ", coordinate);
        store.default.dispatch({
            type:EMPTY_TYPE,
            coordinate_lat:position.coords.latitude,
            coordinate_long:position.coords.longitude,
        });

        let message = '/my_location{"latitude":' + position.coords.latitude + ',"longitude":' + position.coords.longitude + '}';
        let data = {
            message:message
        }
        this.makeRequest(data);

    }

    handleLocationAccessError = (error) => {

        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.")
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.")
                break;
            case error.TIMEOUT:
                console.log("The request to get user location timed out.")
                break;
            case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred.")
                break;
        }
    }
    ChangeStateFunc = (myWidgetParam, messages=null) =>{
        this.setState({myWidgetParam:myWidgetParam});
        if(messages){
            store.default.dispatch({
                type:EMPTY_TYPE,
                messages:messages,
            })
        }
    }


    // createSocket = () => {
    //     if(this.props.user.socket){
    //         this.props.user.socket.emit('disconnect');
    //         store.default.dispatch({
    //             type: EMPTY_TYPE,
    //             userId: '',
    //             socket: null
    //         })
    //         return;
    //     }
    //     const socket = socketIOClient(this.props.user.baseUrl+":5005");
    //     let userId = this.generateUuid();
    //     socket.on("connect", () => {
    //
    //         socket.emit('session_request', {session_id: userId})
    //         store.default.dispatch({
    //             type: EMPTY_TYPE,
    //             userId: userId,
    //             socket: socket,
    //             loading:false
    //         })
    //     });
    //     socket.on("disconnect", data => {
    //         store.default.dispatch({
    //             type: EMPTY_TYPE,
    //             userId: '',
    //             socket: null
    //         })
    //         console.log(data)
    //     });
    //     socket.on('session_confirm', data => {
    //         console.log(data);
    //         if (data === userId) {
    //             console.log('session confirm success!')
    //         }
    //     })
    //     socket.on('bot_uttered', data => {
    //         console.log('bot_uttered', data);
    //         this.getIncomingMessage(data);
    //     })
    // }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.user.bot_messages !== prevProps.user.bot_messages && !this.props.user.loading) {
            if(this.props.user.sound_link){
                const audio = document.getElementById('response-voice');
                console.log(audio);
                this.audio_play(this.props.user.sound_link).then(function() {
                    audio.src = null;
                });
                // audio.src = this.props.user.sound_link;
                // const playPromise = audio.play();
                // if (playPromise !== null) {
                //     playPromise.catch(() => {
                //         audio.play();
                //     });
                // }
            }

            this.renderMessages(this.props.user.bot_messages)
        }
        if (this.props.user.messages !== prevProps.user.messages) {
            this.setState({messages: this.props.user.messages})
        }
        if (this.props.user.myWidgetParam !== prevProps.user.myWidgetParam) {
            this.setState({myWidgetParam: this.props.user.myWidgetParam})
        }
    }
    audio_play = (url) => {
        return new Promise(function(resolve, reject) { // return a promise
            const audio = document.getElementById('response-voice');
            audio.preload = "auto";                      // intend to play through
            audio.autoplay = true;                       // autoplay when loaded
            audio.onerror = reject;                      // on error, reject
            audio.onended = resolve;                     // when done, resolve

            audio.src = url
        });
    }
    getIncomingMessage = (data) => {

        if (data.link) {
            if(data.text){
                let bot_messages =[];
                bot_messages.push(
                    {'text':data.text});
                store.default.dispatch({
                    bot_messages,
                    type: 'BOT_HOOK_SUCCESS',
                    loading:false,
                })
            }
            const audio = document.getElementById('response-voice');
            console.log(audio);
            audio.src = data.link;
            const playPromise = audio.play();
            if (playPromise !== null) {
                playPromise.catch(() => {
                    audio.play();
                });
            }

        } else {

            if(data.text){
                let bot_messages =[];
                bot_messages.push({'text':data.text});
                store.default.dispatch({
                    bot_messages,
                    type: 'BOT_HOOK_SUCCESS',
                    loading:false,


                })
            }
            if(data.object){
                const response_obj = JSON.parse(data.object);
                let bot_messages =[];
                if(response_obj['payload'] ==='generalSearch'){
                    let messageData = response_obj['data'];
                    bot_messages.push(
                        {
                            'messageType':'generalSearch',
                            'messageData':messageData
                        }
                    );
                }
                if(response_obj['payload'] ==='findSearch'){
                    let messageData = response_obj['data'];
                    bot_messages.push(
                        {
                            'messageType':'findSearch',
                            'messageData':messageData,
                            'drop_mode':'suggestion',
                            'right_mode':'iframe',
                            'i_url':"https://metasearch.outstep.com/?categories=general&language=en-US&q=" + encodeURI(messageData['suggestions'][0]),
                        }
                    );
                }
                if(response_obj['payload'] ==='wikiquote'){
                    let qotd = response_obj['text'];

                    let messageData = [{'text':qotd}];
                    bot_messages.push(
                        {
                            'messageType':'wikiquote',
                            'messageData':messageData
                        }
                    );
                }
                if(response_obj['payload'] ==='open_site'){

                    let messageData = [];
                    bot_messages.push(
                        {
                            'right_mode': 'more',
                            'messageType': 'open_site',
                            'messageData': messageData,
                            'url': response_obj['url'],
                        });

                }

                if(response_obj['payload'] ==='cardsCarousel'){
                    let messageData = response_obj['data'];
                    bot_messages.push(
                        {
                            'messageType': 'cardsCarousel',
                            'messageData': messageData,
                            'keyword': response_obj['keyword'],
                        });

                }

                if(response_obj['payload'] ==='weather'){
                    const weather_city_name = response_obj['weather_city_name']
                    const weather_city_id = response_obj['weather_city_id']

                    let messageType = 'weather';
                    let messageData_item = {};
                    messageData_item['weather_city_id'] = weather_city_id;

                    bot_messages.push(
                        {
                            'main_weather':true,
                            'more_weather':false,
                            'messageType': messageType,
                            'messageData': [messageData_item],
                        });


                }
                store.default.dispatch({
                    bot_messages,
                    type: 'BOT_HOOK_SUCCESS',
                    loading:false,


                })



            }

        }
    }



    scrollToMessage() {
        const element = document.getElementById("messages-container");
        if(!this.props.isAdmin) {
            var target = $('.bubble-user').last().parent();
            if(target.length) {
                $(element).animate({
                    scrollTop: target.offset().top - $(element).offset().top + $(element).scrollTop()
                });
            }
        }
    }

    generateUuid() {
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c==='x' ? r : (r&0x3 || 0x8)).toString(16);
        });

    }

    getUuid() {
        if (localStorage) {
            var uuid = localStorage.getItem('uuid');
            if (uuid) {
                return uuid;
            }

            uuid = this.generateUuid();
            localStorage.setItem('uuid', uuid);
            return uuid;
        }
        return this.generateUuid();
    }

    makeRequest(data) {
        data.userId = this.uuid;
        data.isSound = this.props.user.isSound;
        console.log('makeRequest')
        this.props.WebHookAction(data)

    }

    renderMessages(messages) {
        for (let index in messages) {
            setTimeout(() => {
                let msg = {};
                if(messages[index].messageType){
                    msg = messages[index]
                }else{
                    msg.messageData=[messages[index]];
                    if(messages[index].hasOwnProperty('text')){

                        msg.messageType=msg.messageType?msg.messageType:'text';
                    }
                    if(messages[index].hasOwnProperty('image')){

                        msg.messageType=msg.messageType?msg.messageType:'image';
                    }
                }

                this.addMessage({
                    fromBot: true,
                    message: msg
                });
            }, 500 * index);
        }

    }

    showStart(restart) {

        store.default.dispatch({
            type:'',
            messages:[]
        });

        if(this.props.user.socket && this.props.user.isSound){
            this.props.user.socket.emit('user_uttered', { type:'chat', message: 'Today quote', room: this.props.user.userId });
        } else {
            this.makeRequest({
                // message:'how is the weather in london',
                message:'Today quote',
                messageType: Constants.request.RequestType.PARAMETER_MESSAGE,
                messageData: [{
                    payload: restart ? Constants.request.ParameterType.HELP : Constants.request.ParameterType.START
                }]
            });
        }

    }



    removeSmartReplies() {
        let messages = this.props.user.messages;
        messages.forEach((message, index) => {
            if(message.message.messageType === Constants.response.ResponseType.SMART_REPLY_MESSAGE) {
                delete messages[index];
            }

        });
        store.default.dispatch({
            type:'',
            messages:messages
        })
    }

    sendHandler(message, text) {
        const messageObject = {
            username: this.props.username,
            message: message,
            fromBot: false
        };

        this.removeSmartReplies();
        this.addMessage(messageObject);

        if(this.props.user.socket && this.props.user.isSound){
            store.default.dispatch({
                type:EMPTY_TYPE,
                loading:true,
            })
            this.props.user.socket.emit('user_uttered', { type:'chat', message: text, room: this.props.user.userId });
        } else {

            this.makeRequest(message);
        }
    }

    addMessage(message) {
        // Append the message to the component state
        let messages = this.props.user.messages;
        messages.push(message);

        store.default.dispatch({
            type:'UPDATE_MESSAGES',
            messages:messages
        })
    }


    showFeedbackModal() {
        this.setState({showFeedback: true});
    }

    hideFeedbackModal() {
        this.setState({showFeedback: false});
    }

    showAboutModal() {
        this.setState({showAbout: true});
    }

    hideAboutModal() {
        this.setState({showAbout: false});
    }

    showOverlay() {
        this.setState({overlay: true});
    }

    hideOverlay() {
        this.setState({overlay: false});
    }

    clearChatHistory() {
        this.setState({messages: []});
    }

    addChatHistory(msgs) {
        var messages = this.state.messages;
        for (var index in msgs) {
            messages.push(msgs[index]);
        }
        this.setState({messages: messages});
    }

    render() {
        var style = {};
        if(this.props.height) {
            style.height = this.props.height;
        }
        return (
            <div className="card expandOpen" id="chat-app-container" style={style}>

                <Messages
                    weather_api_key={this.props.user.weather_api_key}
                    ChangeStateFunc={this.ChangeStateFunc}
                    messages={this.state.messages}
                    myWidgetParam={this.state.myWidgetParam}
                    onSend={this.sendHandler}
                    isAdmin={this.props.isAdmin}
                    loading={this.props.user.loading} />
                <ChatInput

                    coordinate_lat={this.props.user.coordinate_lat}
                    coordinate_long={this.props.user.coordinate_long}
                    isSound={this.props.user.isSound}
                    // createSocket={this.createSocket}
                    loading={this.props.user.loading}
                    socket={this.props.user.socket}
                    userId={this.props.user.userId}
                    isAdmin={this.props.isAdmin}
                    onSend={this.sendHandler}
                    showStart={this.showStart}
                    showFeedback={this.showFeedbackModal}
                    showAbout={this.showAboutModal}
                    showOverlay={this.showOverlay}
                    hideOverlay={this.hideOverlay} />
                <Feedback
                    isOpen={this.state.showFeedback}
                    hide={this.hideFeedbackModal}
                    userId={this.getUuid()} />
                <About
                    isOpen={this.state.showAbout}
                    hide={this.hideAboutModal} />

                {this.state.overlay && (
                    <div className="overlay"> </div>
                )}
                < audio id="response-voice" style={{display:"none"}}> </audio>
            </div>
        );
    }
}

ChatApp.defaultProps = {
    isAdmin: false
};
const mapStateToProps = state=> ({user:state.user});
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        WebHookAction:data => WebHookAction(dispatch,data),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);