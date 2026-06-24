-- Password Strength Analyzer - MySQL Schema

DROP TABLE IF EXISTS analysis_history;

CREATE TABLE analysis_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    strength_score INT NOT NULL CHECK (strength_score >= 0 AND strength_score <= 100),
    strength_label VARCHAR(20) NOT NULL,
    length INT NOT NULL,
    has_uppercase BOOLEAN NOT NULL DEFAULT FALSE,
    has_lowercase BOOLEAN NOT NULL DEFAULT FALSE,
    has_numbers BOOLEAN NOT NULL DEFAULT FALSE,
    has_special_chars BOOLEAN NOT NULL DEFAULT FALSE,
    has_min_length BOOLEAN NOT NULL DEFAULT FALSE,
    no_common_patterns BOOLEAN NOT NULL DEFAULT FALSE,
    entropy DECIMAL(10, 2) NOT NULL,
    crack_time_seconds DECIMAL(20, 2),
    crack_time_display VARCHAR(100),
    recommendations JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_created_at (created_at DESC),
    INDEX idx_strength_score (strength_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE analysis_history 
ADD COLUMN password_encrypted VARCHAR(500) DEFAULT NULL 
AFTER password_hash;

-- Note: MySQL 8.0+ supports CHECK constraints. For MySQL 5.7, remove the CHECK.