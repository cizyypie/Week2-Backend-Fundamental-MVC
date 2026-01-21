let Patient = require("./patient");
let Employee = require("./employee");
let HospitalView = require("./view");

class HospitalController {
  static register(name, password, role) {
    Employee.register(name, password, role, (err, objArr) => {
      if (err) {
        HospitalView.ErrorView(err);
      } else {
        HospitalView.registerView(objArr);
      }
    });
  }

  static login(username, password) {
    Employee.findAll((err, employees) => {
      if (err) {
        HospitalView.ErrorView(err);
        return;
      }

      const loginEmp = employees.find((usr) => usr.login === true);
      if (loginEmp) {
        HospitalView.ErrorView("There is a user already login");
        return;
      }

      const employee = employees.find(
        (usr) => usr.username === username && usr.password === password,
      );
      if (!employee) {
        HospitalView.ErrorView("Invalid Username or Password");
        return;
      }
      employee.login = true;
      Employee.saveAll(employees, (err) => {
        if (err) {
          HospitalView.ErrorView(err);
        } else {
          HospitalView.loginView(employee);
        }
      });
    });
  }

  static addPatient(argument) {}

  static updatePatient(argument) {}

  static deletePatient(argument) {}

  static logout() {
    Employee.findAll((err, employees) => {
      if (err) {
        HospitalView.ErrorView(err);
        return;
      }

      const employee = employees.find((usr) => usr.login === true);
      if (!employee) {
        HospitalView.ErrorView("No user is currently logged in");
        return;
      }
      employee.login = false;
   
    Employee.saveAll(employees, (err) => {
      if (err) {
        HospitalView.ErrorView(err);
      } else HospitalView.logoutView(employee);
    });
   });
  }

  static show(type) {}

  static findPatientBy(argument) {}

  static help() {}
}

module.exports = HospitalController;
