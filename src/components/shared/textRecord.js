import React from "react";
import { TextField, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  lableStyle: {
    color: "#00648d",
    textAlign: "left",
    width: "100%",
  },
  textfieldStyle: {
    background: "#ebedef",
    color: "#000000",
    fontWeight: "700",
    margin: "0 !important",
  },
}));

const BoarderLessTextField = withStyles({
  root: {
    "& label": {
      boarderRadius: "4%",
    },
    "& .MuiInputBase-root": {
      fontWeight: "700",
      color: "#3c4b64",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#ffffff",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#ffffff",
      },
      "&:hover fieldset": {
        borderColor: "#ffffff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ffffff",
      },
    },
  },
})(TextField);

export default function TextRecord(props) {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.lableStyle} variant="h6">
        {props.lableName}
      </Typography>

      <BoarderLessTextField
        className={classes.textfieldStyle}
        variant="outlined"
        onChange={props.onChange}
        margin="none"
        InputProps={{
          readOnly: props.readOnly,
        }}
        id="outlined-read-only-input"
        value={props.textValue}
        fullWidth
      />
    </>
  );
}
