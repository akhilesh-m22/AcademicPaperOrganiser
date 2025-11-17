Create database AcademicPaperOrganiser;
use AcademicPaperOrganiser;

-- Create Users table
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) DEFAULT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    paper_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Authors table
CREATE TABLE Authors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    qualification VARCHAR(100),
    institute VARCHAR(150)
);

-- Create Tags table
CREATE TABLE Tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Create Papers table
CREATE TABLE Papers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    abstract TEXT,
    year INT,
    url VARCHAR(255),
    pdf_key VARCHAR(255),
    added_by INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (added_by) REFERENCES Users(id) ON DELETE SET NULL
);

-- Create Paper_Authors table (many-to-many)
CREATE TABLE Paper_Authors (
    paper_id INT,
    author_id INT,
    PRIMARY KEY (paper_id, author_id),
    FOREIGN KEY (paper_id) REFERENCES Papers(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES Authors(id) ON DELETE CASCADE
);

-- Create Paper References table
CREATE TABLE Paper_References (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cited_title VARCHAR(255),
    paper_id INT,
    FOREIGN KEY (paper_id) REFERENCES Papers(id) ON DELETE CASCADE
);

-- Create Paper_Tags table (many-to-many)
CREATE TABLE Paper_Tags (
    paper_id INT,
    tags_id INT,
    PRIMARY KEY (paper_id, tags_id),
    FOREIGN KEY (paper_id) REFERENCES Papers(id) ON DELETE CASCADE,
    FOREIGN KEY (tags_id) REFERENCES Tags(id) ON DELETE CASCADE
);

-- Insert Users
-- WARNING: Plain text passwords - NOT SECURE (for testing only)
INSERT INTO Users (name, email, password) VALUES
('Alice Johnson', 'alice.johnson@example.com', 'pass123'),
('Bob Smith', 'bob.smith@example.com', 'pass123'),
('Catherine Lee', 'catherine.lee@example.com', 'pass123'),
('David Kumar', 'david.kumar@example.com', 'pass123'),
('Emily Brown', 'emily.brown@example.com', 'pass123');

-- Insert Authors
INSERT INTO Authors (name, qualification, institute) VALUES
('Dr. Rahul Mehta', 'PhD in Computer Science', 'IIT Bombay'),
('Dr. Susan Clark', 'PhD in Physics', 'MIT'),
('Prof. Anil Gupta', 'MSc in Mathematics', 'Delhi University'),
('Dr. Maria Lopez', 'PhD in Data Science', 'Stanford University'),
('Dr. John Miller', 'PhD in AI', 'Oxford University');

-- Insert Tags
INSERT INTO Tags (name) VALUES
('Machine Learning'),
('Quantum Computing'),
('Big Data'),
('Algorithms'),
('Physics');

-- Insert Papers
INSERT INTO Papers (title, abstract, year, url, pdf_key, added_by) VALUES
('Deep Learning for Medical Imaging', 'This paper explores the use of CNNs in detecting tumors.', 2021, 'https://example.com/deep-medical', 'deep_medical.pdf', 1),
('Quantum Algorithms for Optimization', 'Study on quantum algorithms improving optimization.', 2020, 'https://example.com/quantum-opt', 'quantum_opt.pdf', 2),
('Big Data in Climate Change', 'Analyzing the role of big data in climate change predictions.', 2019, 'https://example.com/bigdata-climate', 'bigdata_climate.pdf', 3),
('Graph Algorithms in Social Networks', 'Graph theory applied to detect communities in networks.', 2022, 'https://example.com/graph-social', 'graph_social.pdf', 4),
('Advances in Particle Physics', 'Experimental results from CERN in particle collisions.', 2021, 'https://example.com/particle-physics', 'particle_physics.pdf', 5);

-- Insert Paper_Authors
INSERT INTO Paper_Authors (paper_id, author_id) VALUES
(1, 1),
(1, 4),
(2, 2),
(3, 3),
(3, 4),
(4, 1),
(4, 5),
(5, 2),
(5, 5);

-- Insert Paper References
INSERT INTO Paper_References (cited_title, paper_id) VALUES
('CNN Architectures for Medical Imaging', 1),
('Optimization Problems in Quantum Computing', 2),
('Climate Data Analytics', 3),
('Community Detection in Graphs', 4),
('CERN Higgs Boson Studies', 5);

-- Insert Paper_Tags
INSERT INTO Paper_Tags (paper_id, tags_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(1, 3),
(4, 1);

-- Display all tables
SELECT * FROM Users;
SELECT * FROM Authors;
SELECT * FROM Tags;
SELECT * FROM Papers;
SELECT * FROM Paper_Authors;
SELECT * FROM Paper_References;
SELECT * FROM Paper_Tags;

-- ============================== 
-- TRIGGERS, FUNCTION, PROCEDURES
-- ==============================

-- 1. Create a trigger that automatically updates the updated_at field in Papers whenever a record is modified.

DELIMITER //
CREATE TRIGGER trg_update_paper_timestamp
BEFORE UPDATE ON Papers
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

-- 2. Create a trigger that automatically increments a user's paper_count field in the Users table whenever they add a new paper.

-- Note: paper_count column already added to Users table
DELIMITER //
CREATE TRIGGER trg_increment_paper_count
AFTER INSERT ON Papers
FOR EACH ROW
BEGIN
    UPDATE Users
    SET paper_count = paper_count + 1
    WHERE id = NEW.added_by;
END;
//
DELIMITER ;

-- Insert a test paper
INSERT INTO Papers (title, abstract, year, url, pdf_key, added_by)
VALUES ('AI for Healthcare', 'Exploring neural networks in diagnostics.', 2023,
        'https://example.com/ai-healthcare', 'ai_healthcare.pdf', 1);

-- Check if user's paper count updated
SELECT id, name, paper_count FROM Users;

-- 3. Write a stored procedure to insert a new paper along with its authors and tags.

DELIMITER //
CREATE PROCEDURE AddNewPaper (
    IN p_title VARCHAR(200),
    IN p_abstract TEXT,
    IN p_year INT,
    IN p_url VARCHAR(255),
    IN p_pdfkey VARCHAR(255),
    IN p_added_by INT,
    IN p_author_ids VARCHAR(255), -- comma-separated author IDs
    IN p_tag_ids VARCHAR(255)     -- comma-separated tag IDs
)
BEGIN
    DECLARE new_paper_id INT;

    -- Insert into Papers
    INSERT INTO Papers (title, abstract, year, url, pdf_key, added_by)
    VALUES (p_title, p_abstract, p_year, p_url, p_pdfkey, p_added_by);

    SET new_paper_id = LAST_INSERT_ID();

    -- Insert into Paper_Authors
    WHILE LOCATE(',', p_author_ids) > 0 DO
        INSERT INTO Paper_Authors (paper_id, author_id)
        VALUES (new_paper_id, CAST(SUBSTRING_INDEX(p_author_ids, ',', 1) AS UNSIGNED));
        SET p_author_ids = SUBSTRING(p_author_ids, LOCATE(',', p_author_ids) + 1);
    END WHILE;

    IF LENGTH(p_author_ids) > 0 THEN
        INSERT INTO Paper_Authors (paper_id, author_id)
        VALUES (new_paper_id, CAST(p_author_ids AS UNSIGNED));
    END IF;

    -- Insert into Paper_Tags
    WHILE LOCATE(',', p_tag_ids) > 0 DO
        INSERT INTO Paper_Tags (paper_id, tags_id)
        VALUES (new_paper_id, CAST(SUBSTRING_INDEX(p_tag_ids, ',', 1) AS UNSIGNED));
        SET p_tag_ids = SUBSTRING(p_tag_ids, LOCATE(',', p_tag_ids) + 1);
    END WHILE;

    IF LENGTH(p_tag_ids) > 0 THEN
        INSERT INTO Paper_Tags (paper_id, tags_id)
        VALUES (new_paper_id, CAST(p_tag_ids AS UNSIGNED));
    END IF;

END;
//
DELIMITER ;

-- 4. Write a stored procedure to retrieve all papers added by a specific user.

DELIMITER //
CREATE PROCEDURE GetUserPapers (IN p_user_id INT)
BEGIN
    SELECT p.id, p.title, p.year, p.url, p.pdf_key,
           GROUP_CONCAT(DISTINCT a.name) AS Authors,
           GROUP_CONCAT(DISTINCT t.name) AS Tags
    FROM Papers p
    LEFT JOIN Paper_Authors pa ON p.id = pa.paper_id
    LEFT JOIN Authors a ON pa.author_id = a.id
    LEFT JOIN Paper_Tags pt ON p.id = pt.paper_id
    LEFT JOIN Tags t ON pt.tags_id = t.id
    WHERE p.added_by = p_user_id
    GROUP BY p.id;
END;
//
DELIMITER ;

-- 5. Write a function that counts how many papers a user has added.

DELIMITER //
CREATE FUNCTION CountUserPapers (u_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE paper_count INT;
    SELECT COUNT(*) INTO paper_count
    FROM Papers
    WHERE added_by = u_id;
    RETURN paper_count;
END;
//
DELIMITER ;

SELECT CountUserPapers(2);

-- 6. Write a function that returns the total number of papers under a specific tag.

DELIMITER //
CREATE FUNCTION CountPapersByTag (t_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE tag_count INT;
    SELECT COUNT(*) INTO tag_count
    FROM Paper_Tags
    WHERE tags_id = t_id;
    RETURN tag_count;
END;
//
DELIMITER ;

SELECT CountPapersByTag(1);

-- ============================== 
-- ADDITIONAL CRUD OPERATIONS
-- ==============================

-- 7. Stored Procedure: Update a paper's details
DELIMITER //
CREATE PROCEDURE UpdatePaper (
    IN p_paper_id INT,
    IN p_title VARCHAR(200),
    IN p_abstract TEXT,
    IN p_year INT,
    IN p_url VARCHAR(255),
    IN p_pdfkey VARCHAR(255)
)
BEGIN
    UPDATE Papers 
    SET title = p_title,
        abstract = p_abstract,
        year = p_year,
        url = p_url,
        pdf_key = p_pdfkey
    WHERE id = p_paper_id;
END;
//
DELIMITER ;

-- 8. Stored Procedure: Delete a paper (with cascading deletes for authors, tags, references)
DELIMITER //
CREATE PROCEDURE DeletePaper (IN p_paper_id INT)
BEGIN
    DECLARE v_added_by INT;
    
    -- Get the user who added the paper
    SELECT added_by INTO v_added_by FROM Papers WHERE id = p_paper_id;
    
    -- Delete the paper (cascading will handle Paper_Authors, Paper_Tags, Paper_References)
    DELETE FROM Papers WHERE id = p_paper_id;
    
    -- Decrement the user's paper count
    IF v_added_by IS NOT NULL THEN
        UPDATE Users SET paper_count = paper_count - 1 WHERE id = v_added_by;
    END IF;
END;
//
DELIMITER ;

-- 9. Stored Procedure: Update paper's authors
DELIMITER //
CREATE PROCEDURE UpdatePaperAuthors (
    IN p_paper_id INT,
    IN p_author_ids VARCHAR(255)  -- comma-separated author IDs
)
BEGIN
    -- Delete existing authors for this paper
    DELETE FROM Paper_Authors WHERE paper_id = p_paper_id;
    
    -- Insert new authors
    WHILE LOCATE(',', p_author_ids) > 0 DO
        INSERT INTO Paper_Authors (paper_id, author_id)
        VALUES (p_paper_id, CAST(SUBSTRING_INDEX(p_author_ids, ',', 1) AS UNSIGNED));
        SET p_author_ids = SUBSTRING(p_author_ids, LOCATE(',', p_author_ids) + 1);
    END WHILE;
    
    IF LENGTH(p_author_ids) > 0 THEN
        INSERT INTO Paper_Authors (paper_id, author_id)
        VALUES (p_paper_id, CAST(p_author_ids AS UNSIGNED));
    END IF;
END;
//
DELIMITER ;

-- 10. Stored Procedure: Update paper's tags
DELIMITER //
CREATE PROCEDURE UpdatePaperTags (
    IN p_paper_id INT,
    IN p_tag_ids VARCHAR(255)  -- comma-separated tag IDs
)
BEGIN
    -- Delete existing tags for this paper
    DELETE FROM Paper_Tags WHERE paper_id = p_paper_id;
    
    -- Insert new tags
    WHILE LOCATE(',', p_tag_ids) > 0 DO
        INSERT INTO Paper_Tags (paper_id, tags_id)
        VALUES (p_paper_id, CAST(SUBSTRING_INDEX(p_tag_ids, ',', 1) AS UNSIGNED));
        SET p_tag_ids = SUBSTRING(p_tag_ids, LOCATE(',', p_tag_ids) + 1);
    END WHILE;
    
    IF LENGTH(p_tag_ids) > 0 THEN
        INSERT INTO Paper_Tags (paper_id, tags_id)
        VALUES (p_paper_id, CAST(p_tag_ids AS UNSIGNED));
    END IF;
END;
//
DELIMITER ;

-- 11. Stored Procedure: Search papers by keyword
DELIMITER //
CREATE PROCEDURE SearchPapers (IN p_keyword VARCHAR(255))
BEGIN
    SELECT DISTINCT p.id, p.title, p.abstract, p.year, p.url, p.pdf_key, p.added_by, p.added_at,
           GROUP_CONCAT(DISTINCT a.name) AS authors,
           GROUP_CONCAT(DISTINCT t.name) AS tags
    FROM Papers p
    LEFT JOIN Paper_Authors pa ON p.id = pa.paper_id
    LEFT JOIN Authors a ON pa.author_id = a.id
    LEFT JOIN Paper_Tags pt ON p.id = pt.paper_id
    LEFT JOIN Tags t ON pt.tags_id = t.id
    WHERE p.title LIKE CONCAT('%', p_keyword, '%')
       OR p.abstract LIKE CONCAT('%', p_keyword, '%')
       OR a.name LIKE CONCAT('%', p_keyword, '%')
       OR t.name LIKE CONCAT('%', p_keyword, '%')
       OR CAST(p.year AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', p_keyword, '%')
    GROUP BY p.id
    ORDER BY p.added_at DESC;
END;
//
DELIMITER ;

-- 12. Function: Check if user owns a paper
DELIMITER //
CREATE FUNCTION CheckPaperOwnership (p_paper_id INT, p_user_id INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE is_owner BOOLEAN;
    SELECT EXISTS(SELECT 1 FROM Papers WHERE id = p_paper_id AND added_by = p_user_id) INTO is_owner;
    RETURN is_owner;
END;
//
DELIMITER ;

-- 13. Stored Procedure: Get paper statistics
DELIMITER //
CREATE PROCEDURE GetPaperStatistics()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM Papers) AS total_papers,
        (SELECT COUNT(*) FROM Users) AS total_users,
        (SELECT COUNT(*) FROM Authors) AS total_authors,
        (SELECT COUNT(*) FROM Tags) AS total_tags,
        (SELECT AVG(paper_count) FROM Users) AS avg_papers_per_user;
END;
//
DELIMITER ;

-- 14. Trigger: Decrement paper count when paper is deleted
DELIMITER //
CREATE TRIGGER trg_decrement_paper_count
AFTER DELETE ON Papers
FOR EACH ROW
BEGIN
    IF OLD.added_by IS NOT NULL THEN
        UPDATE Users
        SET paper_count = GREATEST(paper_count - 1, 0)
        WHERE id = OLD.added_by;
    END IF;
END;
//
DELIMITER ;

-- 15. Stored Procedure: Get papers by tag
DELIMITER //
CREATE PROCEDURE GetPapersByTag (IN p_tag_name VARCHAR(50))
BEGIN
    SELECT p.id, p.title, p.year, p.url, p.pdf_key,
           GROUP_CONCAT(DISTINCT a.name) AS authors,
           GROUP_CONCAT(DISTINCT t.name) AS tags
    FROM Papers p
    LEFT JOIN Paper_Authors pa ON p.id = pa.paper_id
    LEFT JOIN Authors a ON pa.author_id = a.id
    LEFT JOIN Paper_Tags pt ON p.id = pt.paper_id
    LEFT JOIN Tags t ON pt.tags_id = t.id
    WHERE p.id IN (
        SELECT pt2.paper_id 
        FROM Paper_Tags pt2 
        JOIN Tags t2 ON pt2.tags_id = t2.id 
        WHERE t2.name = p_tag_name
    )
    GROUP BY p.id;
END;
//
DELIMITER ;

-- 16. Function: Get most recent papers
DELIMITER //
CREATE FUNCTION GetRecentPapersCount (days INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE recent_count INT;
    SELECT COUNT(*) INTO recent_count
    FROM Papers
    WHERE added_at >= DATE_SUB(NOW(), INTERVAL days DAY);
    RETURN recent_count;
END;
//
DELIMITER ;
