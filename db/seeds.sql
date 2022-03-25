INSERT INTO department (name)
VALUES ("Research and Development"),
       ("Engineering"),
       ("Sciences"),
       ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Analyst", 90000, 1),
       ("Engineer", 120000, 2),
       ("Ecologist", 80000, 3),
       ("Safety Supervisor", 100000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leto", "Atreides", 2, NULL),
       ("Paul", "Atreides", 2, 1),
       ("Duncan","Idaho", 4, 1),
       ("Thufir", "Hawat", 1, 1),
       ("Gurney", "Halleck", 4, 2),
       ("Liet", "Kynes", 3, NULL);
       
