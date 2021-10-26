import {combineReducers} from 'redux'
import DarkmodeReducer from './DarkmodeReducer'
import ImageHandlingReducer from './ImageHandlingReducer'
import ModalReducer from './ModalReducer'

const rootReducer =  combineReducers({
    darkMode: DarkmodeReducer,
    imageHandling: ImageHandlingReducer,
    openModal : ModalReducer
})

export default rootReducer