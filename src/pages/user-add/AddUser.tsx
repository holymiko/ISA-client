import Box from "@mui/material/Box";
import {
  AlertColor,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  Typography,
  useTheme
} from "@mui/material";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Role} from "../../types/enums/role";
import {
  filterNonLetters,
  isEmpty,
  isSuperAdmin, logOutMemClean
} from "../../util/utils";
import {MuiTelInput} from 'mui-tel-input';
import {isValidEmailAddress, nameErrorMsg, passwordErrorMsg} from "./AddUserValidations";
import {FormPassword} from "../../components/FormPassword";
import {useNavigate} from "react-router-dom";
import {SnackbarISA} from "../../components/SnackbarISA";
import {ButtonISA} from "../../components/ButtonISA";
import {PersonAccountDto} from "../../models/user";
import {PageTitle} from "../../components/PageTitle";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export const AddUser = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);
  //// User inputs
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('+32');
  const [tenantId, setTenantId] = useState<string>('');
  const [facilityId, setFacilityId] = useState<string>('');
  const [roles, setRoles] = useState<string[]>([]);

  //// Dynamic error messages
  const [usernameHelperText, setUsernameHelperText] = useState<string>('');
  const [passwordHelperText, setPasswordHelperText] = useState<string>('');
  const [firstNameHelperText, setFirstNameHelperText] = useState<string>('');
  const [lastNameHelperText, setLastNameHelperText] = useState<string>('');
  const [phoneHelperText, setPhoneHelperText] = useState<string>('');

  //// Advanced error indicators
  const [hasUsernameError, setHasUsernameError] = useState<boolean>(false);
  const [hasPasswordError, setHasPasswordError] = useState<boolean>(false);
  const [hasFirstNameError, setHasFirstNameError] = useState<boolean>(false);
  const [hasLastNameError, setHasLastNameError] = useState<boolean>(false);
  //// Simple error indicators
  const hasConfirmPasswordError: boolean = wasSubmitted && password !== confirmPassword;
  const hasEmailError: boolean = wasSubmitted && !isValidEmailAddress(email);
  const hasFacilityError: boolean = wasSubmitted && isEmpty(facilityId);
  const hasRolesError: boolean = wasSubmitted && roles.length === 0;
  const isSubmitDisabled = wasSubmitted && (hasUsernameError || hasPasswordError || hasConfirmPasswordError ||
    hasFirstNameError || hasLastNameError || hasEmailError || hasFacilityError || hasRolesError);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [tenantDisabled, setTenantDisabled] = useState<boolean>(false);
  const [tenantIdNameMap, setTenantIdNameMap] = useState<Map<number, string>>();
  const [facilityIdNameMap, setFacilityIdNameMap] = useState<Map<number, string>>();
  const [currentUser, setCurrentUser] = useState<PersonAccountDto>();
  const [rolesForSelect, setRolesForSelect] = useState<string[]>([])

  // Snack bar hooks - used to show result of BE requests
  const [snackMsg, setSnackMsg] = useState<string>('');
  const [snackSeverity, setSnackSeverity] = useState<AlertColor>('success');
  const [isSnackOpen, setIsSnackOpen] = useState<boolean>(false);

  // Occasional error of refresh token. Not sure if BE or FE
  const handleLoadingError = (status: any) => {
    if(status === 401 || status === '401') {
      logOutMemClean();
      navigate( "/login");
    } else {
      alert('Error '+status)
    }
  }

  // useEffect(() => {
  //   const stringUser = sessionStorage.getItem('user');
  //
  //   if(isEmpty(stringUser)) {
  //     logOutMemClean();
  //     navigate("/login");
  //   } else {
  //     const user: UserDto = JSON.parse(stringUser!);
  //     const facilityMap = new Map();
  //     const tenantMap = new Map();
  //     setCurrentUser(user);
  //     setRolesForSelect(
  //       getSubordinateRoles(
  //         getIndexOfHighestRole([Roles.SUPERADMIN])
  //       )
  //     );
  //
  //       // Super Admin can create users from other Tenants
  //     //   getTenantList().then(res => {
  //     //     res.forEach(t => {
  //     //       tenantMap.set(t.id!, t.name!);
  //     //     })
  //     //   }).catch(handleLoadingError)
  //     // } else {
  //     //   getTenantById(user?.tenantId!).then((res) => {
  //     //     tenantMap.set(res.id!, res.name!);
  //     //     setTenantDisabled(true);
  //     //   }).catch(handleLoadingError)
  //     }
  // },[])

  // useEffect(() => {
  //   // Load Tenant ID/Name Map
  //   if(currentUser !== undefined) {
  //     // getTenantById(currentUser?.tenantId!).then((res) => {
  //     //   const facilityMap = new Map();
  //     //   res.facilities!.forEach(f => facilityMap.set(f.id, f.name));
  //     //   setFacilityIdNameMap(facilityMap);
  //     // }).catch(handleLoadingError)
  //   }
  // }, [tenantId, currentUser])

  /////// Error useEffects

  useEffect( () => {
    if(!wasSubmitted) return;
    const validationResult = nameErrorMsg(firstName);
    if(validationResult === '') {
      setHasFirstNameError(false);
      setFirstNameHelperText('');
      return;
    }
    setHasFirstNameError(true);
    setFirstNameHelperText('First ' + validationResult);
    }, [firstName, wasSubmitted]
  );
  useEffect( () => {
    if(!wasSubmitted) return;
    const validationResult = nameErrorMsg(lastName);
    if(validationResult === '') {
      setHasLastNameError(false);
      setLastNameHelperText('');
      return;
    }
    setHasLastNameError(true);
    setLastNameHelperText('Last ' + validationResult);
    }, [lastName, wasSubmitted]
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
    setWasSubmitted(true);

    setFirstName(firstName.trim());
    setMiddleName(middleName.trim());
    setLastName(lastName.trim());
    setUsername(username.trim());
    setEmail(email.trim());
    setPhone(phone.trim());

    if(nameErrorMsg(firstName) !== '' || nameErrorMsg(lastName) !== '' || nameErrorMsg(username) !== '' ||
      passwordErrorMsg(password) !== '' || password !== confirmPassword || !isValidEmailAddress(email) ||
      isEmpty(facilityId) || roles.length === 0
    ) {
      return;
    }

    // @ts-ignore
    // const roleKeys: Roles[] = roles.map( x => Roles[x] );

    // const userCreateDto: UserCreateDto = {
    //   // password: password,
    //   tenantId: Number(tenantId),
    //   facilityId: Number(facilityId),
    //   roles: roles,
    //   profile: {
    //     firstName: firstName,
    //     lastName: lastName,
    //     midName: middleName,
    //     email: email,
    //     phoneNumber: phone
    //   },
    // }

    // createUser(username, userCreateDto).then(() => {
    //   setSnackSeverity("success");
    //   setSnackMsg("User has been created");
    //   setIsSnackOpen(true);
    // }).catch(status => {
    //   switch (status) {
    //     case 401: {
    //       //logOutMemClean();
    //       //<Navigate to={}
    //       // alert('Log out')
    //       break;
    //     }
    //     case 409: {
    //       setHasUsernameError(true);
    //       setUsernameHelperText('Username already exists. Change username')
    //       break;
    //     }
    //     default: {
    //       setSnackSeverity("warning");
    //       setSnackMsg(`User hasn't been created. Error ${status}`)
    //       setIsSnackOpen(true);
    //     }
    //   }
    // })
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
  const handleRoles = (event: SelectChangeEvent<typeof roles>) => {
    const {target: { value }} = event;
    setRoles (
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return(
    <Box>
      <PageTitle sx={{mb: '2rem'}}>
        Add user
      </PageTitle>

      {/*/////////////////// CREDENTIALS ///////////////////*/}
      <Box sx={{ width: '1', gap: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4">Credentials</Typography>
        <Box sx={{ width: '1', gap: 1, my: 1, display: 'flex', flexDirection: 'inline-flex' }}>
          <TextField
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            error={hasUsernameError}
            helperText={usernameHelperText}
            sx={{minWidth: 270}}
          />
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
        {/*/////////////////// PROFILE ///////////////////*/}
        <Typography variant="h4">Profile</Typography>
        <Box sx={{ width: '1', gap: 1, my: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ width: '.7', gap: 1, my: 1}} >
            <FormControl sx={{ minWidth: 548 }} error={hasRolesError}>
              <InputLabel>Role</InputLabel>
              <Select
                  multiple
                  value={roles}
                  onChange={handleRoles}
                  input={<OutlinedInput label="Role" />}
                  MenuProps={MenuProps}
              >
                {(rolesForSelect as Array<keyof typeof Role>).map((roleKey) => ([
                      <MenuItem
                          key={roleKey}
                          value={roleKey}
                          style={getStyles(roleKey, roles, theme)}
                      >
                        {Role[roleKey]}
                      </MenuItem>
                    ]
                ))}
              </Select>
              <FormHelperText>{hasRolesError ? 'At least one role has to be chosen' : ''}</FormHelperText>
            </FormControl>
          </Box>
          <Box sx={{ width: '1', gap: 1, display: 'flex', flexDirection: 'inline-flex' }}>
            <TextField
              label="First name"
              onChange={handleFirstName}
              value={firstName}
              error={hasFirstNameError}
              helperText={firstNameHelperText}
              sx={{minWidth: 270}}
            />
            <TextField
              label="Middle name"
              type="text"
              onChange={handleMiddleName}
              value={middleName}
              sx={{minWidth: 270}}
            />
            <TextField
              label="Last name"
              type="text"
              onChange={handleLastName}
              value={lastName}
              error={hasLastNameError}
              helperText={lastNameHelperText}
              sx={{minWidth: 270}}
            />
          </Box>
          <Box sx={{ width: '1', gap: 1, display: 'flex', flexDirection: 'inline-flex' }}>
            {/*TODO Test prefix behaviour*/}
            <MuiTelInput
              value={phone}
              //defaultCountry={'us'}
              // error={hasPhoneError}
              helperText={phoneHelperText}
              onChange={handlePhoneChange}
              variant="outlined"
              sx={{ width: 270 }}
            />
            <TextField
              label="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              error={hasEmailError}
              helperText={hasEmailError ? 'Email address is invalid' : ''}
              sx={{minWidth: 270}}
            />
          </Box>
        </Box>


        <ButtonISA
          variant='contained'
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          sx={{mt: 1}}
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