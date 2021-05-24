import React, { useState, useEffect } from 'react';
import { CIcon } from '@coreui/icons-react';
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemIcon, ListItemText, Drawer } from "@material-ui/core";
import ILILogo from '../../assets/images/ILI_Logo.png';
import { updateSideBarVisibility } from '../../store/action/sideBarAction';
import { useDispatch, useSelector } from 'react-redux';
import { displayText } from '../../constant';

const useStyles = makeStyles({
   list: {
      width: 300
   },
});

const ResponsiveSideDrawer = (props) => {
   const classes = useStyles();
   const dispatch = useDispatch();
   const [userMenu, setUserMenu] = useState(null);
   const { userFeatures } = useSelector((state) => state.user);
   const { showSideBar } = useSelector((state) => state.sideBar);

   useEffect(() => {
      setUserMenu(userMenu);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props.navmenu])

   const toggleDrawer = (isOpen, navigateTo = null) => (event) => {
      if (
         event &&
         event.type === "keydown" &&
         (event.key === "Tab" || event.key === "Shift")
      ) {
         return;
      }
      dispatch(updateSideBarVisibility(isOpen));
      if (navigateTo) {
         props.navigateFunction(null, navigateTo);
      }
   };



   const renderSideBarList = () => {
      return (
         <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}>
            <img src={ILILogo} alt={displayText.CENOZON_LOGO} style={{ width: "100%" }} />
            <List>
               {userFeatures?.map((data, index) => (
                  <ListItem button key={index} onClick={toggleDrawer(false, data.to)}>
                     <ListItemIcon><CIcon name={data.icon} /></ListItemIcon>
                     <ListItemText primary={data.name} />
                  </ListItem>
               ))}
            </List>
         </div>
      )
   };

   return (
      <Drawer anchor={"left"} className="d-lg-none d-md-block d-sm-block" open={showSideBar} onClose={toggleDrawer(false)}>
         {renderSideBarList()}
      </Drawer>
   )

}

export default ResponsiveSideDrawer
