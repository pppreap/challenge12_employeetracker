//Import Packages Needed
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

//loads variable from .env file
require('dotenv').config;


//create connection to database
const connection = mysql.createConnection({

    host:'localhost',
    //personal mysql username
    user: process.env.USER,
    //personal mysql password
    password: process.env.PASSWORD,
    //database being used
    database: process.env.DATABASE,
});

connection.connect(err=> {
    if (err) throw err;
    viewToDo();   
});

//start presented with options to view view all departments, view all roles, view all employees, 
//add a department, add a role, add an employee, and update an employee role

const viewToDo = () => {
inquirer
    .prompt ([
    {
        type:'list',
        name:'options',
        message:'What would you like to do?',
        choices:['View all departments', 
                'View all roles', 
                'View all employees', 
                'Add a department', 
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Quit']
    }
])
.then((answers) => {
    const {options} = answers;

    if (options === 'View all departments') {
        viewDepts();
    }

    if (options === 'View all roles') {
        viewRoles();
    }

    if(options === 'View all employees') {
        viewEmployees();
    }

    if(options === 'Add a department') {
        addDept();
    }

    if(options === 'Add a role') {
        addRole();
    }

    if(options === 'Add an employee') {
        addEmployee();
    }

    if(options === 'Update an employee role') {
        updateRole();
    }

    if(options === 'Quit') {
        connection.end();
    }
  });
};

//functions based on what users what to do

//function to view all departments
viewDepts = () => {
    console.log('Viewing all departments..\n');
    const sql = `SELECT department.id AS id, 
                        department.name AS department
                        FROM department`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        viewToDo();
    });
};

//function to view all roles
viewRoles = () => {
    console.log('Viewing all roles..\n');
    const sql = `SELECT role.id, role.title, department.name AS department 
                 FROM role,
                 role.salary,
                 INNER JOIN department ON role.department_id =department.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        viewToDo();
    });    
};

// //function to view all employess
viewEmployees = () => {
    console.log(`Viewing all employees...\n`)
    const sql = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name AS department,
                        role.salary
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager from employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id= manager.id
                        LEFT JOIN employee manager ON employee.namager_id =manager.id`;
                        
    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        viewToDo();
    });  
};

// //function to add a department
addDept = () => {
    inquirer.prompt([
        {
        type:'input',
        name:'addDeptName',
        message:'Enter the name of the department',
        validate: addDeptName => {
            if (addDeptName){
                return true;
            } else {
                console.log ('Please enter name for department');
                return false;
            }
        }
        }
    ])
    .then(answer=>{
        const sql=`INSERT INTO department(name)
                   VALUES (?)`;
        connection.query(sql, answer.addDeptName, (err,result) => {
            if (err) throw err;
            console.log('Added' + answer.addDeptName + 'to departments!');
            viewDepts();
        });
    });
};

// //function to add a role
addRole = () => {
    inquirer.prompt([
        {
        type:'input',
        name:'roleName',
        message:'Enter the name of the role.',
        validate: roleName => {
            if (roleName){
                return true;
            } else {
                console.log ('Please enter name for the role');
                return false;
                }
            }
        },
        {
        type:'input',
        name:'addSalary',
        message:'Enter the salary of the role.',
        validate: addSalary => {
            if (NaN(addSalary)){
                return true;
            } else {
                console.log ('Please enter a salary!');
                return false;
                }
            }
        }
    ])
    .then(answer => {
        const params =[answer.roleName, answer.addSalary];
        //select department from department table
        const roleNameSql = `SELECT name, id FROM department`;
        connection.promise().query(roleNamesql, answer.roleName, (err, data) => {
            if (err) throw err;

        const dept = data.map(({name, id}) => ({name: name, value: id}));

        inquirer.prompt([
          {
            type:'list',
            name:'dept',
            message:'Enter the department of the role.',
            choices: dept 
          } 
        ])
        .then (deptChoices=> {
            const dept = deptChoices.dept;
            params.push(dept);

            const sql=`INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?)`;
            connection.query(sql, params, (err,result) => {
            if (err) throw err;
            console.log('Added' + answer.roleName + 'to roles!');

            viewRoles();
         });
      });
  });
});
};

// //function to add an employee
addEmployee = () => {
    inquirer.prompt([
        {
            type:'input',
            name:'firstName',
            message:'Enter employee first name.',
            validate: addFirstName => {
                if (addFirstName){
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type:'input',
            name:'lastName',
            message:'Enter employee last name.',
            validate: addLastName => {
                if (addLastName){
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        },
    ])
    .then (answer => {
        const params = [answer.addFirstName, answer.addLastName];
            //select roles from roles table
            const employeeRoleSql = `SELECT role.id, role.title FROM role`;
            connection.promise().query(employeeRoleSql, (err, data) => {
                if (err) throw err;   
            const roles = data.map(({id, title})=> ({ name: title, value: id}));
        
        inquirer.prompt([
        {
            type:'list',
            name:'role',
            message:'Enter employee role.',
            choices: roles
        }
        ])
        .then(roleChoices => {
        const role = roleChoices.role;
        params.push(role);
    
        const managerSql ='SELECT * from employee';
        connection.promise().query(employeeRoleSql, (err, data) => {
            if (err) throw err;   

        const managers = data.map(({id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id}));
        
        inquirer.prompt([
            {
                type:'list',
                name:'manager',
                message:'Enter the manager name of the employee.',
                choices: managers
            }
        ])
        .then(managersChoice => {
            const managers = managersChoice.managers;
            params.push(managers);

            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?)`;

            connection.query(sql, params, (err,result) => {
            if (err) throw err;   
            console.log("Employee has been successfully added.")

            viewEmployees();

            });
          });
        });
      });
    });
  });
};

// //function to update an employee role
updateRole = () => {
//select employees from employee table
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data)=> {
     if (err) throw err;

    const employees = data.map(({id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id}));

    inquirer.prompt([
    {
        type:'list',
        name:'name',
        message:'Enter the employee name to update role.',
        choices: employees
    }
    ])
    .then(employeeUpdateChoice => {
        const employee = employeeUpdateChoice.name;
        const params = [];
        params.push(employee);

        const roleSql =`SELECT * from role`;

        connection.promise().query(roleSql, (err, data) => {
            if (err) throw err;

        const roles = data.map(({id, title}) => ({ name: title, value: id}));

        inquirer.prompt([
            {
            type:'list',
            name:'role',
            message:'Update the employee new role.',
            choices: roles
            }
        ])
        .then(roleUpdateChoice => {
            const role = roleUpdateChoice.role;
            params.push(role);

            let employee = params[0]
            params[0] = role
            params[1] = employee

            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            connection.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log('Role of employee has been successfully updated!');

            viewEmployees();
        });
      });
     });
    });
  });
};