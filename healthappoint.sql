-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 14, 2025 at 04:14 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `healthappoint`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `type_id` int(25) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('scheduled','confirmed','completed','cancelled') NOT NULL,
  `reminder_sent` tinyint(1) NOT NULL,
  `confirmation_sent` tinyint(1) NOT NULL,
  `additional_text` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `type_id`, `start_time`, `end_time`, `status`, `reminder_sent`, `confirmation_sent`, `additional_text`) VALUES
(1, 19, 16, 20, '2024-12-30 02:24:56', '2024-12-30 03:06:56', 'completed', 1, 1, 'Patient requested early slot'),
(2, 17, 18, 11, '2024-12-05 08:24:56', '2024-12-05 10:06:56', 'scheduled', 1, 0, ''),
(3, 19, 25, 17, '2025-01-02 01:24:56', '2025-01-02 02:27:56', 'cancelled', 0, 0, 'Follow-up needed'),
(4, 14, 20, 19, '2024-12-25 09:24:56', '2024-12-25 10:58:56', 'scheduled', 0, 0, ''),
(5, 5, 13, 9, '2024-12-06 07:24:56', '2024-12-06 09:09:56', 'confirmed', 0, 0, 'Patient requested early slot'),
(6, 10, 13, 14, '2024-12-16 09:24:56', '2024-12-16 10:56:56', 'completed', 1, 1, 'Follow-up needed'),
(7, 13, 3, 9, '2024-12-25 06:24:56', '2024-12-25 06:51:56', 'scheduled', 0, 1, 'Urgent case'),
(8, 7, 24, 1, '2024-12-30 07:24:56', '2024-12-30 08:10:56', 'completed', 0, 0, 'Routine check'),
(9, 19, 8, 7, '2024-12-06 09:24:56', '2024-12-06 10:49:56', 'scheduled', 0, 1, 'Follow-up needed'),
(10, 18, 27, 3, '2024-12-25 02:24:56', '2024-12-25 03:50:56', 'confirmed', 1, 1, 'Routine check'),
(11, 14, 19, 20, '2024-12-13 01:24:56', '2024-12-13 02:26:56', 'completed', 1, 1, 'Urgent case'),
(12, 12, 24, 18, '2024-12-13 05:24:56', '2024-12-13 06:57:56', 'confirmed', 0, 1, ''),
(13, 20, 16, 14, '2024-12-26 08:24:56', '2024-12-26 10:03:56', 'scheduled', 1, 0, 'Patient requested early slot'),
(14, 12, 23, 16, '2024-12-23 09:24:56', '2024-12-23 10:18:56', 'confirmed', 1, 0, 'Routine check'),
(15, 14, 20, 1, '2024-12-26 04:24:56', '2024-12-26 06:05:56', 'completed', 0, 1, 'Follow-up needed'),
(16, 3, 29, 7, '2024-12-31 09:24:56', '2024-12-31 10:47:56', 'cancelled', 1, 0, ''),
(17, 16, 30, 12, '2024-12-07 05:24:56', '2024-12-07 06:58:56', 'cancelled', 1, 0, 'Follow-up needed'),
(18, 6, 20, 2, '2024-12-30 05:24:56', '2024-12-30 07:02:56', 'confirmed', 1, 1, 'Routine check'),
(19, 7, 16, 6, '2024-12-05 02:24:56', '2024-12-05 02:46:56', 'scheduled', 1, 0, 'Patient requested early slot'),
(20, 1, 28, 17, '2024-12-26 01:24:56', '2024-12-26 02:22:56', 'confirmed', 1, 0, 'Urgent case'),
(21, 1, 14, 10, '2024-12-21 08:24:56', '2024-12-21 09:06:56', 'cancelled', 1, 0, ''),
(22, 9, 16, 15, '2024-12-07 02:24:56', '2024-12-07 03:46:56', 'confirmed', 0, 0, 'Urgent case'),
(23, 7, 10, 1, '2024-12-06 01:24:56', '2024-12-06 03:15:56', 'scheduled', 1, 0, 'Patient requested early slot'),
(24, 7, 28, 18, '2024-12-08 05:24:56', '2024-12-08 07:06:56', 'confirmed', 0, 1, 'Patient requested early slot'),
(25, 15, 22, 11, '2024-12-07 06:24:56', '2024-12-07 07:56:56', 'scheduled', 1, 0, ''),
(26, 17, 15, 5, '2024-12-08 09:24:56', '2024-12-08 11:20:56', 'scheduled', 1, 0, 'Routine check'),
(27, 4, 5, 13, '2025-01-03 07:24:56', '2025-01-03 07:57:56', 'completed', 1, 0, 'Follow-up needed'),
(28, 8, 30, 14, '2024-12-05 05:24:56', '2024-12-05 07:18:56', 'completed', 0, 0, 'Urgent case'),
(29, 11, 15, 4, '2024-12-22 01:24:56', '2024-12-22 01:59:56', 'completed', 0, 1, ''),
(30, 15, 7, 5, '2024-12-05 09:24:56', '2024-12-05 10:38:56', 'scheduled', 1, 0, 'Urgent case'),
(31, 19, 11, 2, '2024-12-15 09:24:56', '2024-12-15 11:09:56', 'completed', 0, 0, 'Routine check'),
(32, 4, 5, 16, '2024-12-19 04:24:56', '2024-12-19 04:56:56', 'cancelled', 0, 1, 'Urgent case'),
(33, 8, 8, 19, '2024-12-13 08:24:56', '2024-12-13 09:40:56', 'cancelled', 0, 1, ''),
(34, 14, 30, 12, '2024-12-15 02:24:56', '2024-12-15 03:51:56', 'cancelled', 1, 0, 'Urgent case'),
(35, 18, 8, 19, '2024-12-06 07:24:56', '2024-12-06 07:53:56', 'confirmed', 1, 1, 'Routine check'),
(36, 17, 21, 16, '2024-12-26 07:24:56', '2024-12-26 08:44:56', 'scheduled', 1, 0, 'Patient requested early slot'),
(37, 1, 15, 18, '2024-12-07 02:24:56', '2024-12-07 03:22:56', 'cancelled', 1, 1, ''),
(38, 16, 20, 17, '2024-12-14 07:24:56', '2024-12-14 08:35:56', 'scheduled', 1, 0, 'Urgent case'),
(39, 1, 12, 16, '2024-12-15 01:24:56', '2024-12-15 01:55:56', 'cancelled', 1, 0, 'Routine check'),
(40, 17, 8, 4, '2024-12-26 04:24:56', '2024-12-26 06:16:56', 'confirmed', 1, 1, 'Routine check'),
(41, 1, 20, 10, '2024-12-14 05:24:56', '2024-12-14 05:58:56', 'scheduled', 0, 1, 'Follow-up needed'),
(42, 1, 27, 17, '2024-12-07 01:24:56', '2024-12-07 02:13:56', 'scheduled', 0, 1, ''),
(43, 7, 3, 7, '2025-01-03 02:24:56', '2025-01-03 03:28:56', 'scheduled', 0, 0, 'Patient requested early slot'),
(44, 9, 9, 19, '2024-12-24 05:24:56', '2024-12-24 05:40:56', 'completed', 0, 0, ''),
(45, 8, 26, 19, '2024-12-05 09:24:56', '2024-12-05 11:01:56', 'confirmed', 0, 1, 'Patient requested early slot'),
(46, 14, 30, 7, '2024-12-08 05:24:56', '2024-12-08 05:55:56', 'confirmed', 0, 0, 'Patient requested early slot'),
(47, 4, 29, 12, '2024-12-13 05:24:56', '2024-12-13 06:08:56', 'cancelled', 0, 0, 'Urgent case'),
(48, 20, 29, 2, '2025-01-03 09:24:56', '2025-01-03 11:04:56', 'cancelled', 0, 0, 'Routine check'),
(49, 17, 6, 3, '2025-01-01 09:24:56', '2025-01-01 10:28:56', 'confirmed', 0, 0, 'Patient requested early slot'),
(50, 17, 5, 10, '2024-12-17 06:24:56', '2024-12-17 07:52:56', 'confirmed', 1, 1, 'Urgent case'),
(51, 1, 2, 5, '2024-12-20 10:00:00', '2024-12-20 11:00:00', 'scheduled', 1, 0, 'Follow-up needed.'),
(52, 7, 4, 1, '2025-01-29 23:00:00', '2025-01-30 00:00:00', 'scheduled', 0, 0, 'Routine Checkup'),
(53, 3, 6, 1, '2025-01-30 23:00:00', '2025-01-31 00:00:00', 'scheduled', 0, 0, ''),
(54, 2, 8, 2, '2025-01-31 12:04:00', '2025-01-31 13:00:00', 'scheduled', 0, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `appointments_type`
--

CREATE TABLE `appointments_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appointments_type`
--

INSERT INTO `appointments_type` (`id`, `name`) VALUES
(1, 'Routine Checkup'),
(2, 'Specialist Consultation'),
(3, 'Driver\'s License Medical Exam'),
(4, 'Pre-Employment Examination'),
(5, 'General Health Checkup'),
(6, 'Dermatology Consultation'),
(7, 'Cardiology Consultation'),
(8, 'Ophthalmology Examination'),
(9, 'Sports Eligibility Check'),
(10, 'Laboratory Test'),
(11, 'Pediatric Examination'),
(12, 'Geriatric Assessment'),
(13, 'Dental Checkup'),
(14, 'Psychiatric Evaluation'),
(15, 'Physical Therapy Assessment'),
(16, 'Vaccination Appointment'),
(17, 'Travel Health Consultation'),
(18, 'Cancer Screening'),
(19, 'Post-Surgical Follow-Up'),
(20, 'Occupational Health Check');

-- --------------------------------------------------------

--
-- Table structure for table `diagnosis`
--

CREATE TABLE `diagnosis` (
  `id` int(11) NOT NULL,
  `code` varchar(15) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `diagnosis`
--

INSERT INTO `diagnosis` (`id`, `code`, `name`) VALUES
(1, 'A00', 'Cholera'),
(2, 'A01', 'Typhoid and paratyphoid fevers'),
(3, 'A02', 'Other salmonella infections'),
(4, 'A03', 'Shigellosis'),
(5, 'A04', 'Other bacterial intestinal infections'),
(6, 'A05', 'Other bacterial foodborne intoxications'),
(7, 'A06', 'Amoebiasis'),
(8, 'A07', 'Other protozoal intestinal diseases'),
(9, 'A08', 'Viral and other specified intestinal infections'),
(10, 'A09', 'Diarrhoea and gastroenteritis of infectious origin'),
(11, 'B00', 'Herpesviral [herpes simplex] infections'),
(12, 'B01', 'Varicella [chickenpox]'),
(13, 'B02', 'Zoster [herpes zoster]'),
(14, 'B03', 'Smallpox'),
(15, 'B04', 'Monkeypox'),
(16, 'B05', 'Measles'),
(17, 'B06', 'Rubella [German measles]'),
(18, 'B07', 'Viral warts'),
(19, 'B08', 'Other viral infections characterized by skin and mucous lesions'),
(20, 'B09', 'Unspecified viral infection characterized by skin and mucous lesions'),
(21, 'C00', 'Malignant neoplasm of lip'),
(22, 'C01', 'Malignant neoplasm of base of tongue'),
(23, 'C02', 'Malignant neoplasm of other and unspecified parts of tongue'),
(24, 'C03', 'Malignant neoplasm of gum'),
(25, 'C04', 'Malignant neoplasm of floor of mouth'),
(26, 'C05', 'Malignant neoplasm of palate'),
(27, 'C06', 'Malignant neoplasm of other and unspecified parts of mouth'),
(28, 'C07', 'Malignant neoplasm of parotid gland'),
(29, 'C08', 'Malignant neoplasm of other and unspecified major salivary glands'),
(30, 'C09', 'Malignant neoplasm of tonsil'),
(31, 'R31', 'Miscellaneous diagnosis 31'),
(32, 'R32', 'Miscellaneous diagnosis 32'),
(33, 'R33', 'Miscellaneous diagnosis 33'),
(34, 'R34', 'Miscellaneous diagnosis 34'),
(35, 'R35', 'Miscellaneous diagnosis 35'),
(36, 'R36', 'Miscellaneous diagnosis 36'),
(37, 'R37', 'Miscellaneous diagnosis 37'),
(38, 'R38', 'Miscellaneous diagnosis 38'),
(39, 'R39', 'Miscellaneous diagnosis 39'),
(40, 'R40', 'Miscellaneous diagnosis 40'),
(41, 'R41', 'Miscellaneous diagnosis 41'),
(42, 'R42', 'Miscellaneous diagnosis 42'),
(43, 'R43', 'Miscellaneous diagnosis 43'),
(44, 'R44', 'Miscellaneous diagnosis 44'),
(45, 'R45', 'Miscellaneous diagnosis 45'),
(46, 'R46', 'Miscellaneous diagnosis 46'),
(47, 'R47', 'Miscellaneous diagnosis 47'),
(48, 'R48', 'Miscellaneous diagnosis 48'),
(49, 'R49', 'Miscellaneous diagnosis 49'),
(50, 'R50', 'Miscellaneous diagnosis 50'),
(51, 'R51', 'Miscellaneous diagnosis 51'),
(52, 'R52', 'Miscellaneous diagnosis 52'),
(53, 'R53', 'Miscellaneous diagnosis 53'),
(54, 'R54', 'Miscellaneous diagnosis 54'),
(55, 'R55', 'Miscellaneous diagnosis 55'),
(56, 'R56', 'Miscellaneous diagnosis 56'),
(57, 'R57', 'Miscellaneous diagnosis 57'),
(58, 'R58', 'Miscellaneous diagnosis 58'),
(59, 'R59', 'Miscellaneous diagnosis 59'),
(60, 'R60', 'Miscellaneous diagnosis 60'),
(61, 'R61', 'Miscellaneous diagnosis 61'),
(62, 'R62', 'Miscellaneous diagnosis 62'),
(63, 'R63', 'Miscellaneous diagnosis 63'),
(64, 'R64', 'Miscellaneous diagnosis 64'),
(65, 'R65', 'Miscellaneous diagnosis 65'),
(66, 'R66', 'Miscellaneous diagnosis 66'),
(67, 'R67', 'Miscellaneous diagnosis 67'),
(68, 'R68', 'Miscellaneous diagnosis 68'),
(69, 'R69', 'Miscellaneous diagnosis 69'),
(70, 'R70', 'Miscellaneous diagnosis 70'),
(71, 'R71', 'Miscellaneous diagnosis 71'),
(72, 'R72', 'Miscellaneous diagnosis 72'),
(73, 'R73', 'Miscellaneous diagnosis 73'),
(74, 'R74', 'Miscellaneous diagnosis 74'),
(75, 'R75', 'Miscellaneous diagnosis 75'),
(76, 'R76', 'Miscellaneous diagnosis 76'),
(77, 'R77', 'Miscellaneous diagnosis 77'),
(78, 'R78', 'Miscellaneous diagnosis 78'),
(79, 'R79', 'Miscellaneous diagnosis 79'),
(80, 'R80', 'Miscellaneous diagnosis 80'),
(81, 'R81', 'Miscellaneous diagnosis 81'),
(82, 'R82', 'Miscellaneous diagnosis 82'),
(83, 'R83', 'Miscellaneous diagnosis 83'),
(84, 'R84', 'Miscellaneous diagnosis 84'),
(85, 'R85', 'Miscellaneous diagnosis 85'),
(86, 'R86', 'Miscellaneous diagnosis 86'),
(87, 'R87', 'Miscellaneous diagnosis 87'),
(88, 'R88', 'Miscellaneous diagnosis 88'),
(89, 'R89', 'Miscellaneous diagnosis 89'),
(90, 'R90', 'Miscellaneous diagnosis 90'),
(91, 'R91', 'Miscellaneous diagnosis 91'),
(92, 'R92', 'Miscellaneous diagnosis 92'),
(93, 'R93', 'Miscellaneous diagnosis 93'),
(94, 'R94', 'Miscellaneous diagnosis 94'),
(95, 'R95', 'Miscellaneous diagnosis 95'),
(96, 'R96', 'Miscellaneous diagnosis 96'),
(97, 'R97', 'Miscellaneous diagnosis 97'),
(98, 'R98', 'Miscellaneous diagnosis 98'),
(99, 'R99', 'Miscellaneous diagnosis 99'),
(100, 'R100', 'Miscellaneous diagnosis 100'),
(101, 'R101', 'Miscellaneous diagnosis 101'),
(102, 'R102', 'Miscellaneous diagnosis 102'),
(103, 'R103', 'Miscellaneous diagnosis 103'),
(104, 'R104', 'Miscellaneous diagnosis 104'),
(105, 'R105', 'Miscellaneous diagnosis 105'),
(106, 'R106', 'Miscellaneous diagnosis 106'),
(107, 'R107', 'Miscellaneous diagnosis 107'),
(108, 'R108', 'Miscellaneous diagnosis 108'),
(109, 'R109', 'Miscellaneous diagnosis 109'),
(110, 'R110', 'Miscellaneous diagnosis 110'),
(111, 'R111', 'Miscellaneous diagnosis 111'),
(112, 'R112', 'Miscellaneous diagnosis 112'),
(113, 'R113', 'Miscellaneous diagnosis 113'),
(114, 'R114', 'Miscellaneous diagnosis 114'),
(115, 'R115', 'Miscellaneous diagnosis 115'),
(116, 'R116', 'Miscellaneous diagnosis 116'),
(117, 'R117', 'Miscellaneous diagnosis 117'),
(118, 'R118', 'Miscellaneous diagnosis 118'),
(119, 'R119', 'Miscellaneous diagnosis 119'),
(120, 'R120', 'Miscellaneous diagnosis 120'),
(121, 'R121', 'Miscellaneous diagnosis 121'),
(122, 'R122', 'Miscellaneous diagnosis 122'),
(123, 'R123', 'Miscellaneous diagnosis 123'),
(124, 'R124', 'Miscellaneous diagnosis 124'),
(125, 'R125', 'Miscellaneous diagnosis 125'),
(126, 'R126', 'Miscellaneous diagnosis 126'),
(127, 'R127', 'Miscellaneous diagnosis 127'),
(128, 'R128', 'Miscellaneous diagnosis 128'),
(129, 'R129', 'Miscellaneous diagnosis 129'),
(130, 'R130', 'Miscellaneous diagnosis 130'),
(131, 'R131', 'Miscellaneous diagnosis 131'),
(132, 'R132', 'Miscellaneous diagnosis 132'),
(133, 'R133', 'Miscellaneous diagnosis 133'),
(134, 'R134', 'Miscellaneous diagnosis 134'),
(135, 'R135', 'Miscellaneous diagnosis 135'),
(136, 'R136', 'Miscellaneous diagnosis 136'),
(137, 'R137', 'Miscellaneous diagnosis 137'),
(138, 'R138', 'Miscellaneous diagnosis 138'),
(139, 'R139', 'Miscellaneous diagnosis 139'),
(140, 'R140', 'Miscellaneous diagnosis 140'),
(141, 'R141', 'Miscellaneous diagnosis 141'),
(142, 'R142', 'Miscellaneous diagnosis 142'),
(143, 'R143', 'Miscellaneous diagnosis 143'),
(144, 'R144', 'Miscellaneous diagnosis 144'),
(145, 'R145', 'Miscellaneous diagnosis 145'),
(146, 'R146', 'Miscellaneous diagnosis 146'),
(147, 'R147', 'Miscellaneous diagnosis 147'),
(148, 'R148', 'Miscellaneous diagnosis 148'),
(149, 'R149', 'Miscellaneous diagnosis 149'),
(150, 'R150', 'Miscellaneous diagnosis 150'),
(151, 'I10', 'Primary Hypertension'),
(152, 'E11.9', 'Type 2 Diabetes Mellitus'),
(153, 'E78.5', 'Dyslipidemia ');

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `id` int(11) NOT NULL,
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(25) NOT NULL,
  `username` varchar(25) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(25) NOT NULL,
  `specialization` varchar(50) NOT NULL,
  `subspecialization` varchar(30) NOT NULL,
  `working_houres` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`id`, `first_name`, `last_name`, `username`, `password`, `email`, `specialization`, `subspecialization`, `working_houres`) VALUES
(3, 'John', 'Smith', 'user1', 'pass1!', 'doctor1@hospital.com', 'Pediatrics', 'Neonatology', NULL),
(4, 'Jane', 'Johnson', 'user2', 'pass2!', 'doctor2@hospital.com', 'Pediatrics', 'Pediatric Cardiology', NULL),
(5, 'Alice', 'Brown', 'user3', 'pass3!', 'doctor3@hospital.com', 'Pediatrics', 'Pediatric Cardiology', NULL),
(6, 'Bob', 'Williams', 'user4', 'pass4!', 'doctor4@hospital.com', 'Orthopedics', 'Joint Replacement', NULL),
(7, 'Charlie', 'Jones', 'user5', 'pass5!', 'doctor5@hospital.com', 'Dermatology', 'Dermatopathology', NULL),
(8, 'Diana', 'Garcia', 'user6', 'pass6!', 'doctor6@hospital.com', 'Radiology', 'Pediatric Radiology', NULL),
(9, 'Eve', 'Miller', 'user7', 'pass7!', 'doctor7@hospital.com', 'Pathology', 'Molecular Pathology', NULL),
(10, 'Frank', 'Davis', 'user8', 'pass8!', 'doctor8@hospital.com', 'Anesthesiology', 'Critical Care Medicine', NULL),
(11, 'Grace', 'Martinez', 'user9', 'pass9!', 'doctor9@hospital.com', 'Pathology', 'Molecular Pathology', NULL),
(12, 'Hank', 'Hernandez', 'user10', 'pass10!', 'doctor10@hospital.com', 'Oncology', 'Medical Oncology', NULL),
(13, 'Ivy', 'Lopez', 'user11', 'pass11!', 'doctor11@hospital.com', 'Pathology', 'Molecular Pathology', NULL),
(14, 'Jack', 'Clark', 'user12', 'pass12!', 'doctor12@hospital.com', 'Oncology', 'Medical Oncology', NULL),
(15, 'Karen', 'Lewis', 'user13', '$2b$10$vjgYm70ug6eQ5KlItnrHjegehzt.0Qwse6Nzjk/1J9xZ740k2H6yO', 'doctor13@hospital.com', 'Pathology', 'Clinical Pathology', NULL),
(16, 'Liam', 'Robinson', 'user14', 'pass14!', 'doctor14@hospital.com', 'Psychiatry', 'Forensic Psychiatry', NULL),
(17, 'Mona', 'Walker', 'user15', 'pass15!', 'doctor15@hospital.com', 'Anesthesiology', 'Pain Management', NULL),
(18, 'Nina', 'Young', 'user16', 'pass16!', 'doctor16@hospital.com', 'Pediatrics', 'Neonatology', NULL),
(19, 'Oscar', 'Allen', 'user17', 'pass17!', 'doctor17@hospital.com', 'Cardiology', 'Electrophysiology', NULL),
(20, 'Paul', 'King', 'user18', 'pass18!', 'doctor18@hospital.com', 'Pathology', 'Molecular Pathology', NULL),
(21, 'Quinn', 'Wright', 'user19', 'pass19!', 'doctor19@hospital.com', 'Anesthesiology', 'Obstetric Anesthesia', NULL),
(22, 'Rita', 'Scott', 'user20', 'pass20!', 'doctor20@hospital.com', 'Psychiatry', 'Geriatric Psychiatry', NULL),
(23, 'Sam', 'Evans', 'user21', 'pass21!', 'doctor21@hospital.com', 'Cardiology', 'Electrophysiology', NULL),
(24, 'Tina', 'Baker', 'user22', 'pass22!', 'doctor22@hospital.com', 'Anesthesiology', 'Pain Management', NULL),
(25, 'Uma', 'Phillips', 'user23', 'pass23!', 'doctor23@hospital.com', 'Radiology', 'Neuroradiology', NULL),
(26, 'Victor', 'Carter', 'user24', 'pass24!', 'doctor24@hospital.com', 'Pediatrics', 'Neonatology', NULL),
(27, 'Wendy', 'Turner', 'user25', 'pass25!', 'doctor25@hospital.com', 'Dermatology', 'Dermatopathology', NULL),
(28, 'Xander', 'Collins', 'user26', 'pass26!', 'doctor26@hospital.com', 'Radiology', 'Neuroradiology', NULL),
(29, 'Yara', 'Parker', 'user27', 'pass27!', 'doctor27@hospital.com', 'Anesthesiology', 'Pain Management', NULL),
(30, 'Zane', 'Cook', 'user28', 'pass28!', 'doctor28@hospital.com', 'Dermatology', 'Dermatopathology', NULL),
(31, 'Alex', 'Ward', 'user29', 'pass29!', 'doctor29@hospital.com', 'Radiology', 'Pediatric Radiology', NULL),
(32, 'Bella', 'Gray', 'user30', 'pass30!', 'doctor30@hospital.com', 'Dermatology', 'Cosmetic Dermatology', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `doctor_availability`
--

CREATE TABLE `doctor_availability` (
  `id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `available_dates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`available_dates`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(25) NOT NULL,
  `username` varchar(25) NOT NULL,
  `birthday` date NOT NULL,
  `jmbg` varchar(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `address` varchar(255) NOT NULL,
  `gender` enum('male','female','other','') NOT NULL,
  `marital_status` varchar(25) NOT NULL,
  `emergency_contact` varchar(255) NOT NULL,
  `language` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `first_name`, `last_name`, `username`, `birthday`, `jmbg`, `phone`, `email`, `address`, `gender`, `marital_status`, `emergency_contact`, `language`) VALUES
(1, 'John', 'Doe', '12345', '0000-00-00', '12345678901', '123-456-7890', 'john.doe@example.com', '123 Main St', 'male', 'single', 'Jane Doe: 123-987-6543', 'English'),
(2, 'Jane', 'Smith', '67890', '0000-00-00', '98765432101', '987-654-3210', 'jane.smith@example.com', '456 Oak Rd', 'female', 'married', 'John Smith: 789-456-1230', 'English'),
(3, 'Alice', 'Johnson', '11223', '0000-00-00', '19283746501', '555-123-4567', 'alice.j@example.com', '789 Pine Ave', 'female', 'single', 'Bob Johnson: 555-789-1234', 'French'),
(4, 'Bob', 'Brown', '44556', '0000-00-00', '56473829101', '444-555-6666', 'bob.brown@example.com', '321 Elm St', 'male', 'single', 'Alice Brown: 333-444-5555', 'Spanish'),
(5, 'Emma', 'Taylor', '77889', '0000-00-00', '10293847560', '222-333-4444', 'emma.taylor@example.com', '654 Maple Dr', 'female', 'married', 'Sam Taylor: 666-777-8888', 'German'),
(6, 'Liam', 'Wilson', '99887', '0000-00-00', '31415926535', '111-222-3333', 'liam.wilson@example.com', '987 Spruce Blvd', 'male', 'single', 'Emily Wilson: 999-888-7777', 'Italian'),
(7, 'Sophia', 'Davis', '56473', '0000-00-00', '11223344556', '666-777-8888', 'sophia.d@example.com', '159 Cedar Cir', 'female', 'married', 'Mike Davis: 222-111-3333', 'Portuguese'),
(8, 'James', 'Miller', '83726', '0000-00-00', '22334455667', '333-444-5555', 'james.m@example.com', '753 Birch Ct', 'male', 'single', 'Sarah Miller: 888-777-6666', 'Russian'),
(9, 'Olivia', 'Garcia', '19283', '0000-00-00', '33445566778', '444-555-6666', 'olivia.g@example.com', '456 Willow Way', 'female', 'married', 'Liam Garcia: 555-444-3333', 'Chinese'),
(10, 'Noah', 'Martinez', '48572', '0000-00-00', '44556677889', '555-666-7777', 'noah.m@example.com', '951 Redwood Ln', 'male', 'single', 'Emma Martinez: 666-555-4444', 'Japanese'),
(11, 'Ava', 'Hernandez', '72615', '0000-00-00', '55667788990', '777-888-9999', 'ava.h@example.com', '357 Ashwood Pl', 'female', 'married', 'Mia Hernandez: 999-888-7777', 'Arabic'),
(12, 'Ethan', 'Lopez', '91827', '0000-00-00', '66778899001', '888-999-1111', 'ethan.l@example.com', '135 Walnut Ave', 'male', 'single', 'Lucas Lopez: 111-999-8888', 'Turkish'),
(13, 'Isabella', 'Gonzalez', '36482', '0000-00-00', '77889900112', '999-111-2222', 'isabella.g@example.com', '864 Cypress Rd', 'female', 'married', 'Sophia Gonzalez: 222-333-4444', 'Korean'),
(14, 'Michael', 'Clark', '53719', '0000-00-00', '88990011223', '222-444-6666', 'michael.c@example.com', '753 Birch Ln', 'male', 'single', 'Olivia Clark: 444-666-8888', 'Hindi'),
(15, 'Mia', 'Walker', '68592', '0000-00-00', '99001122334', '444-888-2222', 'mia.w@example.com', '159 Oak Cir', 'female', 'married', 'Ethan Walker: 888-222-4444', 'Bengali'),
(16, 'Alexander', 'Young', '75918', '0000-00-00', '10111213141', '666-999-3333', 'alex.y@example.com', '951 Redwood Blvd', 'male', 'single', 'Ava Young: 999-333-6666', 'Swahili'),
(17, 'Amelia', 'King', '84732', '0000-00-00', '12131415161', '333-777-9999', 'amelia.k@example.com', '456 Pine Dr', 'female', 'married', 'Noah King: 777-333-9999', 'Polish'),
(18, 'Elijah', 'Wright', '93871', '0000-00-00', '13141516171', '222-555-8888', 'elijah.w@example.com', '753 Birch Blvd', 'male', 'single', 'Isabella Wright: 555-888-2222', 'Dutch'),
(19, 'Charlotte', 'Hill', '19283', '0000-00-00', '14151617181', '111-666-4444', 'charlotte.h@example.com', '159 Elm Cir', 'female', 'married', 'Michael Hill: 666-444-1111', 'Vietnamese'),
(20, 'Benjamin', 'Scott', '48572', '0000-00-00', '15161718191', '888-111-5555', 'benjamin.s@example.com', '951 Maple Way', 'male', 'single', 'Mia Scott: 111-555-8888', 'Thai'),
(22, 'John', 'Doe', '0', '1990-01-01', '12345678901', '123-456-7890', 'john.doe@example.com', '123 Main St, City', 'male', 'single', 'Jane Doe, 987-654-3210', 'English'),
(23, 'Isidora', 'Jovanović', 'isidora.jovanović.1333', '1997-08-16', '16089977375', '066203633', 'isidorajov97@gmail.com', 'Milana Tankosica 17/12', 'female', 'Single', 'Mara - 06588992', 'English'),
(24, 'Pera', 'Mikic', 'pera.mikic.7902', '1999-06-10', '10069997375', '066203633', 'pera@gmail.com', 'Milana Tankosica 17/12', 'male', 'Divorced', 'Mara - 06588992', 'English'),
(25, 'Mira', 'Lalic', 'mira.lalic.1847', '1991-01-07', '01089917375', '066223311', 'mira@gmail.com', 'Tome Rosandić 5', 'female', 'Single', 'Perica - 02235668', 'English');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `diagnosis_code` varchar(10) NOT NULL,
  `terapija` varchar(100) NOT NULL,
  `preporuka` varchar(100) NOT NULL,
  `medical_history` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `additional_text` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `appointment_id`, `diagnosis_code`, `terapija`, `preporuka`, `medical_history`, `created_at`, `updated_at`, `additional_text`) VALUES
(1, 5, 'J45', 'Inhaler therapy', 'Avoid allergens', 'Asthma since childhood', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Follow-up in 2 weeks'),
(2, 2, 'E11', 'Metformin', 'Diet control', 'Type 2 diabetes, onset 5 years ago', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Discuss blood sugar levels'),
(3, 3, 'I10', 'Antihypertensive medication', 'Regular exercise', 'Hypertension diagnosed in 2018', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Monitor blood pressure'),
(4, 4, 'J06', 'Analgesics', 'Rest and hydration', 'Frequent colds in winter', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Schedule annual flu vaccine'),
(5, 6, 'M54', 'Physical therapy', 'Ergonomic assessment', 'Lower back pain after injury', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Refer to orthopedist'),
(6, 10, 'K21', 'Proton pump inhibitors', 'Small frequent meals', 'Reflux symptoms for 2 years', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Adjust diet'),
(7, 7, 'F41', 'Cognitive therapy', 'Stress management techniques', 'History of anxiety', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Regular counseling sessions'),
(8, 8, 'L20', 'Topical corticosteroids', 'Use hypoallergenic products', 'Eczema flare-ups since teenage years', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Avoid skin irritants'),
(9, 9, 'H52', 'Prescription glasses', 'Limit screen time', 'Vision changes noted this year', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Yearly vision check'),
(10, 1, 'N18', 'Dialysis', 'Low sodium diet', 'Chronic kidney disease stage 3', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Discuss transplant options'),
(11, 11, 'C34', 'Chemotherapy', 'Maintain nutrition', 'Lung cancer diagnosed last month', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Support group referral'),
(12, 12, 'B20', 'Antiretroviral therapy', 'Safe practices education', 'HIV positive since 2020', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Quarterly check-up'),
(13, 14, 'E78', 'Statins', 'Diet low in saturated fat', 'High cholesterol levels since 2015', '2024-12-18 04:58:53', '0000-00-00 00:00:00', 'Recheck lipid panel in 6 months'),
(14, 13, 'G40', 'Antiepileptic drugs', 'Avoid sleep deprivation', 'Epilepsy diagnosed at age 12', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Seizure diary review'),
(15, 15, 'Z30', 'Oral contraceptives', 'Annual gynecological exam', 'Birth control management', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Discuss long-term plans'),
(16, 16, 'R73', 'Blood glucose monitoring', 'Daily exercise routine', 'Pre-diabetes diagnosed last year', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Dietitian referral'),
(17, 17, 'M25', 'Joint injections', 'Low-impact exercise', 'Arthritis symptoms worsening', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Consider physical therapy'),
(18, 18, 'T78', 'Emergency epinephrine', 'Avoid known allergens', 'Severe peanut allergy', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Allergy testing follow-up'),
(19, 19, 'Z23', 'Vaccination', 'Annual check-up', 'Routine health maintenance', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Update immunization records'),
(20, 20, 'J20', 'Bronchodilators', 'Hydration and rest', 'Acute bronchitis symptoms', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Follow-up in 1 week');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(100) NOT NULL,
  `first_name` varchar(25) DEFAULT NULL,
  `last_name` varchar(25) DEFAULT NULL,
  `username` varchar(25) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(25) DEFAULT NULL,
  `role` enum('staff','admin','','') DEFAULT NULL,
  `working_houres` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`working_houres`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `username`, `password`, `email`, `role`, `working_houres`) VALUES
(1, 'John', 'Doe', 'johnd', '$2b$10$qsyfZn1ip3U6sp8EtvxytuXEMQoiDSZ/ELyVDhe5iu3luKTpXvrc6', 'john.doe@example.com', 'staff', NULL),
(2, 'Jane', 'Smith', 'janes', 'secure456', 'jane.smith@example.com', 'admin', NULL),
(3, 'Alice', 'Johnson', 'alicej', 'abc789', 'alice.johnson@example.com', 'staff', NULL),
(4, 'Bob', 'Brown', 'bobb', 'myp@ss', 'bob.brown@example.com', 'staff', NULL),
(5, 'Charlie', 'Williams', 'charliew', '12345x', 'charlie.williams@example.', 'admin', NULL),
(6, 'Diana', 'Jones', 'dianaj', 'secure!78', 'diana.jones@example.com', 'staff', NULL),
(7, 'Eve', 'Garcia', 'eve_g', 'ev3pass', 'eve.garcia@example.com', 'staff', NULL),
(8, 'Frank', 'Miller', 'frankm', 'frank#9', 'frank.miller@example.com', 'admin', NULL),
(9, 'Grace', 'Davis', 'graced', 'gracey99', 'grace.davis@example.com', 'staff', NULL),
(10, 'Hank', 'Martinez', 'hankm', 'h@nk123', 'hank.martinez@example.com', 'staff', NULL),
(11, 'Ivy', 'Hernandez', 'ivyh', 'ivy4321', 'ivy.hernandez@example.com', 'admin', NULL),
(12, 'Jack', 'Lopez', 'jackl', 'j4ckpass', 'jack.lopez@example.com', 'staff', NULL),
(13, 'Karen', 'Clark', 'karen_c', 'karen456', 'karen.clark@example.com', 'staff', NULL),
(14, 'Liam', 'Lewis', 'liaml', 'l1am123', 'liam.lewis@example.com', 'admin', NULL),
(15, 'Mona', 'Robinson', 'monar', 'm0nar#', 'mona.robinson@example.com', 'staff', NULL),
(16, 'Nina', 'Walker', 'ninaw', 'nina99', 'nina.walker@example.com', 'staff', NULL),
(17, 'Oscar', 'Young', 'oscary', 'osc4r@', 'oscar.young@example.com', 'admin', NULL),
(18, 'Paul', 'Allen', 'paul_a', 'paul#7', 'paul.allen@example.com', 'staff', NULL),
(19, 'Quinn', 'King', 'quinnk', 'qu1nn22', 'quinn.king@example.com', 'staff', NULL),
(20, 'Rita', 'Wright', 'ritaw', 'rita123', 'rita.wright@example.com', 'admin', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments_type`
--
ALTER TABLE `appointments_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `diagnosis`
--
ALTER TABLE `diagnosis`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctor_availability`
--
ALTER TABLE `doctor_availability`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `appointments_type`
--
ALTER TABLE `appointments_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `diagnosis`
--
ALTER TABLE `diagnosis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT for table `doctor`
--
ALTER TABLE `doctor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `doctor_availability`
--
ALTER TABLE `doctor_availability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
