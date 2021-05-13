import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import * as actionCreation from "../../store/action/clientManageAction";
import { useDispatch, useSelector } from "react-redux";
import { apiRouter, sessionStorageKey, clientProfileLabelText, stringManipulationCheck } from "../../constant";
import { clientProfileGrid, gridWidth } from "../../gridconstants";
import _ from "lodash";
import TextRecord from "../../components/shared/textRecord";
import { decryptData } from '../../components/shared/helper'

const useStyles = makeStyles((theme) => ({
   root: {
      flexGrow: 1,
      height: "auto",
      marginBottom: "1%",
      paddingTop: "30px"
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
      height: "100%"
   },
   gridStyle: {
      height: "auto",
      marginTop: "1% !important"
   },
   headStyle: {
      marginTop: "28px",
      textAlign: "left"
   },
   h_auto: {
      height: "auto !important"
   }
}));

export default function ClientProfile() {
   const classes = useStyles();
   const dispatch = useDispatch();
   const [cProfile, setCProfile] = useState(null);
   const { clientProfile } = useSelector((state) => state.clientManage);
   useEffect(() => {
      const clientDetails = JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS));
      if (clientDetails?.clientsGuid) {
         const url = `${apiRouter.COMMON}/${apiRouter.CLIENT_PROFILE}/${clientDetails?.clientsGuid}`;
         dispatch(actionCreation.FetchClientById(url));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      if (!_.isNull(clientProfile)) {
         setCProfile(clientProfile);
      }
   }, [clientProfile]);

   const renderNameAddressCity = () => {
      return (
         <>
            <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
               <TextRecord
                  lableName={clientProfileLabelText.CLIENTNAME}
                  textValue={cProfile && cProfile.name ? cProfile.name : stringManipulationCheck.EMPTY_STRING} />
            </Grid>
            <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
               <TextRecord
                  lableName={clientProfileLabelText.ADDRESS}
                  textValue={cProfile && cProfile.address ? cProfile.address : stringManipulationCheck.EMPTY_STRING} />
            </Grid>
            <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
               <TextRecord
                  lableName={clientProfileLabelText.CITY}
                  textValue={cProfile && cProfile.city ? cProfile.city : stringManipulationCheck.EMPTY_STRING} />
            </Grid>
         </>
      )
   }

   const renderStateCountryPostal = () => {
      return (
         <>
            <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
               <TextRecord
                  lableName={clientProfileLabelText.STATE}
                  textValue={(cProfile && cProfile.state) ? cProfile.state : stringManipulationCheck.EMPTY_STRING} />
            </Grid>
            <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
               <TextRecord
                  lableName={clientProfileLabelText.COUNTRY}
                  textValue={cProfile && cProfile.country ? cProfile.country : stringManipulationCheck.EMPTY_STRING} />
            </Grid>
            <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
               <TextRecord
                  lableName={clientProfileLabelText.POSTAL_CODE}
                  textValue={cProfile && cProfile.postal ? cProfile.postal : stringManipulationCheck.EMPTY_STRING} />
            </Grid>
         </>
      )
   }
   const renderPhoneEmailContact = () => {
      return (
         <>
            <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
               <TextRecord
                  lableName={clientProfileLabelText.PHONE}
                  textValue={cProfile && cProfile.phone ? cProfile.phone : stringManipulationCheck.EMPTY_STRING} />
            </Grid>
            <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
               <TextRecord
                  lableName={clientProfileLabelText.EMAIL}
                  textValue={cProfile && cProfile.email ? cProfile.email : stringManipulationCheck.EMPTY_STRING} />
            </Grid>
            <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
               <TextRecord
                  lableName={clientProfileLabelText.MAINCONTACT}
                  textValue={cProfile && cProfile.mainContact ? cProfile.mainContact : stringManipulationCheck.EMPTY_STRING} />
            </Grid>
         </>
      )
   }

   return (
      <div className={classes.root}>
         <Grid
            container
            spacing={clientProfileGrid.DefaultSpacing}
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.h_auto}
         >
            <Grid item xs={gridWidth.MaxWidth}>
               <Paper className={classes.paper}>
                  <Grid
                     container
                     className={classes.gridStyle}
                     spacing={clientProfileGrid.DefaultSpacing}
                     direction="column"
                     justify="center"
                     alignItems="center"
                  >
                     <Grid item sm={gridWidth.SmWidth} xs={gridWidth.InitialWidth} />
                     <Grid item xs={gridWidth.CustomMaxWidth}>
                        <Grid container className={classes.gridStyle} spacing={clientProfileGrid.DefaultSpacing}>
                           {renderNameAddressCity()}
                           {renderStateCountryPostal()}
                           {renderPhoneEmailContact()}
                        </Grid>
                     </Grid>
                     <Grid item xs={gridWidth.SmWidth} />
                  </Grid>
               </Paper>
            </Grid>
         </Grid>
      </div>
   );
}
