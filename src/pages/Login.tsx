import React, {useEffect, useState} from 'react';
import {Box, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {isEmpty, logOutMemClean} from "../util/utils";
import {FormPassword} from "../components/FormPassword";
import {Role} from "../types/enums/role";
import {SnackbarISA} from "../components/SnackbarISA";
import {BoxChart} from "../components/BoxChart";
import {PersonAccountDto} from "../types/PersonAccountDto";
import {ButtonISA} from "../components/ButtonISA";
import {authorization} from "../services/auth";
import {getCurrentUser} from "../services/userService";


export const Login = () => {

  const navigate = useNavigate();
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [usernameHelperText, setUsernameHelperText] = useState<string>('');

  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordHelperText, setPasswordHelperText] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [snackMsg, setSnackMsg] = useState<string>('');
  const [isSnackOpen, setIsSnackOpen] = useState<boolean>(false);

  const handleRequestError = (statusCode: number) => {
    setUsernameError(true);
    setPasswordError(true);

    setUsername("");
    setPassword("");
    initCredentialEffects();
    setWasSubmitted(false);
    setSnackMsg(`Username/Password combination doesn't exist.`)
    setIsSnackOpen(true);

    switch (statusCode) {
      case 0: return setPasswordHelperText('Problem in communication with server. Check you internet connection.');
      case 401: return setPasswordHelperText('Combination of username and password doesn\'t exist');
      default: return setPasswordHelperText('Application error: ' + statusCode);
    }
  }

  const initCredentialEffects = () => {
    // Initialize
    setUsernameError(false);
    setUsernameHelperText('');
    setPasswordError(false);
    setPasswordHelperText('');
  }

  const onSubmit = () => {
    setWasSubmitted(true);

    // Basic validation
    if(isEmpty(username) || isEmpty(password)) {
      return;
    }

    initCredentialEffects();

    const highestRole = Role.SUPER_ADMIN
    if( highestRole !== Role.SUPER_ADMIN && highestRole !== Role.ADMIN ) {
      setSnackMsg(`You have been authenticated successfully, but as a '${highestRole}' you are missing authority for entering`)
      setIsSnackOpen(true);
    } else {
      authorization({username: username, password: password})
          .then((res) => {
            const {token} = res;
            localStorage.setItem("accessToken", token);
            // localStorage.setItem("refreshToken", refreshToken);
            getCurrentUser().then((user: PersonAccountDto) => {
              localStorage.setItem('user', JSON.stringify(user));
            }).catch(() => localStorage.setItem('user', JSON.stringify("dummy")))
            setTimeout(function(){
              navigate('/');
            }, 1000);

          }).catch(handleRequestError)
    }
  };

  useEffect(() => {
    if(!wasSubmitted) return;
    if(isEmpty(password)) {
      setPasswordError(true);
      setPasswordHelperText('Password is not set');
    } else {
      setPasswordError(false);
      setPasswordHelperText('');
    }}, [password, wasSubmitted]
  )

  useEffect(() => {
    if(!wasSubmitted) return;
    if(isEmpty(username)) {
      setUsernameError(true);
      setUsernameHelperText('Username is not set');
    } else {
      setUsernameError(false);
      setUsernameHelperText('');
    }}, [username, wasSubmitted]
  )

  // Removing variable used for Protected route. Variable is also removed is Sidebar component
  useEffect(() => {
    logOutMemClean();
  },[])

  return (
    <Box
      sx={{
        width: '1',
        display: 'flex',
        justifyContent: 'center',
    }}>
      <BoxChart
        sx={{
          mt: 6,
          display: 'flex',
          gap: 1,
          flexDirection: 'column'}}>


        {/* User input */}
        <TextField
          sx={{backgroundColor: "white"}}
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          error={usernameError}
          helperText={usernameHelperText}
        />
        <FormPassword
          hasPasswordError={passwordError}
          handlePassword={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          setShowPassword={() => setShowPassword(!showPassword)}
          inputLabel={'Password'}
          password={password}
          passwordHelperText={passwordHelperText}
        />
        <ButtonISA
          variant="contained"
          sx={{backgroundColor: '#0076c0'}}
          onClick={onSubmit}>
          Login
        </ButtonISA>
      </BoxChart>

      <SnackbarISA
        severity={"error"}
        open={isSnackOpen}
        setOpen={setIsSnackOpen}
      >
        <>{snackMsg}</>
      </SnackbarISA>
    </Box>
  );
}

export default Login;
