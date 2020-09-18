const inquirer = require('inquirer');
const mysql = require('mysql');


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
    password: "process.env.DB_PASSWORD",
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
    .prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "decision",
            choices: [
                "View all employees",
                "View all roles",
                "View all employees by department",
                "Add an employee",
                "Add a department",
                "Add a roles",
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
            case "View all employees by department":
                console.log("all employees in the department");
                viewAllEmployeesByDepartment();
                break;
            case "Add an employee":
                console.log("addition of employee");
                addEmployee();
                break;
            case "Add a roles":
                console.log("addition of roles");
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
    var query = "SELECT roles.roles_id, roles.title, department.department, department.department_id ";
    query += "FROM department INNER JOIN roles ON department.department_id = roles.department_id ";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            let roleList = res[i].roles_id + ' ' + res[i].title;
            roleListArray.push(roleList);
        }

        connectionTwo.query("SELECT department_id, department FROM department", function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                let departmentList = res[i].department_id + ' ' + res[i].department;
                departmentListArray.push(departmentList);
            }
        })

        var managerQuery = "SELECT employee.employee_id, employee.first_name, employee.last_name, roles.title ";
        managerQuery += "FROM employee INNER JOIN roles ON roles.roles_id = employee.roles_id WHERE roles.title = 'Manager'"
        connectionThree.query(managerQuery, function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                let employeeNameList = res[i].employee_id + ' ' + res[i].first_name + ' ' + res[i].last_name + ' ' + res[i].title;
                employeeNameArray.push(employeeNameList);
            }
        })

        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What is your employees ID number?",
                    name: "employeeId"
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
                    type: "list",
                    message: "What is your employees title?",
                    name: "title",
                    choices: roleListArray
                },
                {
                    type: "list",
                    message: "What is your employees department?",
                    name: "department",
                    choices: departmentListArray
                },
                {
                    type: "list",
                    message: "Who is this employees manager?",
                    name: "manager",
                    choices: employeeNameArray
                },
            ])
            .then(function (answer) {
                let newEmployee = [answer.employeeId, answer.first_name, answer.last_name, answer.title.split(' ').slice(0, 1), answer.manager.split(' ').slice(0, 1)];
                profile.push(newEmployee);

                console.log(`${answer.first_name} ${answer.last_name} has been added to the roster`);
                var query = "INSERT INTO employee VALUES (?,?,?,?,?)";
                connection.query(query, newEmployee, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    decisions();
                });
            })
    });
};

function addRole() {
    var query = "SELECT employee_id, employee.first_name, employee.last_name, roles.roles_id, roles.title, roles.salary, department.department, department.department_id ";
    query += "FROM department INNER JOIN roles ON department.department_id = roles.department_id ";
    query += "INNER JOIN employee ON roles.roles_id = employee.roles_id";
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
                    message: "What is the roles salary?",
                    name: "addRoleSalary"
                },
                {
                    type: "list",
                    message: "What is the roles department ID number?",
                    name: "addRoleDepartmentId",
                    choices: departmentListArray
                },
            ])
            .then(function (answer) {
                let newRole = [answer.addRoleId, answer.addRoleTitle, answer.addRoleSalary, answer.addRoleDepartmentId.split(' ').slice(0, 1)];
                roleArray.push(newRole);

                var query = "INSERT INTO roles VALUES (?,?,?,?)";
                connection.query(query, newRole, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    decisions();
                });
            });
    });
}

function addDepartment() {
    connection.query(
        "SELECT * FROM departments",
        function (err, res) {
            if (err) throw err;
            let departmentArray = [];
            departmentArray.push(res[0].name);
            inquirer
                .prompt([
                    {
                        name: "id",
                        type: "input",
                        message: "What is the id of the department you would like to make?"
                    },
                    {
                        name: "name",
                        type: "input",
                        message: "What is the name of the department you would like to make?"
                    },
                ]).then(function (answer) {
                    connection.query(
                        "INSERT INTO departments SET ?", {
                        id: answer.id,
                        name: answer.name,
                    },
                        function (err, res) {
                            if (err) throw err;
                            start();
                        }
                    )
                })
        }
    )
}

function viewAllEmployees() {
    connection.query(
        "SELECT * FROM employee",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        });
}

function viewAllDepartments() {
    connection.query(
        "SELECT * FROM departments",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        });
}

function viewAllRoles() {
    connection.query(
        "SELECT * FROM role",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        });
}

function updateEmployeeRole() {
    connection.query(
        "SELECT * FROM employee",
        function (err, emp) {
            if (err) throw err;
            for (let i = 0; i < emp.length; i++) {
                let employeeList = emp[i].id + ' ' + emp[i].first_name + ' ' + emp[i].last_name + ' ' + emp[i].role_id + ' ';
                employeeArray.push(employeeList);
            }
        }
    )
    connection.query("SELECT * FROM role",
        function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                let roleList = res[i].title;
                console.log(roleList + "from role query");
                roleArray.push(roleList);
            }
            askRole();
        })

    function askRole() {
        inquirer
            .prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "What is the employee's name?",
                    choices: employeeArray
                },
                {
                    name: "role_id",
                    type: "list",
                    message: "What is the employee's NEW role?",
                    choices: roleArray
                },
            ]).then(function (answer) {
                connection.query('UPDATE employee SET role_id = ${answer.role_id} WHERE'
                    ,
                    function (err, res) {
                        if (err) throw err;
                        console.table(res.affectedRows);
                        start();
                    });
            })
    }
}
