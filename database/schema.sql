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

CREATE TABLE IF NOT EXISTS social_accounts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(40) NOT NULL,
  provider_user_id VARCHAR(190) NOT NULL,
  provider_username VARCHAR(190) NULL,
  avatar_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY social_provider_user_unique (provider, provider_user_id),
  INDEX social_user_idx (user_id),
  CONSTRAINT social_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profile_social_links (
  user_id INT UNSIGNED NOT NULL PRIMARY KEY,
  github VARCHAR(500) NOT NULL DEFAULT '',
  linkedin VARCHAR(500) NOT NULL DEFAULT '',
  website VARCHAR(500) NOT NULL DEFAULT '',
  x VARCHAR(500) NOT NULL DEFAULT ''
);

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

CREATE TABLE IF NOT EXISTS code_submissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  challenge_slug VARCHAR(120) NOT NULL,
  language VARCHAR(30) NOT NULL DEFAULT 'javascript',
  source_code MEDIUMTEXT NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  tests_passed SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  total_tests SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  runtime_ms INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX submissions_user_challenge_idx (user_id, challenge_slug, created_at),
  CONSTRAINT submissions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

INSERT IGNORE INTO blog_posts (slug,title,excerpt,content,category,author,published,published_at) VALUES
('typescript-architecture-for-reliable-systems','TypeScript architecture for systems that cannot drift','Use domain boundaries, runtime validation, and explicit failure contracts to keep complex TypeScript applications trustworthy.','Large TypeScript systems fail when compile-time confidence is mistaken for runtime safety. Start by separating domain rules from transport, persistence, and framework code. A domain module should be testable without a server, database, or browser.\n\nValidate every external boundary. API payloads, environment variables, queue messages, and database results are runtime data, regardless of how confidently they are typed. Convert unknown input into trusted domain objects once, close to the boundary.\n\nFinally, model failure explicitly. Expected business outcomes should be values your application can handle; unexpected infrastructure failures should preserve context, correlation IDs, and safe retry information.','TypeScript','FlightCoders Engineering',TRUE,NOW()),
('designing-production-nextjs-apis','Designing production-grade APIs in Next.js','A practical blueprint for validation, authentication, idempotency, observability, and database transactions in modern Next.js backends.','A production API route is a boundary, not a collection of queries. Authenticate first, validate a bounded payload, authorize the specific operation, and only then enter the database workflow.\n\nUse transactions when multiple writes represent one business event. Add idempotency to operations clients may safely retry, especially payments, job execution, and external webhooks.\n\nReturn stable error shapes and log structured operational context without leaking credentials or personal data. The result is an API that is easier to integrate, debug, and evolve.','Backend Engineering','FlightCoders Engineering',TRUE,NOW()),
('python-control-loop-simulation','Simulating a control loop in Python before hardware','Build a small, observable simulation to test controller behavior, saturation, disturbances, and unstable tuning before touching real hardware.','Simulation creates a safe place to make control mistakes quickly. Define the plant state, actuator limits, sensor noise, and a deterministic time step before implementing the controller.\n\nPlot the reference, measured output, control effort, and error together. A controller that reaches the target while constantly saturating the actuator is not healthy.\n\nAdd disturbances and parameter variation after the nominal case works. The useful question is not whether one simulation succeeds, but where the design stops being reliable.','Python & Controls','FlightCoders Labs',TRUE,NOW()),
('websocket-telemetry-at-scale','WebSocket telemetry without losing control','How to build bounded, observable real-time data flows with backpressure, reconnect semantics, and meaningful delivery guarantees.','Real-time systems become fragile when every event is treated as equally urgent. Define message classes, acceptable latency, and drop behavior before choosing infrastructure.\n\nClients need explicit reconnect behavior and a way to detect gaps. Servers need bounded buffers, heartbeats, authentication renewal, and protection from consumers that cannot keep up.\n\nObserve queue depth, delivery lag, reconnect frequency, and dropped messages. These signals tell you whether the system is genuinely real-time or merely accumulating hidden delay.','Distributed Systems','FlightCoders Engineering',TRUE,NOW()),
('code-review-for-safety-critical-software','A stronger code-review protocol for safety-critical software','Move reviews beyond style by examining assumptions, timing, failure containment, observability, and evidence.','High-value review begins with intent. The author should state the operational change, affected invariants, expected failure modes, and the evidence used to validate the implementation.\n\nReviewers should trace data across boundaries, challenge timeouts and defaults, and ask what happens under partial failure. Small, explicit changes are easier to reason about than heroic patches.\n\nThe final review artifact should connect code to tests, simulation results, and rollout controls. Approval then represents engineering evidence, not familiarity.','Safety Engineering','FlightCoders Editorial',TRUE,NOW());

INSERT IGNORE INTO jobs (slug,title,team,location,employment_type,summary,description,apply_url,is_open) VALUES
('senior-full-stack-engineer','Senior Full-Stack Engineer','Platform','Remote / India','Full-time','Build the learning, community, and AI systems used by the next generation of flight-software engineers.','Own production features across Next.js, TypeScript, MySQL, and AI integrations. You will shape architecture, performance, testing, and developer experience.\n\nWe value strong product judgment, secure backend fundamentals, and a record of shipping maintainable systems.',NULL,TRUE),
('aviation-curriculum-lead','Aviation Curriculum Lead','Learning','Hybrid / Bengaluru','Full-time','Design rigorous project-based learning paths for avionics, autonomy, and aviation data.','Partner with working engineers to turn real flight-software practices into structured projects, assessments, and mentorship systems.',NULL,TRUE),
('developer-community-intern','Developer Community Intern','Community','Remote','Internship','Help grow a technical community around aviation software, robotics, and safety engineering.','Create technical programs, support live sessions, synthesize member feedback, and help exceptional learner projects reach a global audience.',NULL,TRUE);

INSERT IGNORE INTO projects (slug,name,website_url,tagline,summary,challenge,solution,impact,technologies,accent_color,status,featured,launched_at) VALUES
('tweetqueue','TweetQueue','https://tweetqueue.com','Plan once. Keep your audience in motion.','TweetQueue is a focused publishing workspace for creators and teams who want to write, schedule, organize, and consistently ship social content without living inside a distracting feed.','Consistent publishing is operationally difficult. Drafts become scattered, posting windows are missed, and creators spend too much time switching between planning documents and social platforms.','FlightCoders designed a streamlined queue-first workflow that turns ideas into an ordered publishing system. Users can prepare content in batches, review the upcoming timeline, and keep a reliable cadence from one calm workspace.','The product reduces publishing friction and gives creators a clear operational view of what is ready, what is scheduled, and what needs attention next.','Next.js, TypeScript, Node.js, Scheduling APIs, Analytics','#3159f5','Live',TRUE,'2026-03-01'),
('careerfit','CareerFit','https://carrerfit.com','Turn career signals into a clearer next move.','CareerFit is a career intelligence product that helps professionals understand role alignment, identify skill gaps, and translate their experience into a more focused job-search strategy.','Job seekers often receive generic advice while navigating noisy role descriptions, unclear expectations, and resumes that do not communicate their strongest evidence.','FlightCoders built a structured assessment and recommendation experience that compares a candidate profile with target roles, surfaces meaningful gaps, and converts the analysis into prioritized actions.','CareerFit helps candidates replace guesswork with a repeatable career plan—from positioning and skill development to application readiness.','Next.js, TypeScript, AI Analysis, Structured Profiles, MySQL','#14a96b','Live',TRUE,'2026-05-15');

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
