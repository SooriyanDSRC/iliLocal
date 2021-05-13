import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogActions, DialogContentText,
  DialogContent, Paper, IconButton, Button, CircularProgress
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import WorkIcon from "@material-ui/icons/Work";
import { displayText, stringManipulationCheck } from "../../../constant";
import { useSelector } from "react-redux";
import _ from "lodash";
import { arrayConstants } from '../../../arrayconstants';
import { findFeatures } from '../../../components/shared/helper';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  submitOk: {
    margin: theme.spacing(3, 0, 2),
    background: "#036290",
    borderRadius: 8,
    color: "#ffffff",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#1d79ac",
      color: "#ffffff"
    }
  },
  spinnerStyle: {
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    margin: "auto"
  },
  submitNo: {
    margin: theme.spacing(3, 0, 2),
    background: "#ffffff",
    borderRadius: 8,
    color: "#808080",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#fffff",
      color: "#000000"
    }
  },
  dialogTitle: {
    background: "#00648d",
    color: "#ffffff"
  }
}));

export default function RoleList(props) {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [role, setRole] = useState(stringManipulationCheck.EMPTY_STRING);
  const { rolesLoader } = useSelector((state) => state.roleManage);
  const [isRoleDelete, setIsRoleDelete] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleDeleteClickOpen = (deleteRole) => {
    if (!deleteRole?.isDelete) { return }
    setDialogOpen(true);
    setRole(deleteRole);
  };

  const handleOk = () => {
    props.handleDeleteRole(role);
    setDialogOpen(false);
  };

  useEffect(() => {
    let role = findFeatures(props?.userRoles?.operations, displayText.DELETE_ROLE);
    role ? setIsRoleDelete(true) : setIsRoleDelete(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.userRoles])

  return (
    <>
      <Paper className={classes.root}>
        <List
          component="nav"
          className="roleListTablePadding"
          aria-label={displayText.LIST_OF_ROLE_NAME}>
          <ListItem className={"appBar-color"}>
            <ListItemIcon></ListItemIcon>
            <ListItemText className={"clr-white"} primary="Role" />
          </ListItem>
          {rolesLoader && <CircularProgress className={classes.spinnerStyle} />}
          {_.isNull(props?.roleList) ? (stringManipulationCheck.EMPTY_STRING) : (
            <>
              {props.roleList?.length === arrayConstants.nonEmptyArray
                ? (<Paper className={classes.paper}>
                  {displayText.NO_DATA_FOUND}
                </Paper>) : (props.roleList?.length > arrayConstants.nonEmptyArray &&
                  props.roleList.map((role) => {
                    return (
                      <ListItem key={role.roleName}>
                        <ListItemIcon>
                          <WorkIcon />
                        </ListItemIcon>
                        <ListItemText primary={role.roleName} />
                        <>
                          <IconButton onClick={(e) => props.handleEditRole(role)}>
                            <EditIcon />
                          </IconButton>
                          <>
                            <IconButton
                              className={!role.isDelete || !isRoleDelete ? 'pointerNotAllowed' : 'pointer'}
                              onClick={(e) => !role.isDelete || !isRoleDelete ? null : handleDeleteClickOpen(role)}>
                              <DeleteIcon className={!role.isDelete || !isRoleDelete ? 'disabled' : 'enable'} />
                            </IconButton>
                          </>
                        </>
                      </ListItem>
                    );
                  })
                )}
            </>
          )}
        </List>
      </Paper>

      <Dialog open={dialogOpen} keepMounted maxWidth="lg">
        <DialogTitle className={classes.dialogTitle}>
          {displayText.CONFIRMATION_TEXT}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {displayText.DELETE_ROLE_CONFIRMATION_MESSAGE}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            variant="contained"
            className={classes.submitOk}
            onClick={handleOk}>
            {displayText.YES}
          </Button>
          <Button
            fullWidth
            variant="contained"
            className={classes.submitNo}
            onClick={handleDialogClose}>
            {displayText.NO}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
