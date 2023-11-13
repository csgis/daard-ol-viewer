let spinner_show = function (){
    document.getElementById("spinner").style.zIndex = "7";
}

let spinner_hide = function (){
    document.getElementById("spinner").style.zIndex = "0";
}

export {spinner_show, spinner_hide}