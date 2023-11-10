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
        resolve(`ID${this.lastID}が追加されました`);
      }
    });
  });

const displayAll = (db, sql) =>
  new Promise((resolve, reject) => {
    db.all(sql, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        rows.forEach((element) => console.log(element));
        resolve();
      }
    });
  });

export { runSql, runSqlToInsert, displayAll };
