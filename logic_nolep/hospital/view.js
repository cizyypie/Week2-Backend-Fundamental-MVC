class HospitalView {
  static ErrorView(message) {
    console.log(`ERROR: ${message}`);
  }

  static registerView(objArr) {
    const employee = objArr[0];
    const total = objArr[1];
    console.log(
      `Register success!
Username : ${employee.username}
Role     : ${employee.position}
Total employee: ${total}`,
    );
  }

  static loginView(employee) {
    console.log(
      `Login success!
Welcome ${employee.username} (${employee.position})`,
    );
  }

  static logoutView(employee) {
    console.log(
      `Logout success!
Goodbye ${employee.username}`,
    );
  }

  static addPatient(patient) {
    console.log(
      `Patient added successfully!
ID   : ${patient.id}
Name : ${patient.name}
Diseases : ${patient.diseases.join(", ")}`,
    );
  }

  static showEmployeeView(employees) {
    console.log("=== EMPLOYEE LIST ===");
    employees.forEach((emp, index) => {
      console.log(
        `${index + 1}. ${emp.username} | ${emp.position} | login: ${emp.login}`,
      );
    });
  }

  static showPatientView(patients) {
    console.log("=== PATIENT LIST ===");
    patients.forEach((p) => {
      console.log(
        `ID: ${p.id} | Name: ${p.name} | Diseases: ${p.diseases.join(", ")}`,
      );
    });
  }

  static deletePatient(id) {
    console.log(`Patient with ID ${id} deleted successfully.`);
  }

  static updatePatient(patient) {
    console.log(
      `Patient updated successfully!
ID   : ${patient.id}
Name : ${patient.name}
Diseases : ${patient.diseases.join(", ")}`,
    );
  }

  static findPatientBy(patients) {
    console.log("=== SEARCH RESULT ===");
    patients.forEach((p) => {
      console.log(
        `ID: ${p.id} | Name: ${p.name} | Diseases: ${p.diseases.join(", ")}`,
      );
    });
  }

  static helpView() {
    console.log(`
==========================
HOSPITAL INTERFACE COMMAND
==========================

Register:
node index.js register <username> <password> <role>

Login:
node index.js login <username> <password>

Logout:
node index.js logout

Patient Management (DOCTOR ONLY):
node index.js addPatient <ID> <name> <disease1> <disease2> ...
node index.js updatePatient <id> <name> <disease1> <disease2> ...
node index.js deletePatient <id>

View Data:
node index.js show employee
node index.js show patient

Find Patient:
node index.js findPatientBy id <patientId>
node index.js findPatientBy name <patientName>
`);
  }
}

module.exports = HospitalView;
