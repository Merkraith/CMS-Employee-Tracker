const inquirer = require('inquirer');
const mysql = require('mysql');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "process.env.DB_password",
    database: "employee_tracker_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add an employee",
                "Add a role",
                "Add a department",
                "view all emplpoyees",
                "view all departments",
                "view all roles",
                "update employee role",
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add an employee":
                    addEmployee();
                    break;

                case "Add a role":
                    addRole();
                    break;

                case "Add a department":
                    addDepartment();
                    break;
                case "view all employees":
                    viewAllEmployees();
                    break;
                case "view all departments":
                    viewAllDepartments();
                    break;
                case "view all Roles":
                    viewAllRoles();
                    break;
                case "Update employee role":
                    updateEmployeeRole();
                    break;
            }
        });
}