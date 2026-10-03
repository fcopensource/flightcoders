CREATE TABLE IF NOT EXISTS community_posts (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 kind ENUM('project','question','collaboration') NOT NULL,
 content VARCHAR(2000) NOT NULL,
 project_url VARCHAR(500) NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 INDEX community_created (created_at, id),
 INDEX community_author (user_id, created_at),
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
