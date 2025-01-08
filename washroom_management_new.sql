-- Create the database
CREATE DATABASE washroom_management;

-- Use the created database
USE washroom_management;

-- Create the LabBoy table
CREATE TABLE Lab_Boy (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    number VARCHAR(20),
    age INT,
    password VARCHAR(255) NOT NULL
);

-- Create the Department table
CREATE TABLE Department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    block VARCHAR(50),
    worker_head_name VARCHAR(100)
);

-- Create the Washroom table
CREATE TABLE Washroom (
    id INT AUTO_INCREMENT PRIMARY KEY,
    washroom_name VARCHAR(100) NOT NULL,
    department_id INT,
    floor_number INT,
    usage_count INT DEFAULT 0
);

-- Create the AssignedJob table
CREATE TABLE Assigned_Job (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lab_boy_id INT,
    department_id INT,
    washroom_id INT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    FOREIGN KEY (lab_boy_id) REFERENCES Lab_Boy(id),
    FOREIGN KEY (department_id) REFERENCES Department(id),
    FOREIGN KEY (washroom_id) REFERENCES Washroom(id)
);
