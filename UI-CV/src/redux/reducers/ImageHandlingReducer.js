

const ImageHandlingReducer = (state = {},action) => {
    switch(action.type){
        case 'SET_IMAGE_HANDLING':{
            return action.payload
        }
        default:
            return state
    }
}

export default ImageHandlingReducer;
