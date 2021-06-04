import { makeStyles } from '@material-ui/core/styles';

const DataEntryStyles = makeStyles((theme) => ({
   root: {
      height: "70%",
      width: "50%",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      outline: "none",
   },
   button: {
      margin: theme.spacing(0.5, 0),
      color: "#036290",
      background: "#ffffff",
      textTransform: "none",
      width: "auto",
      height: "50%",
      "&:hover": {
         backgroundColor: "#ffffff  !important",
         color: "#4f5d73 !important",
      },
      cursor: "pointer",
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
   },
   formControl: {
      minWidth: 120,
      width: "100%",
   },
   searchButton: {
      marginRight: "auto",
      width: "100%",
      background: "#00648d",
      borderRadius: 8,
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#c6c6c6",
         color: "#000000",
      },
      height: "56px",
      color: "#ffffff",
   },
}));

export default DataEntryStyles
