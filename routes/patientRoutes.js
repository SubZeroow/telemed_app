// routes/patientRoutes.js
const express = require('express');
const router = express.Router();

// Route to display message confirming patient routes are active
router.get('/', (req, res) => {
    res.send('Patient routes');
});

// Route to get appointments for a patient
router.get('/appointments', async (req, res) => {
    const patientId = req.session.user.id; 
    try {
        const appointments = await db.query(
            'SELECT doctor, date, time FROM appointments WHERE patient_id = ?',
            [patientId]
        );
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Route to book a new appointment
router.post('/book-appointment', async (req, res) => {
    const { specialty, city, area, doctorName } = req.body;
    const patientId = req.session.user.id;

    // Basic validation
    if (!specialty || !city || !area || !doctorName) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await db.query(
            'INSERT INTO appointments (patient_id, doctor, specialty, city, area, date, time) VALUES (?, ?, ?, ?, ?, NOW(), "10:00 AM")',
            [patientId, doctorName, specialty, city, area]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});

// Route to fetch patient profile details
router.get('/profile', async (req, res) => {
    const patientId = req.session.user.id;
    try {
        const [profile] = await db.query(
            'SELECT first_name, last_name, phone, date_of_birth, gender, address FROM patients WHERE id = ?',
            [patientId]
        );
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Route to update patient profile details
router.put('/profile', async (req, res) => {
    const patientId = req.session.user.id;
    const { first_name, last_name, phone, date_of_birth, gender, address } = req.body;

    try {
        await db.query(
            'UPDATE patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?',
            [first_name, last_name, phone, date_of_birth, gender, address, patientId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;