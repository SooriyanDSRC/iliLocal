import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { displayText, stringManipulationCheck } from '../../constant';
import { FormControl, MenuItem, Checkbox, ListItemText, Select, InputLabel } from '@material-ui/core';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: '2%',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  menuItemStyle: {
    '&:hover': {
      backgroundColor: '#d3dadd !important',
      color: '#00648d !important',
    },
  },
  button: {
    margin: theme.spacing(0.5, 0),
    color: '#ffffff',
    background: '#00648d',
    textTransform: 'none',
    width: '100%',
    '&:hover': {
      backgroundColor: '#d96c2c !important',
      color: '#ffffff !important',
    },
  },
}));

export default function MultiSelectDropDown(props) {
  const classes = useStyles();
  return (
    <FormControl variant='outlined' className={classes.formControl}>
      <InputLabel id='client-label'>{props.labelName}</InputLabel>
      <Select
        labelId='client-outlined-label'
        id='client-outlined'
        multiple
        value={_.map(props.selectedValue, props.displayObj)}
        labelWidth={props.lableLength}
        renderValue={(selected) => selected.join(stringManipulationCheck.COMMA_OPERATOR)}
        onClose={
          props.handleCloseDropDown ? (e) => props.handleCloseDropDown() : stringManipulationCheck.EMPTY_STRING
        }>
        {props.dropDownData.length > 0 && (
          <MenuItem
            key={'select all' + props.displayObj}
            value={'All'}
            className={classes.menuItemStyle}
            onClick={(e) => props.handleSelecAllCheck()}>
            <Checkbox
              checked={props.selectedValue.length === props.dropDownData.length} />
            <ListItemText primary={displayText.SELECT_ALL} />
          </MenuItem>
        )}
        {props.dropDownData.map((data) => (
          <MenuItem
            key={data[props.displayObj]}
            value={data[props.displayObj]}
            className={classes.menuItemStyle}
            onClick={(e) => props.handleCheckData(data)}>
            <Checkbox
              checked={
                _.map(props.selectedValue, props.displayObj).indexOf(
                  data[props.displayObj]
                ) > -1
              } />
            <ListItemText primary={data[props.displayObj]} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
