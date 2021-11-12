import {combineReducers} from 'redux'
import ImageHandlingReducer from './ImageHandlingReducer'
import ModalReducer from './ModalReducer'

const rootReducer =  combineReducers({
    imageHandling: ImageHandlingReducer,
    openModal : ModalReducer
})

export default rootReducer