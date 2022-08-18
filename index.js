//Import Packages Needed
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

//loads variable from .env file
require('dotenv').config;


//create connection to database
const connection = mysql.createConnection({

    host:'localhost'
    //personal mysql username
    user: process.env.USER,
    //personal mysql password
    password: process.env.PASSWORD,
    //database being used
    database: process.env.DATABASE
    }
    console.log (`Connected to company_db database`)
);

connection.connect(err=> {
    if (err) throw err;
    viewToDo();
    
})

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
        message:'Enter the name of the role',
        validate: roleName => {
            if (roleName){
                return true;
            } else {
                console.log ('Please enter name for the role');
                return false;
            }
        }
        }
    ])
    .then(answer=>{
        const sql=`INSERT INTO role(title)
                   VALUES (?)`;
        connection.query(sql, answer.roleName, (err,result) => {
            if (err) throw err;
            console.log('Added' + answer.roleName + 'to roles!');
            viewRoles();
        });
    });
// };

// //function to add an employee
// addEmployee =() => {

// };

// //function to update an employee role
// updateRole = () => {

// };