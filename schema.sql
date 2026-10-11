CREATE DATABASE HomeRent;
USE HomeRent;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Flat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    number_of_rooms INT NOT NULL,
    number_of_washrooms INT NOT NULL,
    number_of_kitchens INT NOT NULL,
    floor_number INT NOT NULL,
    house_no VARCHAR(50) NOT NULL,
    road_no VARCHAR(50) NOT NULL,
    area_name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    division VARCHAR(100) NOT NULL,
    description TEXT,
    rent_amount DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE UserRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_owner INT NOT NULL,
    user_req INT NOT NULL,
    flat_id INT NOT NULL,
    FOREIGN KEY (user_owner) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_req) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (flat_id) REFERENCES Flat(id) ON DELETE CASCADE
);