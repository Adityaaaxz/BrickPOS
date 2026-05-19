const db = require("better-sqlite3")(require("path").join(__dirname, "dev.db"));
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tables:", JSON.stringify(tables));
if (tables.length > 0) {
  const prod = tables.find(t => t.name === "Product");
  if (prod) {
    const info = db.prepare("PRAGMA table_info(Product)").all();
    console.log("Product columns:", JSON.stringify(info.map(c => c.name)));
  }
}
db.close();
