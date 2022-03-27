const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");
// Import and require inquirer
const inquirer = require("inquirer");
// Import and require console.table
require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "rootROOT88{}",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

///// GLOBAL VARIABLES /////

// Arrays set to empty and then populated with current data in database for use in Inquirer prompts
let departmentList = [];
let roleList = [];
let employeeList = [];

// Functions to populate empty arrays defined above
// Populate department array
db.promise()
  .query("SELECT * FROM department")
  .then((results) => {
    for (let i = 0; i < results[0].length; i++) {
      departmentList.push(results[0][i].name);
    }
  });

// Populate role array
db.promise()
  .query("SELECT * FROM role")
  .then((results) => {
    for (let i = 0; i < results[0].length; i++) {
      roleList.push(results[0][i].title);
    }
  });

// Populate employee array
db.promise()
  .query(`SELECT * FROM employee`)
  .then((results) => {
    for (let i = 0; i < results[0].length; i++) {
      let fullEmployeeName =
        results[0][i].first_name + " " + results[0][i].last_name;
      employeeList.push(fullEmployeeName);
    }

    //Pushing 'No Manager' option so it is available as a choice in inquirer
    employeeList.push("Does not have a manager");
  });

///// FUNCTIONS /////

// Inquirer Prompts

const mainMenu = () => {
  return inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "baseSelection",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit application",
      ],
    },
  ]);
};

const newDepartmentPrompt = () => {
  return inquirer.prompt([
    {
      type: "input",
      message: "Please enter department name:",
      name: "departmentName",
    },
  ]);
};

const newRolePrompt = () => {
  return inquirer.prompt([
    {
      type: "input",
      message: "Please enter role title:",
      name: "roleTitle",
    },
    {
      type: "input",
      message: "Please enter role salary:",
      name: "roleSalary",
    },
    {
      type: "list",
      message: "What department does the role belong to?",
      name: "roleDepartment",
      choices: departmentList,
    },
  ]);
};

const newEmployeePrompt = () => {
  return inquirer.prompt([
    {
      type: "input",
      message: "Please enter employee first name:",
      name: "firstName",
    },
    {
      type: "input",
      message: "Please enter employee last name:",
      name: "lastName",
    },
    {
      type: "list",
      message: "Please select employee role",
      name: "employeeRole",
      choices: roleList,
    },
    {
      type: "list",
      message: "Please select employee manager",
      name: "employeeManager",
      choices: employeeList,
    },
  ]);
};

const updateEmployeeRolePrompt = () => {
  return inquirer.prompt([
    {
      type: "list",
      message: "Which employee would you like to update the role for?",
      name: "employeeSelection",
      choices: employeeList,
    },
    {
      type: "list",
      message: "Please select their new role:",
      name: "roleSelection",
      choices: roleList,
    },
  ]);
}

