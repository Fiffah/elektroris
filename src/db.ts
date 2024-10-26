import mysql from 'mysql2';

// Tentukan tipe data untuk koneksi MySQL
interface DbConnection {
  host: string;
  user: string;
  password: string;
  database: string;
}

// Konfigurasi koneksi MySQL
const dbConfig: DbConnection = {
  host: 'localhost',
  user: 'root', // Sesuaikan dengan user MySQL Anda
  password: '', // Sesuaikan dengan password MySQL Anda
  database: 'elektroris',
};

// Buat koneksi ke database
const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');
});

export default db;
