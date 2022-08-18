//Import Packages Needed
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
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