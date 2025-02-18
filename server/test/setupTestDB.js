const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

let db;

beforeAll((done) => {
    db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
            console.error('Greška prilikom kreiranja konekcije sa bazom:', err.message);
        } else {
            console.log('Konekcija sa bazom uspešno uspostavljena.');
        }
        done();
    });
});

beforeEach((done) => {
    const sqlScript = fs.readFileSync(
        path.resolve(__dirname, './healthappoint_test.sql'),
        'utf8'
    );

    db.exec('PRAGMA foreign_keys = ON;', (err) => {
        if (err) {
            console.error('Greška pri omogućavanju FOREIGN KEY pravila:', err.message);
        }
        db.exec(sqlScript, (err) => {
            if (err) {
                console.error('Error setting up in-memory database:', err);
            }
            done();
        });
    });
});

afterEach((done) => {
    db.serialize(() => {
        db.exec("PRAGMA foreign_keys = OFF;", () => {
            db.exec("DELETE FROM users;", () => {
                db.exec("PRAGMA foreign_keys = ON;", done);
            });
        });
    });
});

afterAll((done) => {
    db.close((err) => {
        if (err) {
            console.error('Greška prilikom zatvaranja baze:', err.message);
        } else {
            console.log('Konekcija sa bazom uspešno zatvorena.');
        }
        done();
    });
});

module.exports = db;
