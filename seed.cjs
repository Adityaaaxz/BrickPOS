// Seed script for the LEGO landing page database
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "dev.db");
const db = new Database(dbPath);

// Clear existing data
db.exec("DELETE FROM Product");
db.exec("DELETE FROM Subscriber");

const insertProduct = db.prepare(
  "INSERT INTO Product (name, price, category, image, stock, pieces, ageRange, rating, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))"
);

const products = [
  ["Technic Lamborghini Sián", 449.99, "Technic", "technic", 12, 3696, "18+", 4.9],
  ["Star Wars Millennium Falcon", 849.99, "Star Wars", "starwars", 5, 7541, "16+", 5.0],
  ["City Police Station", 99.99, "City", "city", 30, 668, "6+", 4.5],
  ["Creator Expert Roller Coaster", 379.99, "Creator", "creator", 8, 4124, "16+", 4.8],
  ["Harry Potter Hogwarts Castle", 469.99, "Harry Potter", "harrypotter", 10, 6020, "16+", 4.9],
  ["Architecture Taj Mahal", 119.99, "Architecture", "architecture", 20, 2022, "16+", 4.7],
  ["Ninjago Dragon Temple", 89.99, "Ninjago", "ninjago", 25, 1253, "8+", 4.6],
  ["Friends Heartlake City", 159.99, "Friends", "friends", 18, 1513, "8+", 4.4],
];

const insertMany = db.transaction((items) => {
  for (const item of items) {
    insertProduct.run(...item);
  }
});

insertMany(products);

const count = db.prepare("SELECT COUNT(*) as count FROM Product").get();
console.log("✅ Seeded " + count.count + " LEGO products successfully!");

db.close();
