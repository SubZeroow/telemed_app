const db = require('../config/dbConfig');

class User {
    constructor({ first_name, last_name, email, password_hash, phone, date_of_birth, gender, address }) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password_hash = password_hash;
        this.phone = phone || null;
        this.date_of_birth = date_of_birth || null;
        this.gender = gender || null;
        this.address = address || null;
    }

    // Save the user to the database
    async save() {
        try {
            const [result] = await db.execute(
                'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [this.first_name, this.last_name, this.email, this.password_hash, this.phone, this.date_of_birth, this.gender, this.address]
            );
            return result;
        } catch (error) {
            console.error('Error saving user to database:', error);
            throw error;
        }
    }

    // Static method to get a user by email
    static async getUserByEmail(email) {
        try {
            const [rows] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw error;
        }
    }
}

module.exports = User;