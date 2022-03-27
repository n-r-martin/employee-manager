INSERT INTO department (name)
VALUES ("Royal Administration"),
       ("Diplomacy"),
       ("Sciences"),
       ("Security");

INSERT INTO role (title, salary, department_id)
VALUES ("Duke", 200000, 1),
       ("Kwizatz Haderach", 175000, 1),
       ("Ecologist", 120000, 3),
       ("Bodyguard", 100000, 4),
       ("Mentat, Master of Assassins", 150000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leto", "Atreides", 1, 1),
       ("Paul", "Atreides", 2, 2),
       ("Duncan","Idaho", 4, 2),
       ("Thufir", "Hawat", 5, 1),
       ("Gurney", "Halleck", 4, 2),
       ("Liet", "Kynes", 3, 1);
       
