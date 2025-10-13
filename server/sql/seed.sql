-- Minimal seed: departments and an admin user (use your hashed passwords)
INSERT INTO users (username, email, password_hash, role, full_name, phone) VALUES 
('admin', 'admin@kenyahigh.ac.ke', '$2b$10$RNOs8ZXb1L981RZWzhyE5ui7BYWCpDwgddrUPFtGWh3C6aL.yKS8.', 'admin', 'System Administrator', '+254700000000') 
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO departments (name, code) VALUES 
('Class Teacher','CLASS_TEACHER'),
('Academic','ACADEMIC'),
('Library','LIBRARY'),
('Boarding','BOARDING'),
('Accounts','ACCOUNTS'),
('Catering','CATERING'),
('Sanitation','SANITATION'),
('Lab/Store','LAB'),
('Games','GAMES'),
('Guidance & Counseling','COUNSELING'),
('ICT','ICT'),
('Discipline','DISCIPLINE')
ON DUPLICATE KEY UPDATE code = VALUES(code);

-- OPTIONAL: map a HOD user to a department later via admin UI
