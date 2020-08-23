function validEmail(email){
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
// Minimum 8-30 characters, at least one uppercase letter, one lowercase letter and one number
function validPassw(password){
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#:><-])[A-Za-z\d@$!%*?&#:><-]{8,30}$/;
  return re.test(String(password));
}
function validUname(str){
  const re = /^[a-z0-9-_]{3,25}$/i;
  return re.test(String(str));
}
function validCharacters(str){
  const re = /^[a-zA-Z0-9_@$!%*?&#:><-]*$/;
  return re.test(String(str));
}

module.exports = { validUname, validEmail, validPassw, validCharacters };
