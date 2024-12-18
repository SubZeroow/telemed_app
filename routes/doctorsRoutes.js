const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig');

// Get distinct specializations
router.get('/specializations', (req, res) => {
    db.query("SELECT DISTINCT specialization FROM doctors WHERE specialization IS NOT NULL AND specialization <> ''")
        .then(([rows]) => res.json(rows.map(row => row.specialization)))
        .catch(error => {
            console.error("Error fetching specializations:", error);
            res.status(500).json({ error: 'Error fetching specializations' });
        });
});

// Get municipalities based on city
router.get('/municipalities/:city', (req, res) => {
    const city = req.params.city;
    db.query("SELECT DISTINCT municipality FROM doctors WHERE city = ? AND municipality IS NOT NULL AND municipality <> ''", [city])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ error: `No municipalities found for city: ${city}` });
            }
            res.json(rows.map(row => row.municipality));
        })
        .catch(error => {
            console.error("Error fetching municipalities:", error);
            res.status(500).json({ error: 'Error fetching municipalities' });
        });
});

// Get distinct cities
router.get('/cities', (req, res) => {
    db.query("SELECT DISTINCT city FROM doctors WHERE city IS NOT NULL AND city <> ''")
        .then(([rows]) => res.json(rows.map(row => row.city)))
        .catch(error => {
            console.error("Error fetching cities:", error);
            res.status(500).json({ error: 'Error fetching cities' });
        });
});

// Search doctors with JSON response
router.get('/search', async (req, res) => { // Adjusted the endpoint to `/search`
    const { specialization, city, municipality } = req.query;
    let query = "SELECT id, CONCAT(first_name, ' ', last_name) AS fullName, specialization, city, municipality FROM doctors WHERE 1=1";
    const params = [];

    if (specialization) {
        query += " AND specialization = ?";
        params.push(specialization);
    }
    if (city) {
        query += " AND city = ?";
        params.push(city);
    }
    if (municipality) {
        query += " AND municipality = ?";
        params.push(municipality);
    }

    try {
        const [rows] = await db.query(query, params);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No doctors found matching the search criteria' });
        }

        const doctors = rows.map(row => ({
            id: row.id,
            fullName: row.fullName,
            specialization: row.specialization,
            city: row.city,
            municipality: row.municipality,
        }));
        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: `Error fetching doctors: ${error.message}` });
    }
});

module.exports = router;