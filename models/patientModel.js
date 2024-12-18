const db = require('../config/dbConfig'); 

class Patient {
  // Create a new patient
  static async create(data) {
    const sql = 'INSERT INTO Patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, Object.values(data));
    return result;
  }

  // Find a patient by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM Patients WHERE email = ?';
    const [rows] = await db.query(sql, [email]);
    return rows[0]; // Return the first row
  }

  // Update a patient's information
  static async update(id, data) {
    const sql = 'UPDATE Patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?';
    const [result] = await db.query(sql, [...Object.values(data), id]);
    return result;
  }

  // Delete a patient by ID
  static async delete(id) {
    const sql = 'DELETE FROM Patients WHERE id = ?';
    const [result] = await db.query(sql, [id]);
    return result;
  }
}

module.exports = Patient;