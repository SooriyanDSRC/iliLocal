import { makeStyles } from "@material-ui/core/styles";

const CommonStyles = makeStyles((theme) => ({
   submitOk: {
      margin: theme.spacing(3, 1, 2),
      background: "#00648d",
      borderRadius: 8,
      height: "40px",
      width: "100px",
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      }
   },
   colorBlack: {
      color: "#000000"
   },
   lineSpacingWidthUppercase: {
      width: "170px"
   },
   submitNo: {
      margin: theme.spacing(3, 1, 2),
      background: "#b6b6b6",
      borderRadius: 8,
      height: "40px",
      width: "100px",
      color: "#000000",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#c6c6c6",
         color: "#000000"
      }
   },
   close: {
      fontSize: "1.5rem",
      cursor: "pointer"
   },
   dialogTitle: {
      background: "#00648d",
      color: "#ffffff"
   },
   typographyPadding: {
      paddingBottom: "5px"
   },
   saveBtn: {
      margin: theme.spacing(3, 0, 2),
      background: "#00648d",
      borderRadius: 8,
      height: "40px",
      width: "100px",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      }
   },
   cancelBtn: {
      margin: theme.spacing(3, 0, 2),
      marginLeft: "12px",
      width: "100px",
      height: "40px",
      background: "#b6b6b6",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#c6c6c6",
         color: "#000000"
      }
   },
   tabInkbar: {
      background: "#00648d !important"
   },
   tabActiveHeader: {
      background: "#00648d !important",
      color: "#ffffff !important"
   },
   tabHeader: {
      background: "#ffffff !important",
      color: "#000000 !important"
   },
   panelBackground: {
      backgroundColor: "#ebedef"
   },
   paddingCell: {
      paddingBottom: 0,
      paddingTop: 0
   },
   tableCellLeftAlign: {
      float: "left"
   },
   dropdownWidth: {
      width: "100%"
   },
   modelDropdownHeight: {
      height: "100% !important",
      marginTop: "-8px !important"
   },
   modelDropdownPadding: {
      padding: "20px 35px 12px 35px"
   },
   inspectionBtnWidth: {
      width: "19% !important",
      margin: theme.spacing(3, 1, 2),
      background: "#00648d",
      borderRadius: 8,
      height: "40px",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      }
   },
   activeTabCheckBoxColor: {
      background: "#00648D !important",
      color: "#ffffff !important",
      width: "50px",
      height: "40px !important"
   },
   tabCheckBoxColor: {
      color: "#000000 !important",
      width: "50px",
      height: "40px !important"
   },
   userInfoCheckBox: {
      display: "flex",
      justifyContent: "flex-end",
      marginLeft: "-18px !important"
   },
   mainDiv: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "0"
   },
   loaderStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      marginLeft: "auto",
      marginRight: "auto"
   },
   errStyle: {
      color: "red",
      marginTop: "1rem"
   },
   header: {
      backgroundColor: "#00648d",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 50,
      fontSize: "1rem",
      padding: "1rem",
      fontWeight: "700"
   },
   switch: {
      float: "inherit",
      marginTop: "1%"
   },
   spinnerStyle: {
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
      margin: "auto"
   },
   inviteButton: {
      margin: theme.spacing(3, 1, 2),
      background: "#008000",
      borderRadius: 8,
      height: "40px",
      width: "auto !important",
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#1d9e1d",
         color: "#ffffff"
      }
   }
}));

export default CommonStyles
