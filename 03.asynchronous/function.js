const runSql = (db, sql) =>
  new Promise((resolve, reject) => {
    db.run(sql, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

const runSqlToInsert = (db, sql) =>
  new Promise((resolve, reject) => {
    db.run(sql, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this.lastID);
      }
    });
  });

const displayAll = (db, sql) =>
  new Promise((resolve, reject) => {
    db.all(sql, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });

export { runSql, runSqlToInsert, displayAll };
