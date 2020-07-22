/**
 * Created by admin1 on 26/10/18.
 */
import {combineReducers} from 'redux'
import {userApp} from './userReducer'



const reducer = combineReducers({
    user: userApp,

})

export default reducer
