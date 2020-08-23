// relies on general.js functions


if(location.pathname === "/register"){
  function validRegistration(){
    let isValidEmail = validEmail(document.getElementById("email").value);
    let isValidPassw = validPassw(document.getElementById("passw").value);
    let isValidUname = validUname(document.getElementById("uname").value);
    let matchingPassw = (document.getElementById("passw").value === document.getElementById("passwb").value);
    document.getElementById("erra").style.display = isValidEmail ? "none" : "block";
    document.getElementById("errd").style.display = isValidPassw ? "none" : "block";
    document.getElementById("errb").style.display = isValidUname ? "none" : "block";
    document.getElementById("errc").style.display = matchingPassw ? "none" : "block";
    document.getElementById("erra-pass").style.display = isValidEmail ? "block" : "none";
    document.getElementById("errd-pass").style.display = isValidPassw ? "block" : "none";
    document.getElementById("errb-pass").style.display = isValidUname ? "block" : "none";
    document.getElementById("errc-pass").style.display = matchingPassw ? "block" : "none";
    document.getElementById("register-btn").disabled = !(isValidEmail && isValidPassw && matchingPassw && isValidUname);
  }
  function fixUname(){
    let u = document.getElementById("uname");
    if(u.value.length > 25)
      u.value = u.value.substr(0,25);
    if(!validUname(u.value))
      u.value = u.value.replace(/[^a-z0-9_-]/ig, "");
  }
  function fixPassw(b){
    let p = b ? document.getElementById("passwb") : document.getElementById("passw");
    if(p.value.length > 30)
      p.value = p.value.substr(0,30);
    if(!validCharacters(p.value))
      p.value = p.value.replace(/[^a-zA-Z0-9_@$!%*?&#:><-]/g, "");
  }
}
