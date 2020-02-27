var mysql = require("mysql");
var inquirer = require("inquirer")
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "basedata321!",
    database: "employee_trackerDB"
});

function appMenu() {

    actions();
    function actions() {
        inquirer.prompt([

            {
                type: "list",
                name: "choice",
                message: "Please choose:",
                choices: ['Add Employee', 'Retrieve all employee info', 'Update Role', 'View by department','View by role']
            }
        ])
            .then(function (answers) {

                if (answers.choice === "Add Employee") {
                    addEmployee();

                }
                else if (answers.choice === "Retrieve all employee info") {
                    joinById();

                }
                else if (answers.choice === "Update Role") {
                    updateRole();
                }
                else if (answers.choice === "View by department") {
                    employeesDepartment();
                }
                else if (answers.choice === "View by role") {
                    employeesRole();
                }

                else {

                    console.log("thanks for using this program!")
                }

            });
    }
}


appMenu();

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "Please enter employee's department:"
        },

        {
            type: "input",
            name: "title",
            message: "Please enter employee's title:"
        },
        {
            type: "input",
            name: "salary",
            message: "Please enter employee's salary:"
        },
        {
            type: "input",
            name: "departmentId",
            message: "Please enter employee's department ID:"
        },
        {
            type: "input",
            name: "firstName",
            message: "Please enter employee's First Name:"
        },
        {
            type: "input",
            name: "lastName",
            message: "Please enter employee's Last Name:"
        },
        {
            type: "input",
            name: "roleId",
            message: "Please enter employee's Role ID:"
        },
        {
            type: "input",
            name: "managerId",
            message: "Please enter employee's Manager ID:"
        }


    ])
        .then(function (answers) {

            var department = answers.department;
            var title = answers.title;
            var salary = answers.salary;
            var departmentId = answers.departmentId
            var firstName = answers.firstName;
            var lastName = answers.lastName;
            var roleId = answers.roleId;
            var managerId = answers.managerId;

            // console.log(itemToPost)
            connectToDb(department, title, salary, departmentId, firstName, lastName, roleId, managerId);
            appMenu();

        });


}


function connectToDb(department, title, salary, departmentId, firstName, lastName, roleId, managerId) {

    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        insertEmployeeTable1(department, title, salary, departmentId, firstName, lastName, roleId, managerId);
        insertEmployeeTable2(title, salary, departmentId);
        insertEmployeeTable3(firstName, lastName, roleId, managerId);
    });

    //1.insert info into table1
    function insertEmployeeTable1(department, title, salary, departmentId, firstName, lastName, roleId, managerId) {
        console.log("Inserting a new employee...\n");
        var query = connection.query(
            "INSERT INTO department SET ?",
            {
                name: department
            },

            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " employee inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                // updateProduct();
            }
        );
    }
    //2. insert info into table2
    function insertEmployeeTable2(title, salary, departmentId) {
        console.log("Inserting a new employee...\n");
        var query = connection.query(

            "INSERT INTO role SET ?",
            {
                title: title,
                salary: salary,
                department_id: departmentId
            },

            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " employee inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                // updateProduct();
            }
        );
    }
    //3. insert info into table3
    function insertEmployeeTable3(firstName, lastName, roleId, managerId) {
        console.log("Inserting a new employee...\n");
        var query = connection.query(

            "INSERT into employee SET ?",
            {
                first_name: firstName,
                last_name: lastName,
                role_id: roleId,
                manager_id: managerId
            },

            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " employee inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                // updateProduct();
            }
        );
    }
}

//************************************************************************************ */

//function that retrieves info from database
function connectToDbRetreive() {
    var connection = mysql.createConnection({
        host: "localhost",

        // Your port; if not 3306
        port: 3306,

        // Your username
        user: "root",

        // Your password
        password: "basedata321!",
        database: "employee_trackerDB"
    });

    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        var query = connection.query("SELECT * FROM department", function (err, result, fields) {
            if (err) throw err;
            console.table(result);
        });

        var query = connection.query("SELECT * FROM role", function (err, result, fields) {
            if (err) throw err;
            console.table(result);
        });

        var query = connection.query("SELECT * FROM employee", function (err, result, fields) {
            if (err) throw err;
            console.table(result);
        });

    });
    appMenu(); //go back to beginning

}

//Update Role

function updateRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "employeeFirstName",
            message: "First name of employee to update role?"
        },
        {
            type: "input",
            name: "employeeLastName",
            message: "Last name of employee to update role?"
        },
        {
            type: "input",
            name: "newRole",
            message: "What is the new role?"
        }
    ])
        .then(function (answers) {

            var personLn = answers.employeeLastName;
            var personFn = answers.employeeFirstName;
            var query = connection.query(`SELECT id FROM employee WHERE first_name = '${personFn}' AND  last_name = '${personLn}'`, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                var personsIdToUpdate = result[0].id;
                // now i want to update role 
                var query = connection.query(`UPDATE role SET title = '${answers.newRole}' WHERE id=${personsIdToUpdate}`, function (err, result, fields) {
                    if (err) throw err;
                    // console.table(result);
                    console.log(`Updated ${answers.employeeLastName} to ${answers.newRole}!`)
                });

                // console.log(result);
                // console.log(personsIdToUpdate)
            });

            appMenu();
        });
}

//all three tables joined - all info
function joinById() {
    var query = connection.query(`SELECT department.name, role.title, role.salary, employee.first_name,
     employee.last_name
    FROM department INNER JOIN role ON department.id = role.id INNER JOIN employee
     ON role.id = employee.id`, function (err, result, fields) {
        if (err) throw err;
        console.table(result);
        // console.log(`Updated ${answers.employeeLastName} to ${answers.newRole}!`)
    });

    appMenu();

}

// view employees by department
function employeesDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What department (ie.: clothing, food, toys)?"
        }

    ])
        .then(function (answers) {
            var query = connection.query(`SELECT department.name, role.title, role.salary, employee.first_name,
     employee.last_name
    FROM department INNER JOIN role ON department.id = role.id INNER JOIN employee
     ON role.id = employee.id WHERE department.name = '${answers.department}'`, function (err, result, fields) {
                if (err) throw err;
                console.table(result);
                // console.log(`Updated ${answers.employeeLastName} to ${answers.newRole}!`)
            });
        });
    appMenu();

}

// view employees by role
function employeesRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "role",
            message: "What role (ie.: salesperson, cashier, CEO)?"
        }

    ])
        .then(function (answers) {
            var query = connection.query(`SELECT department.name, role.title, role.salary, employee.first_name,
     employee.last_name
    FROM department INNER JOIN role ON department.id = role.id INNER JOIN employee
     ON role.id = employee.id WHERE role.title = '${answers.role}'`, function (err, result, fields) {
                if (err) throw err;
                console.table(result);
                // console.log(`Updated ${answers.employeeLastName} to ${answers.newRole}!`)
            });
        });
    appMenu();

}


// function retrieveByNameInq() {
//     inquirer.prompt([

//         {
//             type: "input",
//             name: "employeeLastName",
//             message: "Who are you looking to update role?"
//         }
//     ])
//         .then(function (answers) {

//             var person = answers;
//             var query = connection.query(`SELECT name FROM employee `)

//         });
// }
