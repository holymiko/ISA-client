
export function getTextYield(params: number): string {
    return params >= 1 ?
        "+" + Math.round(((+params)-1)*1_000_000)/10_000 + "%" :
        "-" + Math.round((1-(+params))*1_000_000)/10_000 + "%"
}

export function numberWithSpaces(x: number): string {
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts[0]
}

export function priceWithSpaces(x: number): string {
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

export function capitalizeFirstLetter(string: string|undefined): string{
    if(string === undefined) {
        return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}
