import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, Typography } from '@material-ui/core';
import CommonStyles from '../../scss/commonStyles';
import { displayText } from '../../constant';

const ClientChangeModal = (props) => {
   const classes = CommonStyles();
   const [dataImportDialog, setDataImportDialog] = useState(false);

   useEffect(() => {
      setDataImportDialog(props?.isDialogOpen);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props?.isDialogOpen]);

   return (
      <>
         <Dialog open={dataImportDialog} keepMounted>
            <DialogTitle className={classes.dialogTitle}>
               {displayText.WARNING}
            </DialogTitle>
            <DialogContent>
               <Typography className={classes.typographyPadding}>
                  {displayText.WARNING_CHANGE_CLIENT_MESSAGE}
               </Typography>
            </DialogContent>
            <DialogActions>
               <Button
                  variant="contained"
                  className={classes.submitOk}
                  onClick={(e) => props.continueNavigation()}>
                  {displayText.YES}
               </Button>
               <Button
                  variant="contained"
                  className={classes.submitNo}
                  onClick={(e) => props.onDeclineNavigation()}>
                  {displayText.NO}
               </Button>
            </DialogActions>
         </Dialog>
      </>
   );
};

export default React.memo(ClientChangeModal);
