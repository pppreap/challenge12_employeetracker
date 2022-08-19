//Import Packages Needed
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// //loads variable from .env file
// require('dotenv').config;

//create connection to database
const connection = mysql.createConnection({

    host:'localhost',
    //personal mysql username
    user:'root',
    //personal mysql password
    password: 'Coding01',
    //database being used
    database:'company_db',
    },
    console.log('Connected to the company database')
    );

    //connect to mysql server and sql database
connection.connect(function (err){
    if (err) throw err;
    //run the prompts after connection is made
    viewToDo();   
});

//start presented with options to view view all departments, view all roles, view all employees, 
//add a department, add a role, add an employee, and update an employee role
function viewToDo() {
inquirer.prompt ([
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
.then(answers => {
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
    };
  })
};

//functions based on what users what to do

//function to view all departments
const viewDepts = () => {
    console.log('Viewing all departments...\n');
    const sql = `SELECT departments.id AS id, departments.name AS department FROM departments`;
    // const sql = `SELECT * FROM departments`;
    connection.query(sql, function (err, res) {
        if (err) throw err;
    
        console.table(res);
        console.log('This is the end of the data');
        viewToDo();
    });
};

//function to view all roles
const viewRoles = () => {
    console.log('Viewing all roles..\n');
    const sql = `SELECT roles.id, 
                 roles.title,
                 roles.salary,
                 departments.name as department 
                 FROM roles
                 LEFT JOIN departments ON roles.department_id = departments.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        viewToDo();
    });    
};

// //function to view all employees
viewEmployees = () => {
    console.log(`Viewing all employees...\n`)
    const sql = `SELECT employees.id, 
                        employees.first_name, 
                        employees.last_name, 
                        roles.title AS title, 
                        departments.name AS department,
                        roles.salary AS salary,
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager 
                        FROM employees
                        LEFT JOIN roles ON employees.role_id = roles.id
                        LEFT JOIN departments ON roles.department_id= departments.id
                        LEFT JOIN employees manager ON employees.manager_id = manager.id`;
                        
    connection.query(sql, (err, rows) => {
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
        message:'Enter the name of the new department.',
        validate: addDeptName => {
            if (addDeptName){
                return true;
            } else {
                console.log ('Please enter name for department.');
                return false;
            };
        }
        }
    ])
    .then(answer=>{
        const sql=`INSERT INTO departments(name)
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
            if (isNaN(addSalary)){
                return false;
            } else {
                console.log ('Please enter a salary!');
                return true;
                }
            }
        }
    ])
    .then(answer => {
        const params =[answer.roleName, answer.addSalary];
        //select department from department table
        const roleNameSql = `SELECT name, id FROM departments`;
        connection.query(roleNameSql, answer.roleName, (err, data) => {
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

            const sql=`INSERT INTO roles (title, salary, department_id)
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
            validate: firstName => {
                if (firstName){
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                };
            }
        },
        {
            type:'input',
            name:'lastName',
            message:'Enter employee last name.',
            validate: lastName => {
                if (lastName){
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                };
            }
        },
    ])
    .then (answer => {
        const params = [answer.firstName, answer.lastName];
            //select roles from roles table
            const employeeRoleSql = `SELECT roles.id, roles.title FROM roles`;
            // const sql =`SELECT * FROM roles`
            connection.query(employeeRoleSql, function(err, data) {
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
    
        const managerSql =`SELECT * from employees`;
        connection.query(managerSql,(err, data) => {
            if (err) throw err; 
        
        const managers = data.map(({id, first_name, last_name}) => ({name: first_name + "" + last_name, value: id}));
        
        inquirer.prompt([
            {
                type:'list',
                name:'manager',
                message:'Enter the manager name of the employee.',
                choices: managers
            }
        ])
        .then(managersChoice => {
            const manager = managersChoice.manager;
            params.push(manager);

            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?)`;
            
            connection.query(sql, params, (err) => {
            if (err) throw err; 
                  
            console.log('Employee has been successfully added.');

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
    const employeeSql = `SELECT * FROM employees`;

    connection.query(employeeSql, function(err, data){
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

        const roleSql =`SELECT * from roles`;

        connection.query(roleSql, function(err, data){
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

            const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
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