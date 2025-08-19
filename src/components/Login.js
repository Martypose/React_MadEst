// src/components/Login.js
import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import swal from "sweetalert";
import { AuthService } from "../lib/AuthService";

const useStyles = makeStyles((theme) => ({
  root: { height: "100vh" },
  image: { backgroundImage: "url(/fondo.png)", backgroundSize: "cover" },
  paper: { margin: theme.spacing(8, 4), display: "flex", flexDirection: "column", alignItems: "center" },
  avatar: { margin: theme.spacing(1), backgroundColor: theme.palette.secondary.main },
  form: { width: "100%", marginTop: theme.spacing(1) },
  submit: { margin: theme.spacing(3, 0, 2) },
}));

export default function Signin() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await AuthService.login({ name, password });
      if (res.ok) {
        await swal("Bienvenido", `Hola ${res.username}`, "success", { buttons: false, timer: 1500 });
        window.location.assign("/estadisticas");
      } else {
        swal("Error", res.error || "Credenciales inválidas", "error");
      }
    } catch (err) {
      swal("Error", "No se pudo iniciar sesión", "error");
    }
  }

  return (
    <Grid container className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} md={7} className={classes.image} />
      <Grid item xs={12} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}><LockOutlinedIcon /></Avatar>
          <Typography component="h1" variant="h5">Sign in</Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined" margin="normal" required fullWidth
              id="email" name="email" label="Email Address"
              value={name} onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined" margin="normal" required fullWidth
              id="password" name="password" label="Password" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Sign In
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
