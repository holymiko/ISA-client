import {isEmpty} from "./utils";

export const nameErrorMsg = (name: string): string => {
  if(isEmpty(name)) {
    return 'name has to be set';
  }
  if(name.trim() === '') {
    return 'name must NOT be whitespace';
  }
  return '';
}

export const passwordErrorMsg = (password: string): string => {
  if(isEmpty(password)) {
    return 'Password has to be set';
  }
  if(password.length < 6) {
    return 'Password minimum length is 6';
  }
  if(password.search(/[A-Z]/g) === -1) {
    return 'Password has to include one capital letter';
  }
  if(password.search(/\d/g) === -1) {
    return 'Password has to include one digit';
  }
  return '';
}

export const isValidEmailAddress = (value: string): boolean => {
  const found = value.search(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g);
  return found !== -1
}