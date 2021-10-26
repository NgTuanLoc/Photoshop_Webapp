const ModalReducer = (state = false, action)=>{
    switch(action.type){
        case 'SET_OPEN_MODAL':{
            return action.payload
        }
        default:
            return state
    }
}
export default ModalReducer;