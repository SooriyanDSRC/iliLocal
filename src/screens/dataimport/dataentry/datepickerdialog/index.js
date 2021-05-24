import React, { useState, useEffect } from 'react';
import { displayText } from "../../../../constant";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import Draggable from "react-draggable";
import DataEntryStyles from "../../../../scss/dataEntryStyles";


function PaperComponent(props) {
   return (
      <Draggable
         handle="#draggable-dialog-title"
         cancel={'[class*="MuiDialogContent-root"]'}>
         <Paper {...props} />
      </Draggable>
   );
}

const useStyles = makeStyles((theme) => ({
   dialogContentPadding:{
      padding:"0px !important"
   }
}));

const DatePickerDialog = (props) => {
   const commonClasses = DataEntryStyles();
   const [open,setOpen] = useState(false);
   const [heading, setHeading] = useState(null);
   const [dateValue, setDateValue] = useState(null);
   const [minimalDate, setMinimalDate] = useState(null);
   const classes = useStyles();

   useEffect(() => {
      setOpen(props.showDialog);
      setDateValue(props.dateValue);
      setHeading(props.heading);
   },[props]);


   return (
      <Dialog
         open={open}
         PaperComponent={PaperComponent}
         aria-labelledby="draggable-dialog-title">
         <DialogTitle
            style={{ cursor: "move" }}
            id="draggable-dialog-title">
            {heading}
         </DialogTitle>
         <DialogContent className={classes.dialogContentPadding}>
            <KeyboardDatePicker
               variant="static"
               margin="normal"
               format={displayText.DATE_FORMAT}
               label={heading}
               className={(commonClasses.textField, "DataEntryDateTextField")}
               InputLabelProps={{ shrink: true }}
               minDate={props.minimalDate ?? new Date('0001-01-01')}
               onChange={(event) => setDateValue(event)}
               value={dateValue} />
         </DialogContent>
         <DialogActions>
            <Button autoFocus  color="primary" onClick={(e)=>props.onCancel()}>
               Cancel
            </Button>
            <Button color="primary" onClick={(e)=>props.onSave(heading,dateValue)}>
               Ok
            </Button>
         </DialogActions>
      </Dialog>
   )
}

export default DatePickerDialog
