 
CREATE TABLE Employee (Id INT PRIMARY KEY, Emp_id VARCHAR(10) UNIQUE NOT NULL,Name VARCHAR(100) NOT NULL,
Email VARCHAR(100) UNIQUE,Phone VARCHAR(15),Role VARCHAR(50));

SELECT * FROM Employee;

INSERT INTO Employee (Id, Emp_id, Name, Email, Phone, Role) VALUES
(1, 'E101', 'Shree', 'ravi@gmail.com', '98710', 'Developer'),
(2, 'E102', 'Anita', 'anita@gmail.com', '98711', 'HR'),
(3, 'E103', 'Bhagya', 'bhagya@gmail.com', '98712', 'Manager'),
(4, 'E104', 'Sneha', 'sneha@gmail.com', '98713', 'Tester'),
(5, 'E105', 'Arjun', 'arjun@gmail.com', '98714', 'Developer'),
(6, 'E106', 'Pooja', 'pooja@gmail.com', '98715', 'HR'),
(7, 'E107', 'Rahul', 'rahul@gmail.com', '98716', 'Support'),
(8, 'E108', 'Meena', 'meena@gmail.com', '98717', 'Admin'),
(9, 'E109', 'Vikram', 'vikram@gmail.com', '98718', 'Manager'),
(10,'E110', 'Divya', 'divya@gmail.com', '98719', 'Developer');

---Create Attendance table: - id, employee_id, date, punch_in, punch_out---
CREATE TABLE Attendance (Id INT PRIMARY KEY, Emp_id varchar(10) NOT NULL, Attendance_date DATE NOT NULL, 
Punch_in time, Punch_out time, FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id));

SELECT * FROM Attendance;

INSERT INTO Attendance (Id, Emp_id, Attendance_date, Punch_in, Punch_out) VALUES
(1, 'E101', '2026-04-20', '09:00:00', '18:00:00'),
(2, 'E102', '2026-04-20', '09:15:00', '18:10:00'),
(3, 'E103', '2026-04-20', '08:50:00', '17:45:00'),
(4, 'E104', '2026-04-20', '09:05:00', '18:20:00'),
(5, 'E105', '2026-04-20', '09:10:00', '18:05:00'),
(6, 'E106', '2026-04-20', '09:00:00', '17:50:00'),
(7, 'E107', '2026-04-20', '09:20:00', '18:30:00'),
(8, 'E108', '2026-04-20', '08:55:00', '17:40:00'),
(9, 'E109', '2026-04-20', '09:00:00', '18:00:00'),
(10,'E110', '2026-04-20', '09:05:00', '18:15:00');