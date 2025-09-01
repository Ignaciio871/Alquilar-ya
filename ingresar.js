const  ver = document.getElementById("verpassword")

ver.addEventListener("change", vercontrasena())
function vercontrasena (){
    if (ver.ariaChecked === true) {
        document.getElementById("inpassword").type="text"

    }else{
        document.getElementById("inpassword").type="password"
    }
}
const botoningresar  = document.getElementById("btniniciar")
botoningresar.addEventListener("click", ingresar)

function ingresar(){
    alert("esta por ingresar")
    window.location href="paneledecontrol.html"
}