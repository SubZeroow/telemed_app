const db = require('./config/dbConfig');

const setupDatabase = async () => {
  try {
    // Select the telemedicine database
    await db.query('USE telemedicine;');

    // Confirm that the telemedicine database is selected
    const [selectedDatabase] = await db.query('SELECT DATABASE() AS db;');
    console.log(`Using database: ${selectedDatabase[0].db}`);

    // Check existing table structure
    const [existingTables] = await db.query('SHOW TABLES;');
    console.log('Existing tables:', existingTables);

    // Create patients table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(100) UNIQUE,
        password_hash VARCHAR(255),
        phone VARCHAR(20),
        date_of_birth DATE,
        gender ENUM('Male', 'Female', 'Other'),
        address VARCHAR(255)
      );
    `);

    // Create doctors table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        specialization VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(20),
        schedule JSON
      );
    `);

    // Create appointments table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT,
        doctor_id INT,
        appointment_date DATE,
        appointment_time TIME,
        status ENUM('scheduled', 'completed', 'canceled'),
        FOREIGN KEY (patient_id) REFERENCES patients(id),
        FOREIGN KEY (doctor_id) REFERENCES doctors(id)
      );
    `);

    // Create admin table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        password_hash VARCHAR(255),
        role ENUM('admin', 'superadmin')
      );
    `);

    // Check what tables have been created
    const [tablesCreated] = await db.query('SHOW TABLES;');
    console.log('Tables created:', tablesCreated);

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error during database setup:', error);
  }
};

module.exports = setupDatabase;