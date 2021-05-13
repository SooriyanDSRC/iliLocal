import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, InputBase, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { stringManipulationCheck } from '../../constant';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    height: 50,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function SearchField(props) {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState(stringManipulationCheck.EMPTY_STRING);

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      props.handleSearch(searchValue);
    }
  };

  const handleClearSearch = (e) => {
    setSearchValue(stringManipulationCheck.EMPTY_STRING);
    props.handleSearch(stringManipulationCheck.EMPTY_STRING);
  };

  return (
    <Paper className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder='Search'
        inputProps={{ 'aria-label': 'search' }}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        onKeyPress={(e) => handleEnterKeyPress(e)} />
      {searchValue.length > 0 ? (
        <ClearIcon style={{ cursor: "pointer" }} aria-label='clear' onClick={(e) => handleClearSearch()} />
      ) : (stringManipulationCheck.EMPTY_STRING)}
      <IconButton
        type='submit'
        className={classes.iconButton}
        aria-label='search'
        onClick={(e) => props.handleSearch(searchValue)}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
