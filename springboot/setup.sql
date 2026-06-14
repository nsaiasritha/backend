-- ============================================
-- Resource Booking System - PostgreSQL Setup
-- Run this in pgAdmin or psql
-- ============================================

-- Step 1: Create database (run this separately)
CREATE DATABASE mth;

-- Step 2: Connect to mth database, then run the rest

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role INT,
    status INT
);

-- Roles table
CREATE TABLE roles (
    role BIGINT PRIMARY KEY,
    rolename VARCHAR(100)
);

-- Menus table
CREATE TABLE menus (
    mid BIGINT PRIMARY KEY,
    menu VARCHAR(100),
    icon VARCHAR(100)
);

-- Role mapping table
CREATE TABLE rolesmapping (
    role BIGINT,
    mid BIGINT,
    PRIMARY KEY(role, mid)
);

-- Resources table (for the booking system)
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    category VARCHAR(100),
    description TEXT,
    location VARCHAR(200),
    capacity INT,
    amenities TEXT,
    status INT DEFAULT 1
);

-- Time slots table
CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    resource_id INT REFERENCES resources(id),
    slot_date DATE,
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT TRUE
);

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    resource_id INT REFERENCES resources(id),
    user_id INT REFERENCES users(id),
    slot_id INT REFERENCES time_slots(id),
    booking_date DATE,
    start_time TIME,
    end_time TIME,
    purpose TEXT,
    status INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Insert Roles
-- ============================================
INSERT INTO roles(role, rolename) VALUES
(1, 'User'),
(2, 'Admin');

-- ============================================
-- Insert Menus
-- ============================================
INSERT INTO menus(mid, menu, icon) VALUES
(3, 'Resource Booking', 'booking.png'),
(4, 'User Manager', 'user.png'),
(5, 'Profile', 'profile.png'),
(6, 'Resource Manager', 'resource.png');

-- ============================================
-- Insert Role Mappings
-- ============================================
-- Normal User: Resource Booking + Profile
INSERT INTO rolesmapping(role, mid) VALUES
(1, 3),
(1, 5);

-- Admin: Resource Booking + User Manager + Profile + Resource Manager
INSERT INTO rolesmapping(role, mid) VALUES
(2, 3),
(2, 4),
(2, 5),
(2, 6);

-- ============================================
-- Insert Admin User
-- ============================================
INSERT INTO users(fullname, phone, email, password, role, status)
VALUES ('Admin User', '9999999999', 'admin@gmail.com', 'admin123', 2, 1);

-- ============================================
-- Insert Sample Resources
-- ============================================
INSERT INTO resources(name, category, description, location, capacity, amenities, status) VALUES
('Conference Room A', 'Room', 'Large conference room with projector and whiteboard', 'Building 1, Floor 2', 20, 'Projector, Whiteboard, AC, WiFi', 1),
('Computer Lab 1', 'Lab', 'Computer lab with 30 PCs and GPU systems', 'Building 2, Floor 1', 30, 'GPU Systems, High-Speed Internet, AC', 1),
('Meeting Room B', 'Room', 'Small meeting room with display screen', 'Building 1, Floor 1', 8, 'Display Screen, Whiteboard, AC', 1),
('Photography Studio', 'Studio', 'Professional photography studio with lighting equipment', 'Building 3, Floor 1', 5, 'Lighting Equipment, Green Screen, Camera', 1),
('Seminar Hall', 'Hall', 'Large seminar hall with stage and AV system', 'Main Block', 100, 'Projector, Mic, Stage, AC', 1),
('Research Lab', 'Lab', 'Research lab with specialized equipment', 'Building 2, Floor 2', 15, 'Specialized Equipment, WiFi, AC', 1);

-- ============================================
-- Insert Sample Time Slots
-- ============================================
INSERT INTO time_slots(resource_id, slot_date, start_time, end_time, is_available) VALUES
(1, CURRENT_DATE + 1, '09:00', '11:00', TRUE),
(1, CURRENT_DATE + 1, '11:00', '13:00', TRUE),
(1, CURRENT_DATE + 1, '14:00', '16:00', TRUE),
(2, CURRENT_DATE + 1, '09:00', '12:00', TRUE),
(2, CURRENT_DATE + 1, '13:00', '16:00', TRUE),
(3, CURRENT_DATE + 1, '10:00', '11:00', TRUE),
(3, CURRENT_DATE + 1, '14:00', '15:00', TRUE);
