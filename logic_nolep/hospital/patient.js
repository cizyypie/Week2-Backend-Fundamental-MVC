let fs = require("fs");

class Patient {
  constructor(id, name, diseases) {
    this.id = id;
    this.name = name;
    this.diseases = diseases;
  }

  static findAll(cb) {
    fs.readFile("./patient.json", "utf8", (err, data) => {
      if (err) {
        cb(err);
      } else {
        cb(err, JSON.parse(data));
      }
    });
  }

  static saveAll(newData, cb) {
    fs.writeFile("./patient.json", JSON.stringify(newData, null, 2), (err) => {
      if (err) return cb(err);
      cb(null);
    });
  }
}

module.exports = Patient;
