import React from 'react';
import Button from '@material-ui/core/Button';
import { Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import TickIcon from './../assets/images/successtickIcon.png';
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
   successpasswordForm: {
      textAlign: 'center',
      maxWidth: '95%',
      width: '450px',
   },
   passwordupdateform: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      borderRadius: 12,
      padding: '10%',
      border: '3px solid #036290',
      background: '#ffffff',
   },
   Passwordupdatesubmit: {
      color: '#ffffff',
      margin: theme.spacing(3, 0, 2),
      borderRadius: 12,
      background: '#036290',
      '&:hover': {
         background: '#036290',
         color: '#ffffff',
      },
      textTransform: 'none',
   },
}));

export default function PasswordUpdate() {
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
               <div className={classes.successpasswordForm}>
                  <form className={classes.passwordupdateform} noValidate>
                     <img src={TickIcon} alt={displayText.CENOZON_LOGO} className={"MuiButton-fullWidth"} />

                     <h2>{displayText.PASSWORD_UPDATED}</h2>
                     <Grid item xs>
                        <Button
                           fullWidth
                           variant='contained'
                           className={classes.Passwordupdatesubmit}
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
