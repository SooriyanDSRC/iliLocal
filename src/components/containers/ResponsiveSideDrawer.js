import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { SwipeableDrawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { User } from "@material-ui/icons";
import { updateSideBarVisibility } from '../../store/action/sideBarAction';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles({
   list: {
      width: 250
   },
});

const ResponsiveSideDrawer = () => {
   const classes = useStyles();
   const { showSideBar } = useSelector((state) => state.sideBar);
   const toggleDrawer = (isOpen) => (event) => {
      if (
         event &&
         event.type === "keydown" &&
         (event.key === "Tab" || event.key === "Shift")
      ) {
         return;
      }
   };

   return (
      <div
         className={classes.list}
         role="presentation"
         onClick={toggleDrawer(false)}
         onKeyDown={toggleDrawer(false)}
      >

      </div>
   )
}

export default ResponsiveSideDrawer
