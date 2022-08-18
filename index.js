//Import Packages Needed
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const cTable = require('console.table');

require('dotenv').config;


//connection to database
const connection = mysql.createConnection({
    host:'localhost'
    //personal mysql username
    user: process.env.USER,
    //personal mysql password
    password: process.env.PASSWORD,
    //database being used
    database:process.env.DATABASE
}
console.log (`Connected to company_db database`)
);

connection.connect(err=> {
    if (err) throw err;

})

//start presented with options to 
//view view all departments, view all roles, view all employees, 
//add a department, add a role, add an employee, and update an employee role

// inquirer
// .prompt ([
//     {
//     type:'list',
//     name:'options',
//     message:'What would you like to do?',
//     choices:['View all departments', 'view all roles', 'view all employees', 'add a department', 'add an employee','update an employee role']
//     }
// ])
// .then((answers) => {
//     // Use user feedback for... whatever!!
//   })
//   .catch((error) => {
//     if (error.isTtyError) {
//       // Prompt couldn't be rendered in the current environment
//     } else {
//       // Something else went wrong
//     }
//   });