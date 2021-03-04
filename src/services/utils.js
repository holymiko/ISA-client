
export function getTextYield(params) {
    if(params >= 1){
        return "+" + Math.round(((+params)-1)*1_000_000)/10_000 + "%"
    } else {
        return "-" + Math.round((1-(+params))*1_000_000)/10_000 + "%"
    }
    
}

export function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

export function priceWithSpaces(x) {
    var parts = Math.round(x).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}
