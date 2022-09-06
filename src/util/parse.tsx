
export function getIdFromUrl( pathname: string ): number {
  const end = pathname.length - 1;
  if(pathname[ end ] === '/') {
    pathname = pathname.substring(0, end-1)
  }

  const stringId = pathname.split('/').pop()
  return stringId !== undefined ? +stringId : -1
}