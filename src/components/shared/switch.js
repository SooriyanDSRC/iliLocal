import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControlLabel, Switch } from '@material-ui/core';
import { displayText } from '../../constant';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(3),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        background: '#d3dadd',
        opacity: 1,
        border: 'none',
      },
    },
    '& + $track': {
      background: '#fd9b9b',
      opacity: 1,
      border: 'none',
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #ffffff',
    },
  },
  defaultSwitchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        background: '#d3dadd',
        opacity: 1,
        border: 'none',
      },
    },
  },
  defaultThumb: {
    width: 24,
    height: 24
  },
  thumb: {
    color: '#008000',
    width: 24,
    height: 24
  },
  thumbInactive: {
    color: '#d40404',
    width: 24,
    height: 24
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
  qcFont: {
    fontWeight: 'bolder'
  }
}));

export default function SwitchComponent(props) {
  const classes = useStyles();
  const [isActive, setIsActive] = useState(
    !_.isNil(props.isActive) ? props.isActive : true
  );

  const handleSwitchChange = (e) => {
    setIsActive(e.target.checked);
    props.handleSwitchChange(e.target.checked);
  };

  const labelData = () => {
    if (isActive && props?.activeText) {
      return (<span className={classes.qcFont}>{props?.activeText}</span>);
    }
    else if (isActive && !props?.activeText) {
      return displayText.ACTIVE;
    }
    else if (!isActive && props?.inActiveText) {
      return (<span className={classes.qcFont}>{props?.inActiveText}</span>);
    }
    else {
      return displayText.IN_ACTIVE;
    }
  }

  return (
    <FormControlLabel
      className={props.switchClass}
      label={labelData()}
      labelPlacement='start'
      control={
        <Switch
          disableRipple
          classes={{
            root: classes.root,
            switchBase: props?.activeText ? classes.switchBase : classes.defaultSwitchBase,
            thumb: props?.activeText ? isActive ? classes.thumb : classes.thumbInactive : classes.defaultThumb,
            track: classes.track,
            checked: classes.checked,
          }}
          checked={isActive}
          onChange={handleSwitchChange}
        />
      }
    />
  );
}
