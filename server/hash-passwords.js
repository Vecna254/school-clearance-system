import bcrypt from "bcrypt";

const saltRounds = 10;

// Main admin credentials
const mainAdmin = {
  email: "admin@kenyahigh.ac.ke",
  password: "admin123", // Change this!
  username: "admin",
  full_name: "System Administrator"
};

// HOD credentials
const hodPassword = "hod123";
const departments = [
  "ACADEMIC", "BOARDING", "CATERING", "SANITATION", "LAB", 
  "GAMES", "COUNSELING", "MEDICAL", "ICT", "DISCIPLINE"
];

// Hash main admin
bcrypt.hash(mainAdmin.password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log("=".repeat(50));
  console.log("MAIN ADMIN:");
  console.log(`Email: ${mainAdmin.email}`);
  console.log(`Password: ${mainAdmin.password}`);
  console.log(`Hash: ${hash}`);
  console.log("SQL to insert:");
  console.log(`
    INSERT INTO users (username, email, password_hash, role, full_name, department)
    VALUES (
      '${mainAdmin.username}',
      '${mainAdmin.email}',
      '${hash}',
      'admin',
      '${mainAdmin.full_name}',
      NULL
    );
  `);
  console.log("=".repeat(50));
});

// Hash HODs
departments.forEach((dept) => {
  bcrypt.hash(hodPassword, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log(`${dept} -> ${hash}`);
  });
});