import Box from "@mui/material/Box";
import {AlertColor, Checkbox, FormControlLabel, SelectChangeEvent, TextField, Typography} from "@mui/material";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Role} from "../../types/enums/role";
import {
  filterNonLetters,
  filterPhoneNonDigit, getSessionUser,
  getIndexOfHighestRole,
  getSubordinateRoles,
  isEmpty,
  logOutMemClean
} from "../../util/utils";
import {MuiTelInput} from 'mui-tel-input';
import {isValidEmailAddress, nameErrorMsg, passwordErrorMsg} from "../../util/validations";
import {FormPassword} from "../../components/FormPassword";
import {useNavigate} from "react-router-dom";
import {SnackbarISA} from "../../components/SnackbarISA";
import {ButtonISA} from "../../components/ButtonISA";
import {PersonAccountCreateDto} from "../../types/PersonAccountCreateDto";
import {TypographyPageTitle} from "../../components/TypographyPageTitle";
import {createAccount, createUser} from "../../services/userService";
import {FormControlRoles} from "../../components/FormControlRoles";
import {PersonAccountDto} from "../../types/PersonAccountDto";
import {AccountCreateDto} from "../../types/AccountCreateDto";


export const AddUser = () => {
  const navigate = useNavigate();

  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);
  //// User inputs
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('+420');
  const [role, setRole] = useState<string>('');

  //// Dynamic error messages
  const [usernameHelperText, setUsernameHelperText] = useState<string>('');
  const [passwordHelperText, setPasswordHelperText] = useState<string>('');
  const [firstNameHelperText, setFirstNameHelperText] = useState<string>('');
  const [lastNameHelperText, setLastNameHelperText] = useState<string>('');
  const [phoneHelperText, setPhoneHelperText] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [personVisible, setPersonVisible] = useState<boolean>(true);
  const [rolesForSelect, setRolesForSelect] = useState<string[]>([])

  // Snack bar hooks - used to show result of BE requests
  const [snackMsg, setSnackMsg] = useState<string>('');
  const [snackSeverity, setSnackSeverity] = useState<AlertColor>('success');
  const [isSnackOpen, setIsSnackOpen] = useState<boolean>(false);

  //// Advanced error indicators
  const [hasUsernameError, setHasUsernameError] = useState<boolean>(false);
  const [hasPasswordError, setHasPasswordError] = useState<boolean>(false);
  const [hasFirstNameError, setHasFirstNameError] = useState<boolean>(false);
  const [hasLastNameError, setHasLastNameError] = useState<boolean>(false);
  const [hasEmailError, setHasEmailError] = useState<boolean>(false);

  //// Simple error indicators
  const hasConfirmPasswordError: boolean = wasSubmitted && password !== confirmPassword;
  const hasRoleError: boolean = wasSubmitted && isEmpty(role);
  const isSubmitDisabled = wasSubmitted
      && (hasUsernameError || hasPasswordError || hasConfirmPasswordError || hasRoleError)
      || (personVisible && (hasFirstNameError || hasLastNameError || hasEmailError));

  // Occasional error of refresh token. Not sure if BE or FE
  const handleLoadingError = (status: any) => {
    if(status === 401 || status === '401') {
      logOutMemClean();
      navigate( "/login");
    } else {
      alert('Error '+status)
    }
  }

  useEffect(() => {
    const user: PersonAccountDto = getSessionUser(navigate)!;
    setRolesForSelect(
        getSubordinateRoles(
            getIndexOfHighestRole([user.account!.role!])
        )
    );
  }, [])

  /////// Error useEffects

  useEffect( () => {
      if(!wasSubmitted) return;
      if(!personVisible) return;
      setHasEmailError(!isValidEmailAddress(email));
  }, [email, personVisible, wasSubmitted]);

  useEffect( () => {
    if(!wasSubmitted) return;
    if(!personVisible) return;
    const validationResult = nameErrorMsg(firstName);
    if(validationResult === '') {
      setHasFirstNameError(false);
      setFirstNameHelperText('');
      return;
    }
    setHasFirstNameError(true);
    setFirstNameHelperText('First ' + validationResult);
    }, [firstName, personVisible, wasSubmitted]
  );

  useEffect( () => {
    if(!wasSubmitted) return;
    if(!personVisible) return;
    const validationResult = nameErrorMsg(lastName);
    if(validationResult === '') {
      setHasLastNameError(false);
      setLastNameHelperText('');
      return;
    }
    setHasLastNameError(true);
    setLastNameHelperText('Last ' + validationResult);
    }, [lastName, personVisible, wasSubmitted]
  );

  useEffect( () => {
      if(!wasSubmitted) return;
      const validationResult = nameErrorMsg(username);
      if(validationResult === '') {
        setHasUsernameError(false);
        setUsernameHelperText('');
        return;
      }
      setHasUsernameError(true);
      setUsernameHelperText('User' + validationResult);
    }, [username, wasSubmitted]
  );

  useEffect( () => {
    if(!wasSubmitted) return;
    const validationResult = passwordErrorMsg(password);
    if(validationResult === '') {
      setHasPasswordError(false);
    } else {
      setHasPasswordError(true);
    }
    setPasswordHelperText(validationResult);
    }, [password, wasSubmitted]
  );

  //////////// Handling

  const handleSubmit = () => {
    let promise: Promise<any>;
    setWasSubmitted(true);

    setUsername(username.trim());
    if(nameErrorMsg(username) !== '' || passwordErrorMsg(password) !== '' || password !== confirmPassword || role.length === 0) {
      return;
    }

    if(personVisible) {
      setFirstName(firstName.trim());
      // setMiddleName(middleName.trim());
      setLastName(lastName.trim());
      setEmail(email.trim());

      if(nameErrorMsg(firstName) !== '' || nameErrorMsg(lastName) !== '' || !isValidEmailAddress(email)) {
        return;
      }
    }

    let userCreateDto: AccountCreateDto|PersonAccountCreateDto = {
        // @ts-ignore
        role: Role[role],
        username: username,
        password: password,
    }

    if(personVisible) {
      userCreateDto = {
        account: userCreateDto,
        firstName: firstName,
        lastName: lastName,
        midName: middleName,
        email: email,
        phone: filterPhoneNonDigit(phone)
      }
      promise = createUser(userCreateDto);
    } else {
      promise = createAccount(userCreateDto);
    }

    promise.then(() => {
      setSnackSeverity("success");
      setSnackMsg("User has been created");
      setIsSnackOpen(true);
    }).catch(error => {
      switch (error.response.status) {
        case 401: {
          //logOutMemClean();
          //<Navigate to={}
          // alert('Log out')
          break;
        }
        case 409: {
          setHasUsernameError(true);
          setUsernameHelperText('Username already exists. Change username')
          break;
        }
        default: {
          setSnackSeverity("warning");
          setSnackMsg(`User hasn't been created. Error ${error.response.status} ${error.response.data}`)
          setIsSnackOpen(true);
        }
      }
    })
  }

  //////////// Input handling ////////////////////////

  const handlePhoneChange = (value: any) => {
    // if(filterPhoneNonDigit(value).length < PHONE_NUMBER_MIN_DIGIT_LENGTH) {
    //   setPhoneHelperText('Minimum length of valid phone number is ' + PHONE_NUMBER_MIN_DIGIT_LENGTH)
    //   setPhone('')
    // } else {
    //   setPhoneHelperText('');
      setPhone(value);
    // }
  }
  const handleFirstName = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFirstName(
      filterNonLetters(e.target.value)
    )
  }
  const handleMiddleName = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setMiddleName(
      filterNonLetters(e.target.value)
    )
  }
  const handleLastName = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setLastName(
      filterNonLetters(e.target.value)
    )
  }
  const handlePassword = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPassword(e.target.value.replaceAll(' ', ''));
  }
  const handleConfirmPassword = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setConfirmPassword(e.target.value.replaceAll(' ', ''));
  }
  const handleRoles = (event: SelectChangeEvent<typeof role>) => {
    const {target: { value }} = event;
    setRole(value);
  };

  return(
    <Box sx={{width: 1}}>
      <TypographyPageTitle sx={{mb: '2rem'}}>
        Add user
      </TypographyPageTitle>


      <Box sx={{ width: '1', gap: 1, mb: 0, display: 'flex', flexDirection: 'column' }}>
        {/*/////////////////// ACCOUNT ///////////////////*/}
        <Box sx={{ width: '1', gap: 0, mb: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4">Account</Typography>
          <Box sx={{ width: '1', gap: 1, my: 1, display: 'flex', flexDirection: 'inline-flex' }}>
            <TextField
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              error={hasUsernameError}
              helperText={usernameHelperText}
              sx={{minWidth: 281, width: 0.2}}
            />
            <FormControlRoles roles={role} hasRolesError={hasRoleError} handleRoles={handleRoles} rolesForSelect={rolesForSelect} />
          </Box>
          <Box sx={{ width: '1', gap: 1, mt: 1, display: 'flex', flexDirection: 'inline-flex' }}>
            <FormPassword
              hasPasswordError={hasPasswordError}
              handlePassword={handlePassword}
              showPassword={showPassword}
              setShowPassword={() => setShowPassword(!showPassword)}
              inputLabel={"Password"}
              password={password}
              passwordHelperText={passwordHelperText}
            />
            <FormPassword
              hasPasswordError={hasConfirmPasswordError}
              handlePassword={handleConfirmPassword}
              showPassword={showConfirmPassword}
              setShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
              inputLabel={"Confirm Password"}
              password={confirmPassword}
              passwordHelperText={(hasConfirmPasswordError ? 'Passwords doesn\'t match' : '')}
            />
          </Box>

          {/* Checkbox */}
          <FormControlLabel sx={{mx: 1}} label={"add Person to Account"} control={
                <Checkbox
                    checked={personVisible}
                    onChange={() => setPersonVisible(!personVisible)}
          />}/>
        </Box>
        {/*/////////////////// PERSON ///////////////////*/}
        {personVisible ?
        <Box sx={{ width: '1', gap: 0, my: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4">Person</Typography>
          <Box sx={{ width: '1', gap: 1, my: 1, display: 'flex', flexDirection: 'inline-flex' }}>
            <TextField
              label="First name"
              onChange={handleFirstName}
              value={firstName}
              error={hasFirstNameError}
              helperText={firstNameHelperText}
              sx={{minWidth: 281, width: 0.2}}
            />
            {/*<TextField*/}
            {/*  label="Middle name"*/}
            {/*  type="text"*/}
            {/*  onChange={handleMiddleName}*/}
            {/*  value={middleName}*/}
            {/*  sx={{minWidth: 281, width: 0.2}}*/}
            {/*/>*/}
            <TextField
              label="Last name"
              type="text"
              onChange={handleLastName}
              value={lastName}
              error={hasLastNameError}
              helperText={lastNameHelperText}
              sx={{minWidth: 281, width: 0.2}}
            />
          </Box>
          <Box sx={{ width: '1', gap: 1, mt: 1, display: 'flex', flexDirection: 'inline-flex' }}>
            <MuiTelInput
              value={phone}
              //defaultCountry={'us'}
              // error={hasPhoneError}
              helperText={phoneHelperText}
              onChange={handlePhoneChange}
              variant="outlined"
              sx={{minWidth: 281, width: 0.2}}
            />
            <TextField
              label="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              error={hasEmailError}
              helperText={hasEmailError ? 'Email address is invalid' : ''}
              sx={{minWidth: 281, width: 0.2}}
            />
          </Box>
        </Box>
        : <></>}

        <ButtonISA
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          sx={{mt: 1, width: 0.405, height: 50}}
        >
          Submit
        </ButtonISA>

        <SnackbarISA severity={snackSeverity} open={isSnackOpen} setOpen={setIsSnackOpen}>
          <>{snackMsg}</>
        </SnackbarISA>
      </Box>
    </Box>
  )
}