let fs = require("fs");

class Employee {
  constructor(username, password, position) {
    this.username = username;
    this.password = password;
    this.position = position;
    this.login = false;
  }

  static findAll(cb) {
    fs.readFile("./employee.json", "utf8", (err, data) => {
      if (err) return cb(err);
      cb(err, JSON.parse(data));
    });
  }

  static saveAll(newData, cb) {
    fs.writeFile("./employee.json", JSON.stringify(newData), (err) => {
      if (err) return cb(err);
      cb(null);
    });
  }

  static register(name, password, role, cb) {
    this.findAll((err, data) => {
      if (err) return cb(err);

      const newEmply = new Employee(name, password, role);
      data.push(newEmply);

      this.saveAll(data, (err) => {
        if (err) return cb(err);

        cb(null, [newEmply, data.length]);
      });
    });
  }
}

module.exports = Employee;
