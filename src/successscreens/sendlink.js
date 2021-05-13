import React from 'react';
import Button from '@material-ui/core/Button';
import { Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Envelop from './../assets/images/mailenvelop.png';
import { displayText } from '../constant';

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#ffffff',
    position: 'fixed',
    height: '100%',
    width: '100%',
  },
  mainDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '0',
  },
  sendlinkForm: {
    maxWidth: '95%',
    width: '450px',
    textAlign: 'center',
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    borderRadius: 12,
    padding: '10%',
    border: '3px solid #036290',
    background: '#ffffff',
  },
  textfield: {
    width: '100%',
    marginTop: '15px',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: '#036290',
    borderRadius: 12,
    color: '#ffffff',
    textTransform: 'none',
    '&:hover': {
      background: '#036290',
      color: '#ffffff',
    },
  },
}));

export default function SendLink() {
  const history = useHistory();
  const classes = useStyles();
  const handlenavigation = () => {
    history.push('/login');
  };
  return (
    <div
      className='c-app c-default-layout flex-row align-items-center background-white'
    >
      <Container>
        <div className={classes.mainDiv}>
          <div className={classes.sendlinkForm}>
            <form className={classes.form} noValidate>
              <div>
                <img
                  src={Envelop}
                  alt={displayText.CENOZON_LOGO}
                  className={"MuiButton-fullWidth"}
                />
              </div>
              <h2>{displayText.MAIL_SENT_SUCCESS}</h2>
              <Grid item xs>
                <Button
                  fullWidth
                  variant='contained'
                  className={classes.submit}
                  onClick={handlenavigation}
                >
                  {displayText.LOGIN_TO_CONTINUE}
                </Button>
              </Grid>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
