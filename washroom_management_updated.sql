-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2024 at 02:34 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `washroom_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `assigned_job`
--

CREATE TABLE `assigned_job` (
  `id` int(11) NOT NULL,
  `lab_boy_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `washroom_id` int(11) DEFAULT NULL,
  `status` enum('pending','in_progress','completed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assigned_job`
--

INSERT INTO `assigned_job` (`id`, `lab_boy_id`, `department_id`, `washroom_id`, `status`) VALUES
(1, 1, 1, 1, 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `block` varchar(50) DEFAULT NULL,
  `worker_head_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`id`, `department_name`, `block`, `worker_head_name`) VALUES
(1, 'CS', 'A', 'ashish kumar');

-- --------------------------------------------------------

--
-- Table structure for table `lab_boy`
--

CREATE TABLE `lab_boy` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `number` varchar(20) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lab_boy`
--

INSERT INTO `lab_boy` (`id`, `name`, `number`, `age`, `password`) VALUES
(1, 'tarun', '45475755676', 25, 'tarun@123');

-- --------------------------------------------------------

--
-- Table structure for table `washroom`
--

CREATE TABLE `washroom` (
  `id` int(11) NOT NULL,
  `washroom_name` varchar(100) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `floor_number` int(11) DEFAULT NULL,
  `usage_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `washroom`
--

INSERT INTO `washroom` (`id`, `washroom_name`, `department_id`, `floor_number`, `usage_count`) VALUES
(1, 'wash1', 1, 1, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assigned_job`
--
ALTER TABLE `assigned_job`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lab_boy_id` (`lab_boy_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `washroom_id` (`washroom_id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lab_boy`
--
ALTER TABLE `lab_boy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `washroom`
--
ALTER TABLE `washroom`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assigned_job`
--
ALTER TABLE `assigned_job`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lab_boy`
--
ALTER TABLE `lab_boy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `washroom`
--
ALTER TABLE `washroom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assigned_job`
--
ALTER TABLE `assigned_job`
  ADD CONSTRAINT `assigned_job_ibfk_1` FOREIGN KEY (`lab_boy_id`) REFERENCES `lab_boy` (`id`),
  ADD CONSTRAINT `assigned_job_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`),
  ADD CONSTRAINT `assigned_job_ibfk_3` FOREIGN KEY (`washroom_id`) REFERENCES `washroom` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
