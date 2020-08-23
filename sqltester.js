const mariadb = require('mariadb');
require('dotenv').config({ path: "./private/local.env" });
const pool = mariadb.createPool({
  host: process.env.SQL_HOST,
  database: process.env.SQL_DB,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  connectionLimit: 5
});

// executes mysql query, returns promise
async function exeSQL(q){
  let conn, data;
  try{
    conn = await pool.getConnection();
    data = await conn.query(q);
  }catch (err){
    return [err];
  }finally{
    if(conn)  rows => {
    console.log(err);
    for(let i in rows){
      console.log(rows[i]);
    }
  }
); conn.end();
    return data;
  }
}


// exeSQL(`INSERT INTO users ( uname, email, hash ) VALUES( "uname2", "email3", "hash2" );`)
async function main(){
  let rows = await exeSQL(`SELECT email, asdfasdf; fd;asfd`)
  console.log(rows);
  console.log("length:"+rows.length);
}
