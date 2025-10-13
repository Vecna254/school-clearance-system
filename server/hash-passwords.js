import bcrypt from "bcrypt";

const hodPassword = "hod123"; 
const saltRounds = 10;

const departments = [
  "ACADEMIC",
  "BOARDING",
  "CATERING",
  "SANITATION",
  "LAB",
  "GAMES",
  "COUNSELING",
  "MEDICAL",
  "ICT",
  "DISCIPLINE",
];

departments.forEach((dept) => {
  bcrypt.hash(hodPassword, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log(`${dept} -> ${hash}`);
  });
});
