CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email_verified_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP AFTER password_hash;
ALTER TABLE users MODIFY COLUMN email_verified_at DATETIME NULL DEFAULT NULL;

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX verification_user_idx (user_id),
  INDEX verification_expiry_idx (expires_at),
  CONSTRAINT verification_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profiles (
  user_id BIGINT UNSIGNED PRIMARY KEY,
  role VARCHAR(80) NULL,
  experience VARCHAR(80) NULL,
  track VARCHAR(80) NULL,
  goal TEXT NULL,
  CONSTRAINT profiles_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX sessions_user_idx (user_id),
  INDEX sessions_expiry_idx (expires_at),
  CONSTRAINT sessions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  role ENUM('user','assistant') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ai_messages_user_created_idx (user_id, created_at),
  CONSTRAINT ai_messages_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auth_attempts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL,
  ip_address VARCHAR(64) NOT NULL,
  success BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX auth_attempts_lookup_idx (email, ip_address, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS learning_progress (
  user_id BIGINT UNSIGNED PRIMARY KEY,
  completed_modules INT UNSIGNED NOT NULL DEFAULT 4,
  total_modules INT UNSIGNED NOT NULL DEFAULT 12,
  streak_days INT UNSIGNED NOT NULL DEFAULT 7,
  minutes_this_week INT UNSIGNED NOT NULL DEFAULT 186,
  projects_shipped INT UNSIGNED NOT NULL DEFAULT 1,
  last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT learning_progress_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(180) NOT NULL UNIQUE,
  title VARCHAR(220) NOT NULL,
  excerpt VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  category VARCHAR(80) NOT NULL,
  author VARCHAR(100) NOT NULL,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  published_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX blog_published_idx (published, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(180) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  team VARCHAR(100) NOT NULL,
  location VARCHAR(140) NOT NULL,
  employment_type VARCHAR(60) NOT NULL,
  summary VARCHAR(500) NOT NULL,
  description LONGTEXT NOT NULL,
  apply_url VARCHAR(500) NULL,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX jobs_open_idx (is_open, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(180) NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL,
  website_url VARCHAR(500) NOT NULL,
  tagline VARCHAR(300) NOT NULL,
  summary TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  impact TEXT NOT NULL,
  technologies VARCHAR(500) NOT NULL,
  accent_color VARCHAR(20) NOT NULL DEFAULT '#3159f5',
  status VARCHAR(50) NOT NULL DEFAULT 'Live',
  featured BOOLEAN NOT NULL DEFAULT TRUE,
  launched_at DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX projects_featured_idx (featured, launched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO blog_posts (slug,title,excerpt,content,category,author,published,published_at) VALUES
('building-reliable-flight-software','Building reliable flight software: the engineering checklist','A practical guide to deterministic systems, observability, simulation, and safety reviews for aviation software.','Reliable flight software begins with explicit failure modes. Define timing budgets, instrument every boundary, reproduce sensor conditions in simulation, and make each safety assumption reviewable.\n\nThe strongest teams treat testing as a flight system: unit checks establish local correctness, hardware-in-the-loop validates interfaces, and scenario libraries protect against regressions.\n\nFinally, measure operational behavior. Structured telemetry, traceable releases, and reversible deployments turn production incidents into learnable engineering signals.','Flight Engineering','FlightCoders Editorial',TRUE,NOW()),
('python-for-avionics-data','Python patterns for aviation data pipelines','How to validate, normalize, and monitor high-volume telemetry without losing the signal.','Aviation data arrives with gaps, clock drift, duplicated frames, and inconsistent units. Build ingestion around schemas, monotonic event time, and quarantine paths for malformed records.\n\nUse typed boundaries, idempotent transforms, and quality metrics before analytics. The goal is not only fast processing; it is evidence that every output can be traced to its source.','Data Systems','FlightCoders Editorial',TRUE,NOW()),
('career-map-autonomy-engineer','The autonomy engineer career map','The projects and technical skills that demonstrate real readiness for robotics and flight autonomy roles.','Strong autonomy portfolios connect perception, estimation, planning, and control. Recruiters look for clear tradeoffs, measurable performance, and evidence that you tested outside the happy path.\n\nBuild one complete system, document its failure cases, and publish the evaluation harness alongside the result. Depth and engineering judgment outperform a long list of unfinished demos.','Careers','FlightCoders Careers',TRUE,NOW());

INSERT IGNORE INTO jobs (slug,title,team,location,employment_type,summary,description,apply_url,is_open) VALUES
('senior-full-stack-engineer','Senior Full-Stack Engineer','Platform','Remote / India','Full-time','Build the learning, community, and AI systems used by the next generation of flight-software engineers.','Own production features across Next.js, TypeScript, MySQL, and AI integrations. You will shape architecture, performance, testing, and developer experience.\n\nWe value strong product judgment, secure backend fundamentals, and a record of shipping maintainable systems.',NULL,TRUE),
('aviation-curriculum-lead','Aviation Curriculum Lead','Learning','Hybrid / Bengaluru','Full-time','Design rigorous project-based learning paths for avionics, autonomy, and aviation data.','Partner with working engineers to turn real flight-software practices into structured projects, assessments, and mentorship systems.',NULL,TRUE),
('developer-community-intern','Developer Community Intern','Community','Remote','Internship','Help grow a technical community around aviation software, robotics, and safety engineering.','Create technical programs, support live sessions, synthesize member feedback, and help exceptional learner projects reach a global audience.',NULL,TRUE);

INSERT IGNORE INTO projects (slug,name,website_url,tagline,summary,challenge,solution,impact,technologies,accent_color,status,featured,launched_at) VALUES
('tweetqueue','TweetQueue','https://tweetqueue.com','Plan once. Keep your audience in motion.','TweetQueue is a focused publishing workspace for creators and teams who want to write, schedule, organize, and consistently ship social content without living inside a distracting feed.','Consistent publishing is operationally difficult. Drafts become scattered, posting windows are missed, and creators spend too much time switching between planning documents and social platforms.','FlightCoders designed a streamlined queue-first workflow that turns ideas into an ordered publishing system. Users can prepare content in batches, review the upcoming timeline, and keep a reliable cadence from one calm workspace.','The product reduces publishing friction and gives creators a clear operational view of what is ready, what is scheduled, and what needs attention next.','Next.js, TypeScript, Node.js, Scheduling APIs, Analytics','#3159f5','Live',TRUE,'2026-03-01'),
('careerfit','CareerFit','https://careerfit.com','Turn career signals into a clearer next move.','CareerFit is a career intelligence product that helps professionals understand role alignment, identify skill gaps, and translate their experience into a more focused job-search strategy.','Job seekers often receive generic advice while navigating noisy role descriptions, unclear expectations, and resumes that do not communicate their strongest evidence.','FlightCoders built a structured assessment and recommendation experience that compares a candidate profile with target roles, surfaces meaningful gaps, and converts the analysis into prioritized actions.','CareerFit helps candidates replace guesswork with a repeatable career plan—from positioning and skill development to application readiness.','Next.js, TypeScript, AI Analysis, Structured Profiles, MySQL','#14a96b','Live',TRUE,'2026-05-15');
