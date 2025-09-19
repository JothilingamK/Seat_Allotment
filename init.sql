-- Database initialization script for Seat Allotment System
-- This script will be executed when the MySQL container starts for the first time

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS seat_allotment;
USE seat_allotment;

-- Create seats table
CREATE TABLE IF NOT EXISTS seats (
    id VARCHAR(10) PRIMARY KEY,
    status ENUM('OCCUPIED', 'VACANT', 'RESERVED') NOT NULL DEFAULT 'VACANT',
    employee_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_employee_id (employee_id)
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employeeid VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    seat_id VARCHAR(10) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_employeeid (employeeid),
    INDEX idx_seat_id (seat_id),
    INDEX idx_department (department)
);

-- Insert sample seats data
INSERT IGNORE INTO seats (id, status) VALUES
('1', 'VACANT'),
('2', 'VACANT'),
('3', 'VACANT'),
('4', 'VACANT'),
('5', 'VACANT'),
('6', 'VACANT'),
('7', 'VACANT'),
('8', 'VACANT'),
('9', 'VACANT'),
('10', 'VACANT'),
('11', 'VACANT'),
('12', 'VACANT'),
('13', 'VACANT'),
('14', 'VACANT'),
('15', 'VACANT'),
('16', 'VACANT'),
('17', 'VACANT'),
('18', 'VACANT'),
('19', 'VACANT'),
('20', 'VACANT'),
('21', 'VACANT'),
('22', 'VACANT'),
('23', 'VACANT'),
('24', 'VACANT'),
('25', 'VACANT'),
('26', 'VACANT'),
('27', 'VACANT'),
('28', 'VACANT'),
('29', 'VACANT'),
('30', 'VACANT'),
('31', 'VACANT'),
('32', 'VACANT'),
('33', 'VACANT'),
('34', 'VACANT'),
('35', 'VACANT'),
('36', 'VACANT'),
('37', 'VACANT'),
('38', 'VACANT'),
('39', 'VACANT'),
('40', 'VACANT'),
('41', 'VACANT'),
('42', 'VACANT'),
('43', 'VACANT'),
('44', 'VACANT'),
('45', 'VACANT'),
('46', 'VACANT'),
('47', 'VACANT'),
('48', 'VACANT'),
('49', 'VACANT'),
('50', 'VACANT'),
('51', 'VACANT'),
('52', 'VACANT'),
('53', 'VACANT'),
('54', 'VACANT'),
('55', 'VACANT'),
('56', 'VACANT'),
('57', 'VACANT'),
('58', 'VACANT'),
('59', 'VACANT'),
('60', 'VACANT'),
('61', 'VACANT'),
('62', 'VACANT'),
('63', 'VACANT'),
('64', 'VACANT'),
('65', 'VACANT'),
('66', 'VACANT'),
('67', 'VACANT'),
('68', 'VACANT'),
('69', 'VACANT'),
('70', 'VACANT'),
('71', 'VACANT'),
('72', 'VACANT'),
('73', 'VACANT'),
('74', 'VACANT'),
('75', 'VACANT'),
('76', 'VACANT'),
('77', 'VACANT'),
('78', 'VACANT'),
('79', 'VACANT'),
('80', 'VACANT'),
('81', 'VACANT'),
('82', 'VACANT'),
('83', 'VACANT'),
('84', 'VACANT'),
('85', 'VACANT'),
('86', 'VACANT'),
('87', 'VACANT'),
('88', 'VACANT'),
('89', 'VACANT'),
('90', 'VACANT'),
('C1', 'VACANT'),
('C2', 'VACANT'),
('C3', 'VACANT'),
('C4', 'VACANT'),
('C5', 'VACANT'),
('C6', 'VACANT'),
('C7', 'VACANT'),
('C8', 'VACANT'),
('C9', 'VACANT'),
('C10', 'VACANT'),
('C11', 'VACANT'),
('C12', 'VACANT'),
('C13', 'VACANT'),
('C14', 'VACANT'),
('C15', 'VACANT'),
('C16', 'VACANT'),
('C17', 'VACANT'),
('C18', 'VACANT'),
('P1', 'VACANT'),
('P2', 'VACANT');

-- Insert sample employees data
INSERT IGNORE INTO employees (employeeid, name, department, role, seat_id) VALUES
('EMP001', 'John Doe', 'IT', 'Developer', '1'),
('EMP002', 'Jane Smith', 'HR', 'Manager', '2'),
('EMP003', 'Bob Johnson', 'Finance', 'Analyst', '3'),
('EMP004', 'Alice Brown', 'Marketing', 'Coordinator', '4'),
('EMP005', 'Charlie Wilson', 'IT', 'Senior Developer', '5');

-- Update seat status for occupied seats
UPDATE seats SET status = 'OCCUPIED', employee_id = 1 WHERE id = '1';
UPDATE seats SET status = 'OCCUPIED', employee_id = 2 WHERE id = '2';
UPDATE seats SET status = 'OCCUPIED', employee_id = 3 WHERE id = '3';
UPDATE seats SET status = 'OCCUPIED', employee_id = 4 WHERE id = '4';
UPDATE seats SET status = 'OCCUPIED', employee_id = 5 WHERE id = '5';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seats_status_employee ON seats(status, employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_role ON employees(department, role);

-- Create a view for seat allocation summary
CREATE OR REPLACE VIEW seat_allocation_summary AS
SELECT 
    s.status,
    COUNT(*) as total_seats,
    COUNT(e.id) as occupied_seats,
    COUNT(*) - COUNT(e.id) as vacant_seats
FROM seats s
LEFT JOIN employees e ON s.id = e.seat_id
GROUP BY s.status;

-- Grant permissions (if needed)
-- GRANT ALL PRIVILEGES ON seat_allotment.* TO 'root'@'%';
-- FLUSH PRIVILEGES;
