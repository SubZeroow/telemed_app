-- select the telemedicine database
USE telemedicine;

--confirm that the telemedicine database is selected
SELECT DATABASE();

--  check existing table structure
SHOW TABLES;

-- create patients table if not exists
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

-- create doctors table if not exists
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  specialization VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  schedule JSON
);

-- create appointments table if not exists
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

-- create admin table if not exists
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('admin', 'superadmin')
);

--  check what tables have been created
SHOW TABLES;

-- added doctors password column to doctors table
ALTER TABLE doctors
ADD COLUMN password_hash VARCHAR(100);

-- add city and municipality
ALTER TABLE doctors
ADD COLUMN city VARCHAR(100),
ADD COLUMN municipality VARCHAR(100);



-- insert data into doctors table
INSERT INTO doctors (first_name, last_name, specialization, email, phone, password_hash, schedule, city, municipality) VALUES
('John', 'Doe', 'Cardiologist', 'johndoe@example.com', '1234567890', '$2b$12$exampleHash1234567890abcdef', '{"Monday": ["09:00-12:00", "13:00-17:00"], "Tuesday": ["09:00-12:00", "13:00-17:00"]}', 'Nairobi', 'Nairobi Central'),
('Jane', 'Smith', 'Dermatologist', 'janesmith@example.com', '2345678901', '$2b$12$exampleHash1234567890abcdef', '{"Monday": ["08:00-11:00", "12:00-15:00"], "Wednesday": ["09:00-13:00"], "Friday": ["10:00-14:00"]}', 'Mombasa', 'Mombasa Central'),
('Alice', 'Johnson', 'Orthopedic', 'alicejohnson@example.com', '3456789012', '$2b$12$exampleHash1234567890abcdef', '{"Monday": ["10:00-13:00"], "Tuesday": ["09:00-12:00", "13:00-16:00"], "Thursday": ["08:00-12:00"]}', 'Kisumu', 'Kisumu East'),
('Michael', 'Williams', 'Pediatrician', 'michaelwilliams@example.com', '4567890123', '$2b$12$exampleHash1234567890abcdef', '{"Tuesday": ["09:00-12:00", "13:00-17:00"], "Friday": ["08:00-13:00"]}', 'Nakuru', 'Nakuru East'),
('Emily', 'Brown', 'Neurologist', 'emilybrown@example.com', '5678901234', '$2b$12$exampleHash1234567890abcdef', '{"Monday": ["07:00-11:00"], "Wednesday": ["08:00-12:00"], "Friday": ["10:00-15:00"]}', 'Eldoret', 'Uasin Gishu'),
('Daniel', 'Jones', 'Endocrinologist', 'danieljones@example.com', '6789012345', '$2b$12$exampleHash1234567890abcdef', '{"Tuesday": ["10:00-13:00", "14:00-16:00"], "Thursday": ["08:00-11:00", "13:00-17:00"]}', 'Nairobi', 'Westlands'),
('Jessica', 'Garcia', 'Gastroenterologist', 'jessicagarcia@example.com', '7890123456', '$2b$12$exampleHash1234567890abcdef', '{"Monday": ["09:00-13:00"], "Wednesday": ["10:00-14:00"], "Friday": ["11:00-15:00"]}', 'Nairobi', 'Karen'),
('David', 'Martinez', 'Ophthalmologist', 'davidmartinez@example.com', '8901234567', '$2b$12$exampleHash1234567890abcdef', '{"Tuesday": ["07:00-11:00", "13:00-16:00"], "Thursday": ["10:00-14:00"]}', 'Mombasa', 'Nyali'),
('Sarah', 'Lopez', 'Pulmonologist', 'sarahlopez@example.com', '9012345678', '$2b$12$exampleHash1234567890abcdef', '{"Monday": ["10:00-13:00"], "Wednesday": ["09:00-12:00"], "Friday": ["08:00-12:00"]}', 'Kisumu', 'Kisumu West'),
('James', 'Gonzalez', 'Oncologist', 'jamesgonzalez@example.com', '1230987654', '$2b$12$exampleHash1234567890abcdef', '{"Monday": ["07:00-10:00"], "Tuesday": ["08:00-11:00"], "Thursday": ["10:00-13:00"]}', 'Nakuru', 'Nakuru Town')
ON DUPLICATE KEY UPDATE 
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    specialization = VALUES(specialization),
    phone = VALUES(phone),
    password_hash = VALUES(password_hash),
    schedule = VALUES(schedule),
    city = VALUES(city),
    municipality = VALUES(municipality);

