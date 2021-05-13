import React, { useState, useEffect } from 'react';
import { Modal, Backdrop, Fade, Grid, Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { displayText, stringManipulationCheck } from '../../../constant';
import CommonStyles from '../../../scss/commonStyles';
import { operationalAreaGrid, gridWidth } from '../../../gridconstants';
import { isNotEmpty, removeSpecialCharacter, isEmpty } from "../../../components/shared/helper";
import _ from 'lodash';
import { modalStylingAttributes } from '../../../modalconstants';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fontSize: {
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  root: {
    width: '35%',
    "@media (max-width: 800px)": {
      width: '60%'
    },
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: 'none'
  },
  rootBody: {
    height: 'fit-content',
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    paddingTop: '48px',
    paddingLeft: '32px',
    paddingRight: '32px'
  },
  formControl: {
    minWidth: 120,
    width: '100%'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  header: {
    backgroundColor: '#036290',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    fontSize: '1rem',
    padding: '1rem',
    fontWeight: '700'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0.5rem'
  }
}));

export default function AddOperationalModal(props) {
  const classes = useStyles();
  const commonClasses = CommonStyles();
  const value = props.editValue
  const [operationalarea, setOperationalArea] = useState(value);
  const [isOpsAreaExistsShowError, setIsOpsAreaExistsShowError] = useState(false);
  const [isShowError, setIsShowError] = useState(false);
  var isopsAreaExists = false;
  const { action } = useSelector((state) => state.opsAreaManage);

  useEffect(() => {
    if (props.action === displayText.EDIT) {
      setOperationalArea(props.editValue);
    }
    else {
      setOperationalArea(stringManipulationCheck.EMPTY_STRING);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.action]);

  function clearData() {
    setOperationalArea(stringManipulationCheck.EMPTY_STRING);
    setIsOpsAreaExistsShowError(false);
  }

  const handleCloseOperationalArea = () => {
    clearData();
    props.handleClose();
    setIsShowError(false);
  };

  const checkOpsAreaExists = (node) => {
    if (_.lowerCase(node?.name) === _.lowerCase(operationalarea)) {
      let isOperationalAreaNameEqual = node?.ParentClientOperationalAreaGuid !== props?.selectedNode;
      if (isOperationalAreaNameEqual && node?.ParentClientOperationalAreaGuid !== props?.selectedNode) {
        isopsAreaExists = true;
      }
      else if (_.lowerCase(node?.name) === _.lowerCase(operationalarea)) {
        isopsAreaExists = true;
      }
    }
    return Array.isArray(node?.childOperationalArea) ? node?.childOperationalArea.map((nodeItem) => checkOpsAreaExists(nodeItem)) : null
  }

  const handleOperationalArea = (e) => {
    setOperationalArea(removeSpecialCharacter(e.target.value));
    setIsOpsAreaExistsShowError(false);
  }

  const handleSaveOperationalArea = async () => {
    if (isNotEmpty(operationalarea)) {
      if (props.action === displayText.EDIT) {
        checkOpsAreaExists(props?.operationalArea)
        if (!isopsAreaExists) {
          props.getEditValue(operationalarea);
        }
        else {
          setIsShowError(true);
          setIsOpsAreaExistsShowError(true);
          return
        }
      }
      else {
        checkOpsAreaExists(props?.operationalArea)
        if (!isopsAreaExists) {
          props.getAddValue(operationalarea);
        }
        else {
          setIsShowError(true);
          setIsOpsAreaExistsShowError(true);
          return
        }
      }
      handleCloseOperationalArea();
    }
    else {
      setIsShowError(true);
    }
  };
  return (
    <Modal
      aria-labelledby='add-client-modal-title'
      aria-describedby='add-client-modal-description'
      className={classes.modal}
      open={props.open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: modalStylingAttributes.backDropTimeout,
      }}
    >
      <Fade in={props?.open}>
        <div className={classes.root}>
          <div className={classes.header}>
            <div>
              {action === displayText.ADD
                ? displayText.ADD_OPERATIONAL_AREA
                : displayText.EDIT_OPERATIONAL_AREA}
            </div>
            <div
              onClick={(e) => {
                handleCloseOperationalArea();
              }}
            >
              <Close className={classes.fontSize} />
            </div>
          </div>
          <div className={classes.rootBody}>
            <form>
              <Grid container spacing={operationalAreaGrid.SpacingByTwo} className='h-auto'>
                <Grid item xs={gridWidth.CustomMaxWidth}>
                  <TextField
                    error={(isEmpty(operationalarea) && isShowError) || (isOpsAreaExistsShowError === true && isShowError)
                      ? true : false}
                    value={operationalarea}
                    onChange={(e) => handleOperationalArea(e)}
                    variant='outlined'
                    id='filled-required'
                    label={displayText.OPERATIONAL_AREA}
                    fullWidth
                    helperText={(isEmpty(operationalarea) && isShowError)
                      ? displayText.PLEASE_ENTER_OPERATIONAL_AREA
                      : isOpsAreaExistsShowError === true && isShowError
                        ? displayText.OPERATIONAL_AREA_EXISTS
                        : stringManipulationCheck.EMPTY_STRING}
                  />
                </Grid>
                <Grid item xs={gridWidth.MaxWidth}>
                  <div className={classes.footer}>
                    <div>
                      <Button
                        className={commonClasses.saveBtn}
                        onClick={(e) => handleSaveOperationalArea()}
                      >
                        {displayText.SAVE}
                      </Button>
                    </div>
                    <div className="ml-5">
                      <Button
                        className={commonClasses.cancelBtn}
                        onClick={(e) => { handleCloseOperationalArea(); }}
                      >
                        {displayText.CANCEL}
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
