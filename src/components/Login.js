import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(/fondo.png)',
    backgroundSize: 'cover',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

async function loginUser(credentials) {



  // Enviar datos a la API, pidiendo un token de acceso

  console.log('credenciales: '+credentials.name + ' ' + credentials.password)
  
  return axios.post(`${process.env.REACT_APP_URL_API}/login`, {
    name: credentials.name,
    password: credentials.password
  }, {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true,
  }).then(response => response.data)
    .catch(error => {
      console.log(error)
      return error.response.data
    })
 }

export default function Signin() {
  const classes = useStyles();
  const [name, setname] = useState();
  const [password, setPassword] = useState();
  


  const handleSubmit = async e => {

    console.log(name, password)
    console.log('enviando datos')
    e.preventDefault();
    const response = await loginUser({
      name: name,
      password: password
    });
    


    if (response && 'accessToken' in response) {
      swal("Success", response.message, "success", {
        buttons: false,
        timer: 2000,
      })
      .then((value) => {
        localStorage.setItem('accessToken', response['accessToken'].accessToken);
        localStorage.setItem('refreshToken', response['refreshToken'].refreshToken);
        localStorage.setItem('username', response['username']);
        window.location.href = "/estadisticas";
      });
    } else {
      swal("Failed", response ? response.error : 'Network Error', "error");
      console.log(response)

    }
  }

  return (
    <Grid container className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} md={7} className={classes.image} />
      <Grid item xs={12} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              onChange={e => setname(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}