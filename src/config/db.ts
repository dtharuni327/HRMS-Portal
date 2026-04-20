import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',              
  password: 'Adhvik@1905', 
  database: 'hrms_portal'    
});

export default pool;