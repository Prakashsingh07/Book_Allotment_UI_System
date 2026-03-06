CREATE DATABASE BookAllotmentDB;
use BookAllotmentDB

CREATE TABLE Users(
 Id INT IDENTITY PRIMARY KEY,
 Name NVARCHAR(100),
 Email NVARCHAR(150) UNIQUE,
 PasswordHash NVARCHAR(MAX),
 Role NVARCHAR(50) DEFAULT 'User'
);

CREATE TABLE Books(
 Id INT IDENTITY PRIMARY KEY,
 Title NVARCHAR(200),
 Author NVARCHAR(150),
 Quantity INT,
 AvailableQuantity INT
);


CREATE TABLE Allotments(
 Id INT IDENTITY PRIMARY KEY,
 UserId INT NOT NULL,
 BookId INT NOT NULL,
 AllotDate DATETIME DEFAULT GETDATE(),
 ReturnDate DATETIME NULL,
 Status NVARCHAR(50) DEFAULT 'Allotted',

 FOREIGN KEY(UserId) REFERENCES Users(Id),
 FOREIGN KEY(BookId) REFERENCES Books(Id)
);

ALTER TABLE Users
ADD IsActive BIT DEFAULT 1;

select * from Users

CREATE TABLE BookLogs(
 Id INT IDENTITY PRIMARY KEY,
 BookId INT,
 UserId INT,
 Action NVARCHAR(50), -- Allotted / Returned / Deleted
 ActionDate DATETIME DEFAULT GETDATE(),
 PerformedBy NVARCHAR(100) -- Admin Email or System
);

