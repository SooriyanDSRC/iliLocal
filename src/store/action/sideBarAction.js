import { sideBarReducerConstant } from "../reducerConstant";

export const updateSideBarVisibility = (setSideBarState) => {
   return (dispatch) => {
      dispatch({
         type: sideBarReducerConstant.UPDATE_SIDE_BAR_STATE,
         value: setSideBarState
      })
   }
}