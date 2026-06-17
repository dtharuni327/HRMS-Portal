import jwt from "jsonwebtoken";

const token = jwt.sign(
  {
    Emp_id: "E001",
    role: "HR ADMIN"
  },
  "accesssecret",
  {
    expiresIn: "1h"
  }
);

console.log(token);