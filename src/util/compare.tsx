
// TODO Typescript
import {Price} from "../types/Price";

export function compareStringAsNumber(a: string, b: string ) {
  if ( parseInt(a) < parseInt(b) ){
    return -1;
  }
  if ( parseInt(a) > parseInt(b) ){
    return 1;
  }
  return 0;
}

export function compareByLatest(a: Price, b: Price ) {
  if ( a.price < b.price ){
    return -1;
  }
  if ( a.price > b.price ){
    return 1;
  }
  return 0;
}

export function compareByRedemption(a: Price, b: Price ) {


  if ( a.redemption > b.redemption ){
    if ( a.redemption === 0){
      return 1;
    }
    return -1;
  }
  if ( a.redemption < b.redemption ){
    if ( b.redemption === 0){
      return -1;
    }
    return 1;
  }
  return 0;
}