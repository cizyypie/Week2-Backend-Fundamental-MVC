let Patient = require("./patient");
let Employee = require("./employee");
let HospitalView = require("./view");

class HospitalController {
  static register(name, password, position) {
    Employee.register(name, password, position, (err, objArr) => {
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

  static addPatient(argument) {
    Employee.findAll((err, employees) => {
      if (err) return HospitalView.ErrorView(err);

      const loggedInUser = employees.find((usr) => usr.login === true);
      if (!loggedInUser || loggedInUser.position !== "dokter") {
        return HospitalView.ErrorView("Access denied or login required");
      }

      const [id, name, ...diseases] = argument;
      if (!name?.trim() || !diseases.length) {
        return HospitalView.ErrorView(
          "Name and at least one disease must be filled in!",
        );
      }

      Patient.findAll((err, patients) => {
        if (err) return HospitalView.ErrorView(err);

        const newPatient = new Patient(id, name, diseases);
        patients.push(newPatient);

        Patient.saveAll(patients, (err) => {
          if (err) {
            HospitalView.ErrorView(err);
          } else {
            HospitalView.addPatient(newPatient);
          }
        });
      });
    });
  }

  static updatePatient(argument) {
    Employee.findAll((err, employees) => {
      if (err) return HospitalView.ErrorView(err);

      const employee = employees.find((usr) => usr.login === true);
      if (!employee || employee.position !== "dokter") {
        return HospitalView.ErrorView("Access denied or login required");
      }

      const [id, name, ...diseases] = argument;
      if (!name?.trim() || !diseases.length) {
        return HospitalView.ErrorView("Name or disease must be filled in!");
      }

      Patient.findAll((err, patients) => {
        if (err) return HospitalView.ErrorView(err);

        const index = patients.findIndex((p) => p.id === id);
        if (index === -1) {
          return HospitalView.ErrorView("Invalid patient ID");
        }

        const updatedPatient = new Patient(id, name, diseases);
        patients[index] = updatedPatient;
        Patient.saveAll(patients, (err) => {
          if (err) {
            HospitalView.ErrorView(err);
          } else {
            HospitalView.updatePatientView(updatedPatient);
          }
        });
      });
    });
  }

  static deletePatient(argument) {
    Employee.findAll((err, employees) => {
      if (err) return HospitalView.ErrorView(err);

      const employee = employees.find((usr) => usr.login === true);
      if (!employee || employee.position !== "dokter") {
        return HospitalView.ErrorView("Access denied or login required");
      }

      const id = argument[0];
      if (!id)
        return HospitalView.ErrorView("Patient ID is required for deletion!");

      Patient.findAll((err, patients) => {
        if (err) return HospitalView.ErrorView(err);

        const index = patients.findIndex((p) => p.id === id);
        if (index === -1) {
          return HospitalView.ErrorView("Invalid patient ID");
        }
        patients.splice(index, 1);

        Patient.saveAll(patients, (err) => {
          if (err) return HospitalView.ErrorView(err);

          HospitalView.deletePatient(id);
        });
      });
    });
  }

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

  static show(type) {
    Employee.findAll((err, employees) => {
      if (err) {
        HospitalView.ErrorView(err);
        return;
      }

      const employee = employees.find((usr) => usr.login === true);
      if (!employee) {
        HospitalView.ErrorView("Please login first");
        return;
      }
      if (type === "employee") {
        if (employee.position !== "admin") {
          HospitalView.ErrorView("Access denied");
          return;
        }
        HospitalView.showEmployeeView(employees);
        return;
      }
      if (type === "patient") {
        Patient.findAll((err, patients) => {
          if (err) {
            HospitalView.ErrorView(err);
          } else {
            HospitalView.showPatientView(patients);
          }
        });
        return;
      }

      HospitalView.ErrorView("Invalid show command");
    });
  }

  static findPatientBy(argument) {
    Employee.findAll((err, employees) => {
      if (err) return HospitalView.ErrorView(err);

      const employee = employees.find((usr) => usr.login === true);
      if (!employee || employee.position !== "dokter") {
        return HospitalView.ErrorView("Access denied or login required");
      }

      const searchTerm = argument[0];
      if (!searchTerm)
        return HospitalView.ErrorView("Please provide a name or ID to search!");

      Patient.findAll((err, patients) => {
        if (err) return HospitalView.ErrorView(err);

        const results = patients.filter(
          (p) =>
            p.id === searchTerm ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        if (results.length === 0) {
          return HospitalView.ErrorView(
            `No patients found matching: ${searchTerm}`,
          );
        }
        HospitalView.showPatientView(results);
      });
    });
  }

  static help() {
    HospitalView.helpView();
  }
}

module.exports = HospitalController;
