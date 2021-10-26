
const DarkmodeReducer = (state = false, action) => {
   switch(action.type){
       case 'SET_DARKMODE':{
           return action.payload
       }
       default:
           return state
   }
}

export default DarkmodeReducer;
