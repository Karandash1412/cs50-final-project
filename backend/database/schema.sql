CREATE TABLE IF NOT EXISTS analitics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    productive_time INTEGER NOT NULL DEFAULT 0,
    total_time INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tracking_websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    tracking_time INTEGER NOT NULL DEFAULT 24,
    time_spent INTEGER NOT NULL DEFAULT 0,
    date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site_categories (
    domain TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'neutral'
);
INSERT OR IGNORE INTO site_categories (domain, category) VALUES
    ('github.com', 'productive'),
    ('stackoverflow.com', 'productive'),
    ('google.com', 'productive'),
    ('notion.so', 'productive'),
    ('figma.com', 'productive'),
    ('slack.com', 'productive'),
    ('trello.com', 'productive'),
    ('linear.app', 'productive'),
    ('gitlab.com', 'productive'),
    ('w3schools.com', 'productive'),
    ('harvard.edu', 'productive'),
    ('edx.org', 'productive'),
    ('udemy.com', 'productive'),
    ('wikipedia.org', 'productive'),
    ('chatgpt.com', 'productive'),
    ('claude.ai', 'productive'),
    ('zoom.us', 'productive'),
    ('youtube.com', 'unproductive'),
    ('twitter.com', 'unproductive'),
    ('facebook.com', 'unproductive'),
    ('instagram.com', 'unproductive'),
    ('tiktok.com', 'unproductive'),
    ('reddit.com', 'productive'),
    ('pinterest.com', 'unproductive'),
    ('linkedin.com', 'unproductive');