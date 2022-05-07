/*
 * All the database operations are wrapped in promises to allow
 * consuming code to await result instead of nesting callbacks
 */

const sqlite3 = require("sqlite3");
const fileLocation = "imbentaryo.db";

/*
 * Statement.prototype.run executes a query that returns no value
 * Appropriate for insert, update, and delete operations
 */
exports.runQuery = (sql, params) => {
  return new Promise((resolve, reject) => {
    try {
      const db = new sqlite3.Database(fileLocation);

      db.serialize(() => {
        const stmt = db.prepare(sql);
        stmt.run(params, (err) => {
          if (err) reject(err);

          resolve(true);
        });
        stmt.finalize();
      });

      db.close();
    } catch (error) {
      reject(error);
    }
  });
};

/*
 * Runs a select query that returns multiple rows
 *
 */
exports.runSelectMany = (sql, params) => {
  return new Promise((resolve, reject) => {
    try {
      const db = new sqlite3.Database(fileLocation);

      db.serialize(() => {
        const stmt = db.prepare(sql);
        stmt.all(params, (err, rows) => {
          if (err) reject(err);

          resolve(rows);
        });
        stmt.finalize();
      });

      db.close();
    } catch (error) {
      reject(error);
    }
  });
};

/*
 * Runs a select query that returns first row matching
 * the condition
 */
exports.runSelectOne = (sql, params) => {
  return new Promise((resolve, reject) => {
    try {
      const db = new sqlite3.Database(fileLocation);

      db.serialize(() => {
        const stmt = db.prepare(sql);
        stmt.get(params, (err, row) => {
          if (err) reject(err);

          resolve(row);
        });
        stmt.finalize();
      });

      db.close();
    } catch (error) {
      reject(error);
    }
  });
};
