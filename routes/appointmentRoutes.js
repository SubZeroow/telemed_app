// Route to handle booking
router.post('/book-doctor/:doctorId', (req, res) => {
    const doctorId = req.params.doctorId;
    const userId = req.body.userId; 

    // Check if user is logged in (simplified example)
    if (!userId) {
        return res.status(400).json({ error: 'User must be logged in to book a doctor' });
    }

    // Book the doctor 
    const query = "INSERT INTO bookings (doctor_id, user_id) VALUES (?, ?)";
    db.query(query, [doctorId, userId])
        .then(() => res.status(200).json({ message: 'Doctor booked successfully' }))
        .catch(error => {
            console.error("Error booking doctor:", error);
            res.status(500).json({ error: 'Error booking doctor' });
        });
});
