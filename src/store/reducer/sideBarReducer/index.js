import { sideBarReducerConstant } from '../../reducerConstant';

const initialState = {
   showSideBar: false
};

const sideBarReducer = (state = initialState, action = {}) => {
   switch (action.type) {
      case sideBarReducerConstant.UPDATE_SIDE_BAR_STATE:
         return {
            ...state,
            showSideBar: action.value
         }
      default:
         return state;
   }
}

export default sideBarReducer;