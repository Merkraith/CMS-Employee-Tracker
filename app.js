const inquirer = require('inquirer');
const mysql = require('mysql');
require('dotenv').config();

let profile = [];
let employeeNameArray = [];
let employeeRoleArray = [];
let roleArray = [];
let roleListArray = [];
let departmentArray = [];
let departmentListArray = [];

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.DB_PASSWORD,
    database: "employees_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});



function start() {
    inquirer
    .prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "decision",
            choices: [
                "View all employees",
                "View all roles",
                "View all departments",
                "Add an employee",
                "Add a department",
                "Add a role",
                "Update employee roles",
            ]
        }
    ]).then(function (data) {
        console.log("Success!")
        switch (data.decision) {
            case "View all employees":
                console.log("all employees");
                viewAllEmployees();
                break;
            case "View all departments":
                console.log("all departments");
                viewAllDepartments();
                break;
            case "Add an employee":
                console.log("addition of employee");
                addEmployee();
                break;
            case "Add a role":
                console.log("addition of role");
                addRole();
                break;
            case "Add a department":
                console.log("addition of department");
                addDepartment();
                break;
            case "Update employee roles":
                console.log("update the roles");
                updateEmployeeRole();
                break;
            case "View all roles":
                console.log("roles");
                viewAllRoles();
                break;
        }
    })
}

function addEmployee() {
    var query = "SELECT * FROM roles";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            let roleList = res[i].title;
            roleListArray.push(roleList);
        }

        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What is your employees ID number?",
                    name: "employee_id"
                },
                {
                    type: "input",
                    message: "What is your employees first name?",
                    name: "first_name"
                },
                {
                    type: "input",
                    message: "What is your employees last name?",
                    name: "last_name"
                },
                {
                    type: "input",
                    message: "What is your role_ID?",
                    name: "title",
                },
            ])
            .then(function (answer) {
                let newEmployee = [answer.employee_id, answer.first_name, answer.last_name, answer.roles_id];
                profile.push(newEmployee);

                console.log(`${answer.first_name} ${answer.last_name} has been added to the roster`);
                var query = "INSERT INTO employee VALUES (?,?,?,?)";
                connection.query(query, newEmployee, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                });
            })
    });
};

function addRole() {
    var query = "SELECT * FROM roles ";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            let departmentList = res[i].department_id + ' ' + res[i].department;
            departmentListArray.push(departmentList);
        }
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What is the roles ID number?",
                    name: "addRoleId"
                },
                {
                    type: "input",
                    message: "What is the title of the roles?",
                    name: "addRoleTitle"
                },
                {
                    type: "input",
                    message: "What is the department id for new role?",
                    name: "addDepartmentId"
                },
            ])
            .then(function (answer) {
                let newRole = [answer.addRoleId, answer.addRoleTitle, answer.addDepartmentId];
                roleArray.push(newRole);

                var query = "INSERT INTO roles VALUES (?,?,?)";
                connection.query(query, newRole, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                });
            });
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the departments ID number?",
                name: "addDepartmentId"
            },
            {
                type: "input",
                message: "What is the name of the department?",
                name: "addDepartmentName"
            },
        ])
        .then(function (answer) {
            let newDepartment = [answer.addDepartmentId, answer.addDepartmentName];
            departmentArray.push(newDepartment);
            var query = "INSERT INTO department VALUES (?,?)";
            connection.query(query, newDepartment, function (err, res) {
                if (err) throw err;
                console.table(res);
                start();
            });
        })
};


function viewAllEmployees() {
    var query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

function viewAllDepartments() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

function viewAllRoles() {
    var query = "SELECT * FROM roles";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function updateEmployeeRole() {
    var query = "SELECT * FROM employee, roles";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            let employeeNameList = res[i].employee_id + ' ' + res[i].first_name + ' ' + res[i].last_name;
            employeeNameArray.push(employeeNameList);
            let roleList = res[i].roles_id + ' ' + res[i].title;
            roleListArray.push(roleList);
        };
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which employee would you like to update their title?",
                    name: "update_employee",
                    choices: employeeNameArray
                },

                {
                    type: "list",
                    message: "What would you like to update their title to?",
                    name: "update_role",
                    choices: roleListArray
                }
            ]).then(function (answer) {
                var query = "UPDATE employee SET ? WHERE ? "
                let updateEmployee = answer.update_role.slice(0, 2);
                let updateRole = answer.update_employee.slice(0, 2)
                connection.query(query, [{ roles_id: updateEmployee }, { employee_id: updateRole }], function (err, res) {
                    if (err) throw err;
                    start();
                })

                console.log(`${answer.update_employee} now has the title of ${answer.update_role}`);

            })
    });
};
