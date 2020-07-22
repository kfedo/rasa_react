/**
 * Created by admin1 on 26/10/18.
 */

const baseUrl = document.location.protocol + "//" + document.location.hostname + "/rasa";
// const baseUrl = "http://localhost:3000/rasa";

const initialState = {
    userId:'',
    baseUrl:baseUrl,
    socket:null,
    loading:false,
    error: null,
    messages:[],
    myWidgetParam:[],
    isSound:false,
    coordinate_lat:null,
    coordinate_long:null,
    weather_api_key:'3b1c3da41643a03de9516d4deb798f7b',
}


////////////////////////////
//
//
//////////////////////////////
export function userApp(state = initialState, action) {
    switch (action.type) {

        case 'OPEN_IFRAME':
        case 'OPEN_CLUSTER_FOLDER':
        case 'OUT_STEP_HOOK_PENDING':
        case 'OUT_STEP_HOOK_ERROR':
        case 'OUT_STEP_HOOK_SUCCESS':
        case 'BOT_HOOK_SUCCESS':
        case 'BOT_HOOK_PENDING':
        case 'BOT_HOOK_ERROR':
        case 'UPDATE_MESSAGES':
        case '':
        case 'CHANGE_VIEW_MODE':
            return {...state, ...action}
        default:
            return state
    }
}
