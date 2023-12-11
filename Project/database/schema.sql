DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS list;

CREATE TABLE list (
    name TEXT,
    owner TEXT,
    url TEXT NOT NULL PRIMARY KEY,
    deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE item (
    name TEXT NOT NULL,
    list_url TEXT NOT NULL,
    current INTEGER NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (list_url) REFERENCES list (url),
    PRIMARY KEY (name, list_url)
);