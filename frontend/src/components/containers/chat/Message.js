import _ from "lodash";
import React from 'react';
import * as Constants from '../../Constants';
// import {CarrotAPIAction, WebHookAction} from "../../../redux/actions/userAction";
import connect from 'react-redux/es/connect/connect'


//Optional include of the default css styles

import Iframe from "react-iframe";
const store = require( '../../../redux/store');

class Message extends React.Component {

    constructor(props) {
        super(props);

        this.chartReference = React.createRef();
        this.state = {

            m_index:null,
            right_card_open :false,
            drop_mode:'',
            learn_more_folder_css:'learn-more-button',
            learn_more_chart_css:'learn-more-button',
            chart_data: {
                labels: [
                    'Red',
                    'Blue',
                    'Yellow'
                ],
                datasets: [{
                    data: [300, 50, 100],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ]
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
        // this.getChartData = this.getChartData.bind(this);
        this.onParamButtonClick = this.onParamButtonClick.bind(this);
        this.onOpenSearX = this.onOpenSearX.bind(this);
        this.onViewIFrame = this.onViewIFrame.bind(this);

        this.onFolderButtonClick = this.onFolderButtonClick.bind(this);
        // this.onChartButtonClick = this.onChartButtonClick.bind(this);

    }
    componentDidUpdate(prevProps, prevState, snapshot) {


    }
    componentDidMount() {
        if(this.props.message.messageType === Constants.response.ResponseType.WEATHER_MESSAGE ){
            let myWidgetParam = this.props.myWidgetParam;
            let op_15 = _.filter(myWidgetParam, { containerid:'openweathermap-widget-' + this.props.m_index });

            if(op_15.length < 1){
                myWidgetParam.push({id: 15, cityid: this.props.message.messageData[0]['weather_city_id'],appid: '3b1c3da41643a03de9516d4deb798f7b',
                    units: this.props.weather_unit,containerid: 'openweathermap-widget-' + this.props.m_index,  });
            }
            store.default.dispatch({
                type:'UPDATE_MESSAGES',
                myWidgetParam:myWidgetParam
            });



        }

    }

    onCloseRightCard(){
        let messages = this.props.user.messages;
        messages[this.props.m_index]['message']['right_mode'] = '';
        store.default.dispatch({
            type:'UPDATE_MESSAGES',
            messages:messages
        });
    }
    set_more(){
        let messages = this.props.user.messages;
        messages[this.props.m_index]['message']['right_mode'] = 'more';
        store.default.dispatch({
            type:'UPDATE_MESSAGES',
            messages:messages
        });
    }
    onViewIFrame(url_obj, query, index){
        let i_url = url_obj['url'];
        if(url_obj['title'].toLocaleLowerCase() ==='wikipedia'){
            i_url = "https://wikipedia.outstep.com/search?content=wikipedia_en_all_maxi&pattern=" + encodeURIComponent(query)
        }
        let messages = this.props.user.messages;
        if(messages[this.props.m_index]['message']['right_mode'] === 'iframe'){
            messages[this.props.m_index]['message']['right_mode'] = '';
        } else {

            messages[this.props.m_index]['message']['right_mode'] = 'iframe';
        }
        messages[this.props.m_index]['message']['i_url'] = i_url;
        store.default.dispatch({
            type:'UPDATE_MESSAGES',
            messages:messages
        });

    }
    onOpenSearX(suggestion){
        let messages = this.props.user.messages;
        messages[this.props.m_index]['message']['right_mode'] = 'iframe';
        messages[this.props.m_index]['message']['i_url'] = "https://metasearch.outstep.com/?categories=general&language=en-US&q=" + encodeURI(suggestion);
        store.default.dispatch({
            type:'UPDATE_MESSAGES',
            messages:messages
        });


    }

    onFolderButtonClick(query, index){
        let messages = this.props.user.messages;
        if(messages[this.props.m_index]['message']['drop_mode'] ==='suggestion'){
            messages[this.props.m_index]['message']['drop_mode'] = '';

        }else{

            messages[this.props.m_index]['message']['drop_mode'] = 'suggestion';
        }
        store.default.dispatch({
            type:'UPDATE_MESSAGES',
            messages:messages
        });

    }


    onOpenNewWeb(web_url){
        window.open(web_url);
    }



    // Label is used internally to show what user has clicked on
    onParamButtonClick(event, uri, label) {
        event.preventDefault();
        if (!this.props.isAdmin) {
            this.props.onSend({
                messageType: Constants.request.RequestType.PARAMETER_MESSAGE,
                messageData: [{payload: uri, label: label}]
            });
        }
    }
    calculatePoint(i, intervalSize, colorRangeInfo) {
        var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
        return (useEndAsStart
            ? (colorEnd - (i * intervalSize))
            : (colorStart + (i * intervalSize)));
    }
    interpolateColors(dataLength, colorScale, colorRangeInfo) {
        var { colorStart, colorEnd } = colorRangeInfo;
        var colorRange = colorEnd - colorStart;
        var intervalSize = colorRange / dataLength;
        var i, colorPoint;
        var colorArray = [];

        for (i = 0; i < dataLength; i++) {
            colorPoint = this.calculatePoint(i, intervalSize, colorRangeInfo);
            colorArray.push(colorScale(colorPoint));
        }

        return colorArray;
    }
    // getChartData(){
    //     let chart_data = [];
    //     let learn_more_folder_css = 'learn-more-button';
    //     let learn_more_chart_css = 'learn-more-button';
    //     if(this.props.message.messageType === Constants.response.ResponseType.GENERIC_MESSAGE){
    //
    //         let colorScale = d3.interpolateInferno;
    //         const colorRangeInfo = {
    //             colorStart: 0.1,
    //             colorEnd: 1,
    //             useEndAsStart: false,
    //         };
    //
    //         if(this.props.carrot_data && this.props.carrot_data.clusters){
    //             let labels =  _.map(this.props.carrot_data.clusters, function(o){return o.phrases[0]});
    //             let data =  _.map(this.props.carrot_data.clusters, function(o){return o.size});
    //
    //             var COLORS = this.interpolateColors(labels.length, colorScale, colorRangeInfo);
    //             let datasets = [{
    //                 data,
    //                 backgroundColor: COLORS,
    //                 hoverBackgroundColor: COLORS,
    //             }]
    //             chart_data = {labels, datasets}
    //         }
    //
    //         if(this.props.message.drop_mode === 'folder'){
    //             learn_more_folder_css = 'learn-more-button active'
    //         }
    //         if(this.props.message.drop_mode === 'chart'){
    //             learn_more_chart_css = 'learn-more-button active'
    //         }
    //
    //
    //
    //     }
    //     return {chart_data, learn_more_folder_css, learn_more_chart_css};
    //
    //
    // }

    renderBotDiv() {
        if(this.props.message.messageType === Constants.response.ResponseType.WEATHER_MESSAGE){
            window.myWidgetParam = this.props.myWidgetParam;

            var s = document.getElementsByTagName('script')[0];
            var script = document.createElement('script');
            script.async = true;
            script.charset = "utf-8";
            script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
            s.parentNode.insertBefore(script, s);

        }


        // If message is from bot and messageType not carousel then show the bot icon
        var excluded = [
            Constants.response.ResponseType.WIKIQUOTE_MESSAGE,
            Constants.response.ResponseType.OPEN_SITE_MESSAGE,
            Constants.response.ResponseType.CAROUSEL_MESSAGE,
            Constants.response.ResponseType.GENERIC_MESSAGE,
            Constants.response.ResponseType.WEATHER_MESSAGE
        ];

        // Only show DBpedia icon for messages which are from bot and not carousel or smart reply
        if (this.props.fromBot && excluded.indexOf(this.props.message.messageType) === -1) {
            return (
                <div className="btn btn-default btn-fab btn-fab-mini pull-left fadeIn bot-icon">
                    <img src="/images/favicon.png" />
                </div>
            );
        }
        if (this.props.fromBot && this.props.message.messageType === Constants.response.ResponseType.WIKIQUOTE_MESSAGE) {
            return (
                <div className="btn btn-default btn-fab btn-fab-mini pull-left fadeIn bot-icon">
                    <img src="/images/wikiquote-logo.png" />
                </div>
            );
        }

    }
    scrollToPrevPage(){
        const card = document.querySelector("#paginated_cards_" + this.props.m_index);
        const card_scroller = card.querySelector(".cards_scroller");
        var card_item_size = 225;
        card_scroller.scrollBy(-card_item_size, 0);
    }
    scrollToNextPage(){
        const card = document.querySelector("#paginated_cards_" + this.props.m_index);
        const card_scroller = card.querySelector(".cards_scroller");
        var card_item_size = 225;
        card_scroller.scrollBy(card_item_size, 0);
    }

    scrollToPrevMorePage(){
        const card = document.querySelector("#paginated_cards_more_" + this.props.m_index);
        const card_scroller = card.querySelector(".cards_scroller_more");
        var card_item_size = 225;
        card_scroller.scrollBy(-card_item_size, 0);
    }
    scrollToNextMorePage(){
        const card = document.querySelector("#paginated_cards_more_" + this.props.m_index);
        const card_scroller = card.querySelector(".cards_scroller_more");
        var card_item_size = 225;
        card_scroller.scrollBy(card_item_size, 0);
    }

    render() {
        // const {chart_data, learn_more_folder_css, learn_more_chart_css} = this.getChartData();
        const fromBot = this.props.fromBot ? 'pull-left bubble-bot' : 'pull-right bubble-user';
        const messageData = this.props.message.messageData;
        let msgDiv = '';
        switch(this.props.message.messageType) {
            case Constants.response.ResponseType.FIND_MESSAGE:
                msgDiv = (
                    <div className="carousel-container ">
                        {messageData.info_boxes && messageData.info_boxes[0].infobox &&
                        <div className="carousel-item">
                            <div className="card" style={{display:"table",width:"40%"}}>
                                <div className="summary">
                                    <div className="img-wrapper">
                                        <img style={{width:"100px"}} src={messageData.info_boxes[0].img_src?messageData.info_boxes[0].img_src:"/images/logo-middle.png"} />
                                    </div>
                                    <div className="content">
                                        {messageData.info_boxes[0].infobox && (
                                            <div className="title wrap-word">
                                                {messageData.info_boxes[0].infobox}
                                            </div>
                                        )}

                                        {messageData.info_boxes[0].content && (
                                            <div className="text wrap-word">
                                                {messageData.info_boxes[0].content.substr(0, 200).split('\n').map((line, index) => {
                                                    return <div key={index}>{line}</div>;
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>


                                <div className="button-group">
                                    {messageData.suggestions &&
                                    <a href="#" className="btn btn-block btn-primary" onClick={() => this.onFolderButtonClick(messageData.info_boxes[0].infobox, this.props.m_index)}>
                                        <span>LEARN MORE</span>

                                        <span className={this.state.learn_more_folder_css}>( Suggestions )</span>
                                    </a>
                                    }
                                </div>

                                {messageData.suggestions && this.props.message.drop_mode ==='suggestion' && (
                                    <div className="folder-summary" >
                                        <div className="carrot-folder-list">
                                            {messageData.suggestions.map((suggestion, index)=>{
                                                return <div className={"valign-wrapper"} style={{cursor: "pointer"}} key={index} onClick={()=>this.onOpenSearX(suggestion)}>
                                                    <span  style={{color:"#f9c44c", marginRight:"5px"}} className="glyphicon glyphicon-tree-deciduous"
                                                           aria-hidden="true"> </span>
                                                    <span className={"sentence-omit"}>{suggestion}</span>
                                                    {/*<span >({cluster.size})</span>*/}
                                                </div>
                                            })}</div>
                                    </div>
                                )}

                            </div>
                            {this.props.message.right_mode  &&
                            <div className="card" style={{width:"60%"}}>
                                <div style={{"display":"flow-root"}}><i onClick={()=>this.onCloseRightCard()} style={{color:"black"}} className="right material-icons">close</i></div>
                                {this.props.message.right_mode ==="iframe"  &&
                                <div className="iframe-content" >
                                    <Iframe
                                        src={this.props.message.i_url}
                                        className="full-width-height"
                                    />
                                </div>
                                }



                            </div>
                            }
                        </div>
                        }




                    </div>
                );
                break;
            case Constants.response.ResponseType.GENERIC_MESSAGE:
                msgDiv = (
                    <div className="carousel-container ">
                        {messageData.info_boxes && messageData.info_boxes.length >0 &&
                        <div className="carousel-item">
                            <div className="card" style={{display:"table",width:"40%"}}>
                                <div className="summary">
                                    <div className="img-wrapper">
                                        <img style={{width:"100px"}} src={messageData.info_boxes[0].img_src?messageData.info_boxes[0].img_src:"/images/logo-middle.png"} />
                                    </div>
                                    <div className="content">
                                        {messageData.info_boxes[0].infobox && (
                                            <div className="title wrap-word">
                                                {messageData.info_boxes[0].infobox}
                                            </div>
                                        )}

                                        {messageData.info_boxes[0].content && (
                                            <div className="text wrap-word">
                                                {messageData.info_boxes[0].content.substr(0, 200).split('\n').map((line, index) => {
                                                    return <div key={index}>{line}</div>;
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>


                                <div className="button-group">
                                    {messageData.info_boxes[0].urls &&
                                    <a className="btn btn-block btn-primary">
                                        <div className="row ">
                                            <span className={"col s11"}
                                                  onClick={() => this.onViewIFrame(messageData.info_boxes[0].urls[0], messageData.info_boxes[0].infobox, this.props.m_index)}> VIEW IN {messageData.info_boxes[0].urls[0].title}</span>
                                            <i style={{position: "relative", top: "-5px"}}
                                               className="col s1 material-icons"
                                               onClick={() => this.onOpenNewWeb(messageData.info_boxes[0].urls[0].url)}>launch</i>
                                        </div>
                                    </a>
                                    }
                                    {messageData.suggestions &&
                                    <a href="#" className="btn btn-block btn-primary" onClick={() => this.onFolderButtonClick(messageData.info_boxes[0].infobox, this.props.m_index)}>
                                        <span>LEARN MORE</span>

                                        <span className={this.state.learn_more_folder_css}>( Suggestions )</span>
                                    </a>
                                    }

                                </div>

                                {messageData.suggestions && this.props.message.drop_mode ==='suggestion' && (
                                    <div className="folder-summary" >
                                        <div className="carrot-folder-list">
                                            {messageData.suggestions.map((suggestion, index)=>{
                                                return <div className={"valign-wrapper"} style={{cursor: "pointer"}} key={index} onClick={()=>this.onOpenSearX(suggestion)}>
                                                    <span  style={{color:"#f9c44c", marginRight:"5px"}} className="glyphicon glyphicon-tree-deciduous"
                                                           aria-hidden="true"> </span>
                                                    <span className={"sentence-omit"}>{suggestion}</span>
                                                    {/*<span >({cluster.size})</span>*/}
                                                </div>
                                            })}</div>
                                    </div>
                                )}

                            </div>
                            {this.props.message.right_mode  &&
                            <div className="card" style={{width:"60%"}}>
                                <div style={{"display":"flow-root"}}><i onClick={()=>this.onCloseRightCard()} style={{color:"black"}} className="right material-icons">close</i></div>
                                {this.props.message.right_mode ==="iframe"  &&
                                <div className="iframe-content" >
                                    <Iframe
                                        src={this.props.message.i_url}
                                        className="full-width-height"
                                    />
                                </div>
                                }



                            </div>
                            }
                        </div>
                        }




                    </div>
                );
                break;
            case Constants.response.ResponseType.WIKIQUOTE_MESSAGE:
                msgDiv = (
                    <div className={'bubble card'} style={{color: "black",border: "2px solid #ffe2e2", backgroundColor: "#fff5f5"}}>
                        <div style={{"background": "#ffe2e2", paddingTop: "0.1em",paddingBottom: "0.1em", textAlign: "center"
                            ,fontSize: "larger", width: "100%"}}><b>Quote of the day</b></div>
                            <div >{messageData[0].text.split('~')[0]}</div>
                            <div style={{fontStyle: "italic",textAlign: "right"}}>~{messageData[0].text.split('~')[1]}</div>

                    </div>
                );
                break;
            case Constants.response.ResponseType.OPEN_SITE_MESSAGE:
                msgDiv = (
                    <div className="open-site-container">
                        <div className="card" style={{display:"table", maxWidth:"300px", marginRight:"10px"}}>
                            <div className="site-title">
                                {this.props.message.url}
                            </div>

                            <div className="button-group">
                                <a href={"#"} className="btn btn-block btn-primary" >
                                    <span onClick={()=>this.set_more(this.props.m_index)} >View More</span>
                                    <i onClick={()=>this.onOpenNewWeb("//" + this.props.message.url)} className="material-icons">launch</i>
                                </a>
                            </div>
                        </div>
                        {this.props.message['right_mode'] === 'more' &&
                        <div className={"card"}>
                            <div style={{display: "block", textAlign: "center", height: "40px", padding: "10px"}}>
                                <span style={{textAlign: "center", marginLeft: "11%"}}>
                                    {this.props.message.url}
                                </span><i
                                onClick={() => this.onCloseRightCard()} style={{color: "black"}}
                                className="right material-icons">close</i></div>
                            <div className="iframe-content">
                                <Iframe
                                    src={"//" + this.props.message.url}
                                    className="full-width-height"
                                />
                            </div>

                        </div>
                        }

                    </div>
                )
                break;
            case Constants.response.ResponseType.CAROUSEL_MESSAGE:
                msgDiv = (
                    <div style={{display:"flex"}}>
                        <div id={"paginated_cards_" + this.props.m_index} className="card cards" style={{display:"table", marginRight:"10px"}}>
                            <div className="cards_scroller">
                                {messageData.map((message, index) => {
                                        return <div key={index} className="carousel_cards in-left">
                                            <img onClick={()=>this.onOpenNewWeb(message.img_src)} className="cardBackgroundImage" src={message.img_src} />
                                            <div className="cardFooter">
                                                <span className="cardTitle" title={message.title}>
                                                    {message.title}
                                                </span>
                                                <div className="cardDescription">
                                                    <div className="stars-outer">
                                                        <div className="stars-inner" style={{width:Math.round((message.score  * 100) )+ "%"}}>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    }
                                )}
                                <i onClick={()=>this.scrollToPrevPage()} className="arrow prev fa fa-chevron-circle-left "> </i>
                                <i onClick={()=>this.scrollToNextPage()} className="arrow next fa fa-chevron-circle-right"> </i>
                            </div>
                            <div className="button-group">
                                <a href={"#"} className="btn btn-block btn-primary" onClick={()=>this.set_more(this.props.m_index)} >
                                    <span >View More</span>
                                    <i className="material-icons">launch</i>
                                </a>
                            </div>
                        </div>
                        {this.props.message['right_mode'] === 'more' &&
                        <div id={"paginated_cards_more_" + this.props.m_index} className="card cards_more">
                            <div style={{display: "block", textAlign: "center", height: "40px", padding: "10px"}}>
                                <span style={{textAlign: "center", marginLeft: "11%"}}>
                                    {this.props.message['keyword']}
                                </span><i
                                onClick={() => this.onCloseRightCard()} style={{color: "black"}}
                                className="right material-icons">close</i></div>
                            <div className="cards_scroller_more">
                                <i onClick={() => this.scrollToPrevMorePage()}
                                   className="arrow prev fa fa-chevron-circle-left "> </i>
                                <i onClick={() => this.scrollToNextMorePage()}
                                   className="arrow next fa fa-chevron-circle-right"> </i>
                                {this.props.arrays.map((list, index) => {
                                        return <ul key={index} className="carousel_cards in-left">
                                            {list.map((image, index3) => {
                                                return <li key={index3}>
                                                    <div className={"img-wrap"}>
                                                        <img onClick={()=>this.onOpenNewWeb(image.img_src)}  className="cardBackgroundImage_more" src={image.img_src}/>
                                                    </div>
                                                </li>
                                            })}
                                        </ul>
                                    }
                                )}

                            </div>
                        </div>
                        }

                    </div>
                )
                break;
            case Constants.response.ResponseType.WEATHER_MESSAGE:
                msgDiv = (
                    <div className="carousel-container" >
                        <div className="carousel-item">
                            <div className={"card"} style={{width:"300px"}}>
                               {/* <ReactWeather
                                    forecast="today"
                                    apikey={this.props.weather_api_key}
                                    type="geo"
                                    lat="48.1351"
                                    lon="11.5820"
                                    unit={"metric"}
                                />*/}
                                {this.props.message.main_weather &&
                                <div id={"openweathermap-widget-" + this.props.m_index}> </div>
                                }
                                <div className="button-group">
                                    <a href={"#"} className="btn btn-block btn-primary" >
                                        <span onClick={()=>this.props.onChangeTemperatureUnit(this.props.m_index)} className={"left"}>( F/C )</span>
                                        <span onClick={()=>this.props.set_more_weather(this.props.m_index)} >View More</span>
                                        <i onClick={()=>this.onOpenNewWeb('//www.weather.com')} className="material-icons">launch</i>
                                    </a>
                                </div>

                            </div>
                            {this.props.message.more_weather &&
                            <div className={"card"}
                                 style={{maxWidth: "680px", overflow: "hidden"}}>
                                <div id={"openweathermap-widget-more-" + this.props.m_index}>
                                </div>
                                <div className="button-group">
                                    <a href={"#"} onClick={() => this.props.clear_more_weather(this.props.m_index)} className="btn btn-block btn-primary">
                                        <i style={{color: "black"}} className="right material-icons">close</i>
                                    </a>
                                </div>
                            </div>
                            }
                        </div>

                    </div>
                )
                break;

            case Constants.response.ResponseType.IMAGE_MESSAGE:
                msgDiv = (
                    <div className="carousel-container slideLeft">
                        {messageData.map((message, index) => {
                            return <div key={index} className="carousel-item">
                                <div className="card">
                                    <div className="summary">
                                        <div className="message-img-wrapper">
                                            <img style={{width:"300px"}} src={message.image} />
                                        </div>

                                    </div>

                                </div>
                            </div>

                        })}
                    </div>
                );
                break;
            case Constants.request.RequestType.PARAMETER_MESSAGE:
                msgDiv = (
                    <div className={`bubble card pullUp ${fromBot}`}>
                        {messageData[0].label || messageData[0].payload}
                    </div>
                );
                break;
            case Constants.response.ResponseType.TEXT_MESSAGE:
                msgDiv = (
                    <div className={`bubble card pullUp ${fromBot}`}>
                        {messageData[0].text.split('\n').map((line, index) => {
                            return <div key={index}>{line}</div>;
                        })}
                    </div>
                );
                break;
            case Constants.response.ResponseType.SMART_REPLY_MESSAGE:
                var message = messageData[0];
                msgDiv = (
                    <div>
                        <div className={`bubble card pullUp ${fromBot}`}>
                            {message.text}
                        </div>
                        {message.smartReplies && (<div className={`smart-reply-container slideUp`}>
                            {message.smartReplies.map((reply, index) => {
                                return <a key={index} href="#" className="smart-reply" onClick={(event) => this.onParamButtonClick(event, reply.uri, reply.title)}>{reply.title}</a>
                            })}
                        </div>)}
                    </div>
                );
                break;
            case Constants.response.ResponseType.BUTTON_TEXT_MESSAGE:
                var message = messageData[0];
                msgDiv = (
                    <div className={`bubble card pullUp ${fromBot}`}>
                        {message.text.split('\n').map((line, index) => {
                            return <div key={index}>{line}</div>;
                        })}

                        { message.buttons.length > 0 && (
                            <div className="button-group">
                                {message.buttons.map((button, index) => {
                                        switch(button.buttonType) {
                                            case Constants.response.ResponseType.BUTTON_LINK:
                                                return <a key={index} href={button.uri} target="_blank" className="btn btn-block btn-raised btn-info">
                                                    {button.title}
                                                    <i className="material-icons">launch</i>
                                                </a>
                                            case Constants.response.ResponseType.BUTTON_PARAM:
                                                return <a key={index} href="#" data-param={button.uri} onClick={(event) => this.onParamButtonClick(event, button.uri, button.title)} className="btn btn-block btn-raised btn-info">{button.title}</a>
                                        }
                                    }
                                )}
                            </div>
                        )}
                    </div>
                );
                break;
            case 'carousel': // Added for Backwards Compatibility can be removed later if we don't have lot of history for carousel
            case Constants.response.ResponseType.LOADING_MESSAGE:
                msgDiv = (
                    <div className={`bubble card pullUp ${fromBot}`}>
                        <div className="loading-dot dot-1"></div>
                        <div className="loading-dot dot-2"></div>
                        <div className="loading-dot dot-3"></div>
                    </div>
                );
                break;
        }

        return(
            <div className="container-fluid">
                {this.renderBotDiv()}
                {msgDiv}
            </div>
        );
    }
}

Message.defaultProps = {
    message: [], // {messageType: string, messageData: object}
    fromBot: false,
    m_index:0,

};


const mapStateToProps = (user)=> (user);
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        // CarrotAPIAction:data => CarrotAPIAction(dispatch,data),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Message);