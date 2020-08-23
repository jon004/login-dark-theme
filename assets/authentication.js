//////////////////////////////////////////////////////////////////////////////
// anything about authentication goes here
//////////////////////////////////////////////////////////////////////////////

const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');
const general = require('./public/js/general.js');

require('dotenv').config({ path: "./local.env" });
var session_secret = process.env.SESSION_SECRET;
const pool = mariadb.createPool({
  host: process.env.SQL_HOST,
  database: process.env.SQL_DB,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  connectionLimit: 5
});

//////////////////////////////////////////////////////////////////////////////
// helpers
//////////

// executes mysql query, returns promise
async function exeSQL(q){
  let conn, data;
  try{
    conn = await pool.getConnection();
    data = await conn.query(q);
  }catch (err){
    throw err;
  }finally{
    if(conn) conn.end();
    return data;
  }
}

function loggedOnVerification(req, res, next){
  if (req.isAuthenticated())
    return next();
  return res.redirect("/login");
}

function loggedOffVerification(req, res, next){
  if (!req.isAuthenticated())
    return next();
  return res.redirect("/profile");
}

//////////////////////////////////////////////////////////////////////////////
// functions
///////////

async function register(email, uname, passw){
  let errcode = 0;
  // do nothing if data format is invalid
  if(!general.validUname(uname) || !general.validPassw(passw) || !general.validEmail(email))
    return 400;
  let emailFound = await exeSQL(`SELECT id FROM users WHERE lower(email)="${email.toLowerCase()}"`);
  let unamesFound = await exeSQL(`SELECT id FROM users WHERE lower(uname)="${uname.toLowerCase()}"`);
  if(emailFound.length > 0) errcode += 1;
  if(unamesFound.length > 0) errcode += 2;
  if(!errcode){
    let hash = await bcrypt.hash(passw, 10);
    exeSQL(`INSERT INTO users ( uname, email, hash ) VALUES( "${uname}", "${email}", "${hash}" );`);
  }
  return errcode;
}

async function login(uname, passw){
  if(general.validEmail(uname) || general.validUname(uname)){
    let rows = await exeSQL(`SELECT id, hash FROM users WHERE lower(email)="${uname.toLowerCase()}" OR uname="${uname}";`);
    if(rows.length > 0 && await bcrypt.compare(passw, rows[0].hash))
        return rows[0];
  }
  return 0;
}

async function resetPassw(uid, oldpassw, newpassw){
  if(general.validPassw(oldpassw) && general.validPassw(newpassw)){
    let rows = await exeSQL(`SELECT hash FROM users WHERE id="${uid}";`);
    if(await bcrypt.compare(oldpassw, rows[0].hash)){
      let newhash = await bcrypt.hash(newpassw, 10);
      exeSQL(`UPDATE users SET hash="${newhash}" WHERE id="${uid}";`);
      return true;
    }
  }
  return false;
}

async function resetUname(uid, passw, newname){
  if(general.validPassw(passw) && general.validUname(newname)){
    let rows = await exeSQL(`SELECT id FROM users WHERE uname="${newname}";`);
    if(rows.length > 0) return false; // username is taken
    rows = await exeSQL(`SELECT hash FROM users WHERE id="${uid}";`);
    if(await bcrypt.compare(passw, rows[0].hash)){
      exeSQL(`UPDATE users SET uname="${newname}" WHERE id="${uid}";`);
      return true;
    }
  }
  return false;
}

async function resetEmail(uid, passw, newemail){
  if(general.validPassw(passw) && general.validEmail(newemail)){
    let rows = await exeSQL(`SELECT id FROM users WHERE email="${newemail}";`);
    if(rows.length > 0) return false; // email is taken
    rows = await exeSQL(`SELECT hash FROM users WHERE id="${uid}";`);
    if(await bcrypt.compare(passw, rows[0].hash)){
      exeSQL(`UPDATE users SET email="${newemail}" WHERE id="${uid}";`);
      return true;
    }
  }
  return false;
}

//////////////////////////////////////////////////////////////////////////////
// passport
///////////

passport.use(new LocalStrategy({ usernameField: 'uname', passwordField: 'passw' },
  async (uname, passw, done) => {
    let user = await login(uname, passw);
    if(user)
      return done(null, user);
    return done(null, false);
  }
));

passport.serializeUser((user, done) => { return done(null, user.id) });
passport.deserializeUser(async (id, done) => {
  let rows = await exeSQL(`SELECT id, uname, email, admin FROM users WHERE id="${id}";`);
  return done(null, rows[0]);
});

//////////////////////////////////////////////////////////////////////////////

module.exports = {
  register,
  passport,
  session_secret,
  loggedOnVerification,
  loggedOffVerification,
  resetPassw,
  resetEmail,
  resetUname
};

//////////////////////////////////////////////////////////////////////////////
