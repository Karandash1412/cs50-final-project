CREATE TABLE IF NOT EXISTS analitics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    productive_time INTEGER NOT NULL DEFAULT 0,
    total_time INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tracking_websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analitics_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    tracking_time INTEGER NOT NULL DEFAULT 24, # in hours
    time_spent INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (analitics_id) REFERENCES analitics(id)
);