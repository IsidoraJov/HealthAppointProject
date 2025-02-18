const db = require('./setupTestDB'); 

test('Provera da li tabela users postoji', (done) => {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
        expect(err).toBeNull();
        expect(row).not.toBeNull();
        done();
    });
});

test('Ubacivanje i čitanje korisnika', (done) => {
    db.run("INSERT INTO users (id, name) VALUES (1, 'Test User')", function(err) {
        expect(err).toBeNull();
        
        db.get("SELECT * FROM users WHERE id = 1", (err, row) => {
            expect(err).toBeNull();
            expect(row).not.toBeNull();
            expect(row.name).toBe('Test User');
            done();
        });
    });
});
