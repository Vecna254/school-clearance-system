-- Core tables
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','hod','admin') NOT NULL,
  department VARCHAR(100) NULL,
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  hod_user_id INT NULL,
  FOREIGN KEY (hod_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  admission_number VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  kcse_year INT NULL,
  class_form VARCHAR(50) NULL,
  stream VARCHAR(50) NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(100) NULL,
  parent_phone VARCHAR(20) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS clearance_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  admission_number VARCHAR(50) NOT NULL,
  reason ENUM('kcse_completion','transfer','withdrawal','other') NOT NULL,
  reason_other VARCHAR(255) NULL,
  status ENUM('in_progress','awaiting_final','rejected','completed') DEFAULT 'in_progress',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  final_approved_by INT NULL,
  final_approved_at TIMESTAMP NULL,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (final_approved_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS department_clearances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clearance_request_id INT NOT NULL,
  department_id INT NOT NULL,
  status ENUM('pending','cleared','rejected') DEFAULT 'pending',
  remarks VARCHAR(255) NULL,
  has_dues TINYINT(1) DEFAULT 0,
  dues_amount DECIMAL(10,2) DEFAULT 0,
  cleared_by_user_id INT NULL,
  cleared_at TIMESTAMP NULL,
  FOREIGN KEY (clearance_request_id) REFERENCES clearance_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (cleared_by_user_id) REFERENCES users(id)
);
