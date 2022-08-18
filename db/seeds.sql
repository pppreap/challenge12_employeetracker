INSERT INTO department (name)
VALUES 
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Lead', 100000, 4),
('Salesperson', 80000, 4),
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Ghechly', 'Tang', 1, null),
('Tommy', 'lin', 2, 1),
('Jason', 'Vo', 3, null),
('Paula', 'Preap', 4, 3),
('Tommy', 'Hui', 5, null),
('Trong', 'Nguyen', 6, 5),
('Darny', 'Poul', 7, null),
('Avery', 'Poul', 8, 7);
