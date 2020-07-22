import _ from "lodash";
import React from 'react';
import Message from './Message';
import * as Constants from '../../Constants';
import $ from 'jquery';

import connect from 'react-redux/es/connect/connect'


class Messages extends React.Component {

    constructor(props) {
        super();
        this.state={
            weather_unit:'imperial',

        }
        this.messageLength = 0;
    }
    componentDidMount() {

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
    onChangeTemperatureUnit = (m_index) =>{
        let weather_unit = this.state.weather_unit;
        if(weather_unit === 'metric'){
            weather_unit = 'imperial'
        } else {
            weather_unit = 'metric'
        }


        this.setState({weather_unit:weather_unit});
        this.clear_main_weather(m_index)
        let more = this.props.messages[m_index]['message']['more_weather'];
        if(more){
            this.clear_more_weather(m_index)
        }

        const vm = this;
        let myFunc = function () {
            vm.set_main_weather(m_index);
            if(more){
                vm.set_more_weather(m_index);
            }

        }
        setTimeout(myFunc,500)



    }
    clear_main_weather = (m_index) => {
        let messages = this.props.messages;


        messages[m_index]['message']['main_weather'] = false;
        let myWidgetParam = this.props.myWidgetParam;

        _.remove(myWidgetParam, { containerid:'openweathermap-widget-' + m_index });
        this.props.ChangeStateFunc(myWidgetParam, messages)

    }
    set_main_weather = (m_index)=>{
        let messages = this.props.messages;


        messages[m_index]['message']['main_weather'] = true;

        let myWidgetParam = this.props.myWidgetParam;

        _.remove(myWidgetParam, { id: 15, containerid:'openweathermap-widget-' + m_index});
        let op_15 = _.filter(myWidgetParam, { containerid:'openweathermap-widget-' + m_index });
        if(op_15.length < 1)
            myWidgetParam.push({id: 15,cityid: messages[m_index].message.messageData[0]['weather_city_id'],
                appid: this.props.weather_api_key,units: this.state.weather_unit,
                containerid: 'openweathermap-widget-' + m_index,  });

        this.props.ChangeStateFunc(myWidgetParam, messages)

    }

    clear_more_weather = (m_index) => {
        let messages = this.props.messages;

        messages[m_index]['message']['more_weather'] = false;

        let myWidgetParam = this.props.myWidgetParam;

        _.remove(myWidgetParam, { containerid:'openweathermap-widget-more-' + m_index });
        this.props.ChangeStateFunc(myWidgetParam, messages)

    }
    set_more_weather = (m_index)=>{
        let messages = this.props.messages;

        messages[m_index]['message']['more_weather'] = true;


        let myWidgetParam = this.props.myWidgetParam;

        _.remove(myWidgetParam, { id: 11, containerid:'openweathermap-widget-more-' + m_index});
        let op_11 = _.filter(myWidgetParam, { containerid:'openweathermap-widget-more-' + m_index });
        if(op_11.length < 1)
            myWidgetParam.push({id: 11,cityid: messages[m_index].message.messageData[0]['weather_city_id'],
                appid: this.props.weather_api_key,units: this.state.weather_unit,
                containerid: 'openweathermap-widget-more-' + m_index,  });

        this.props.ChangeStateFunc(myWidgetParam, messages)

    }
    render() {
        const messages = this.props.messages.map((message, i) => {

            let arrays = [];
            if(message.message.messageType === Constants.response.ResponseType.CAROUSEL_MESSAGE){

                let images = [...message.message.messageData];
                while (images.length > 0)
                    arrays.push(images.splice(0, 4));
            }


            return (
                <Message
                    weather_api_key={this.props.weather_api_key}
                    onChangeTemperatureUnit={this.onChangeTemperatureUnit}
                    set_more_weather={this.set_more_weather}
                    clear_more_weather={this.clear_more_weather}
                    weather_unit={this.state.weather_unit}
                    key={i}
                    m_index={i}
                    arrays={arrays}
                    myWidgetParam={this.props.myWidgetParam}
                    isAdmin={this.props.isAdmin}
                    message={message.message}
                    fromBot={message.fromBot}
                    onSend={this.props.onSend} />
            );
        });

        if(this.messageLength < messages.length) {
            this.scrollToMessage();
            this.messageLength = messages.length;
        }

        return (
            <div id="messages-container">
                {messages}
                {this.props.loading && <Message
                    message={{messageType: Constants.response.ResponseType.LOADING_MESSAGE}}
                    fromBot={true} /> }
            </div>
        );
    }
}

Messages.defaultProps = {
    messages: [],
    loading: false
};


const mapStateToProps = (user)=> (user);
const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