const primaryPrompt = () => {
  mainMenu().then((response) => {
    switch (response.baseSelection) {
      case "View all departments":
        db.promise()
          .query(`SELECT d.name as "department name" FROM department d`)
          .then((results) => {
            console.log(``);
            console.table(results[0]);
            console.log(``);
            primaryPrompt();
          });
        break;
      case "View all roles":
        db.promise()
          .query(
            `SELECT r.title as "role title", r.salary as "salary", d.name as "department name" FROM role r JOIN department d ON r.department_id=d.id`
          )
          .then((results) => {
            console.log(``);
            console.table(results[0]);
            console.log(``);
            primaryPrompt();
          });
        break;
      case "View all employees":
        db.promise()
          .query(
            `SELECT e.first_name as "first name", e.last_name as "last name", r.title as "role",
                  CONCAT(m.first_name, ' ', m.last_name) as "manager" 
                  FROM employee e 
                  JOIN role r ON e.role_id=r.id
                  JOIN employee m ON e.manager_id=m.id`
          )
          .then((results) => {
            console.log(``);
            console.table(results[0]);
            console.log(``);
            primaryPrompt();
          });
        break;
      case "Add a department":
        newDepartmentPrompt().then((response) => {
          departmentList.push(response.departmentName);
          db.promise()
            .query(
              `INSERT INTO department (name) VALUES ("${response.departmentName}")`
            )
            .then(() => {
              console.log(``);
              console.log(`New department added!`);
              console.log(``);
              primaryPrompt();
            });
        });
        break;
      case "Add a role":
        newRolePrompt().then((data) => {
          const title = data.roleTitle;
          roleList.push(title);

          const salary = data.roleSalary;

          const deptId = db
            .promise()
            .query(
              `SELECT id FROM department WHERE name = "${data.roleDepartment}"`
            )
            .then((data) => {
              departmentId = data[0][0].id;
              console.log(departmentId);
              return departmentId;
            });

          Promise.all([title, salary, deptId]).then((data) => {
            console.log(data);
            db.promise()
              .query(
                `INSERT INTO role (title, salary, department_id) VALUES ("${title}", ${salary}, ${departmentId})`
              )
              .then(() => {
                console.log(``);
                console.log(`New role added!`);
                console.log(``);
                primaryPrompt();
              });
          });
        });
        break;
      case "Add an employee":
        newEmployeePrompt().then((data) => {
          const firstName = data.firstName;

          const lastName = data.lastName;

          employeeList.push(firstName + ' ' + lastName);

          const getRoleId = db
            .promise()
            .query(`SELECT id FROM role WHERE title = "${data.employeeRole}"`)
            .then((data) => {
              roleId = data[0][0].id;
              console.log(roleId);
              return roleId;
            });

          // Splitting the manager full name so we can find their id in the employee table
          let splitManagerName = data.employeeManager.split(" ");
          let managerFirstName = splitManagerName[0];
          let managerLastName = splitManagerName[1];

          const getManagerId = db
            .promise()
            .query(
              `SELECT id FROM employee WHERE first_name="${managerFirstName}" AND last_name="${managerLastName}"`
            )
            .then((data) => {
              managerId = data[0][0].id;
              console.log(managerId);
              return managerId;
            });

          Promise.all([firstName, lastName, getRoleId, getManagerId]).then(
            (data) => {
              console.log(data);
              db.promise()
                .query(
                  `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${roleId}, ${managerId})`
                )
                .then(() => {
                  console.log(``);
                  console.log(`New employee added!`);
                  console.log(``);
                  primaryPrompt();
                });
            }
          );
        });
        break;
      case "Update an employee role":
        updateEmployeeRolePrompt().then((data) => {
          console.log(data);

          // Splitting the manager full name so we can find their id in the employee table
          let splitEmployeeName = data.employeeSelection.split(" ");
          let empFirstName = splitEmployeeName[0];
          let empLastName = splitEmployeeName[1];

          console.log(empFirstName);
          console.log(empLastName);

          const getRoleId = db
            .promise()
            .query(`SELECT id FROM role WHERE title = "${data.roleSelection}"`)
            .then((data) => {
              newRoleId = data[0][0].id;
              console.log(newRoleId);
              return newRoleId;
            });

            Promise.all([empFirstName, empLastName, getRoleId]).then(
              (data) => {
                console.log(data);
                db.promise()
                  .query(
                      `UPDATE employee SET role_id = ${newRoleId} WHERE first_name="${empFirstName}" AND last_name="${empLastName}"`
                    )
                  .then(() => {
                    console.log(``);
                    console.log(`Employee role updated!`);
                    console.log(``);
                    primaryPrompt();
                  });
              }
            );
        });
        break;
      default:
        console.log(
          " ---------------------------",
          "\n",
          "Goodbye!",
          "\n",
          "---------------------------"
        );
        process.exit();
    }
  });
};

const init = () => {
  console.log(
    " -------------------------------------------",
    "\n",
    "(0_0) Welcome to the Employee Manager (0_0)",
    "\n",
    "-------------------------------------------"
  );

  primaryPrompt();
};

///// APPLICATION GO BRRRRRRR >>>>>>

init();
