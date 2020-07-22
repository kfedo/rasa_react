
import ApiRequest from "../../helpers/ApiRequest";

export const EMPTY_TYPE = '';

export const DATA_UPDATE_PENDING = 'DATA_UPDATE_PENDING';



export function WebHookAction(dispatch, data) {
    dispatch({type: 'BOT_HOOK_PENDING', loading:true});
    ApiRequest.post('/webhooks/rest/webhook', data)
        .then((response) => {
            if(!response){
                let bot_messages = [{'text':"Maybe this is server error."}]
                dispatch({
                    bot_messages,
                    type: 'OUT_STEP_HOOK_SUCCESS',
                    loading:false,
                    sound_link:null,

                });
                return;

            }
            if(response.exception || response.error || response.errors)
            {
                dispatch({
                    type: 'BOT_HOOK_ERROR',
                    loading:false,
                    sound_link:null,
                    error: response.errors?response.errors:response.message
                })

            }else{
                let bot_messages =[];
                let sound_link = null;
                for (let index in response) {
                    if(response[index] && response[index].custom ){
                        if(response[index].custom['payload'] ==='generalSearch'){
                            let messageData = response[index].custom['data'];
                            bot_messages.push(
                                {
                                    'messageType':'generalSearch',
                                    'messageData':messageData
                                }
                            );
                        }
                        if(response[index].custom['payload'] ==='findSearch'){
                            let messageData = response[index].custom['data'];
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
                        if(response[index].custom['payload'] ==='wikiquote'){
                            let qotd = response[index].custom['text']

                            let messageData = [{'text':qotd}];
                            bot_messages.push(
                                {
                                    'messageType':'wikiquote',
                                    'messageData':messageData
                                }
                            );
                        }
                        if(response[index].custom['payload'] ==='open_site'){

                            let messageData = [];
                            bot_messages.push(
                                {
                                    'right_mode': 'more',
                                    'messageType': 'open_site',
                                    'messageData': messageData,
                                    'url': response[index].custom['url'],
                                });

                        }

                        if(response[index].custom['payload'] ==='cardsCarousel'){
                            let messageData = response[index].custom['data'];
                            bot_messages.push(
                                {
                                    'messageType': 'cardsCarousel',
                                    'messageData': messageData,
                                    'keyword': response[index].custom['keyword'],
                                });

                        }

                        if(response[index].custom['payload'] ==='weather'){
                            // const city_name = response[index].custom['weather_city_name']
                            const city_id = response[index].custom['weather_city_id']

                            let messageType = 'weather';
                            let messageData_item = {};
                            messageData_item['weather_city_id'] = city_id;

                            bot_messages.push(
                                {
                                    'main_weather':true,
                                    'more_weather':false,
                                    'messageType': messageType,
                                    'messageData': [messageData_item],
                                });


                        }
                    }else{
                        if(response[index].hasOwnProperty('link')){
                            sound_link =response[index]['link'];

                        }
                        bot_messages.push(response[index])
                    }

                }
                dispatch({
                    sound_link:sound_link,
                    bot_messages,
                    type: 'BOT_HOOK_SUCCESS',
                    loading:false,

                })

            }
        })
}


