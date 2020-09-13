const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employeesDB"
});

connection.connect(function(err) {
  if (err) throw err;
  displayTitle();
});

function displayTitle() {
  console.log(`
  ,-----------------------------------------------------------------------.
  |  ███████╗███╗   ███╗██████╗ ██╗      █████╗ ██╗   ██╗███████╗███████╗ |
  |  ██╔════╝████╗ ████║██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔════╝ |
  |  █████╗  ██╔████╔██║██████╔╝██║     ██║  ██║ ╚████╔╝ █████╗  █████╗   |
  |  ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║  ██║  ╚██╔╝  ██╔══╝  ██╔══╝   |
  |  ███████╗██║ ╚═╝ ██║██║     ███████╗╚█████╔╝   ██║   ███████╗███████╗ |
  |  ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚════╝    ╚═╝   ╚══════╝╚══════╝ |
  |                                                                       |
  |     ███╗   ███╗ █████╗ ███╗  ██╗ █████╗  ██████╗ ███████╗██████╗      |
  |     ████╗ ████║██╔══██╗████╗ ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗     |
  |     ██╔████╔██║███████║██╔██╗██║███████║██║  ██╗ █████╗  ██████╔╝     |
  |     ██║╚██╔╝██║██╔══██║██║╚████║██╔══██║██║  ╚██╗██╔══╝  ██╔══██╗     |
  |     ██║ ╚═╝ ██║██║  ██║██║ ╚███║██║  ██║╚██████╔╝███████╗██║  ██║     |
  |     ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝     |
  \`-----------------------------------------------------------------------'
  `);

  start();
};


function start() {
  
  inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add Department",
                "Add Roles",
                "Add Employees",
                "View Departments",
                "View Roles",
                "View Employees",
                "Update Employee Roles",
                "Update Employee Managers",
                "View Employees by Manager",
                "Delete Departments",
                "Delete Roles",
                "Delete Emplyoees",
                "View Department Budget Used",
                "Exit"]
    },
  ]).then(({ action }) => {
    switch (action) {
      case "Add Department":
        addDept();
        break;
      case "Add Roles":
        addRoles();
        break;
      case "Add Employees":
        addEmp();
        break;
      case "View Departments":
        viewDept();
        break;
      case "View Roles":
        viewRoles();
        break;
      case "View Employees":
        viewEmps();
        break;
      case "Update Employee Roles":
        updateEmpRole();
        break;
      case "Update Employee Managers":
        updateEmpManagers();
        break;
      case "View Employees by Manager":
        viewEmpByManeger();
        break;
      case "Delete Departments":
        delDepts();
        break;
      case "Delete Roles":
        delRoles();
        break;
      case "Delete Emplyoees":
        delEmps();
        break;
      case "View Department Budget Used":
        viewBudget();
        break;
      default:
        connection.end();
    }
  })
};

function addDept() {
  inquirer.prompt(
    {
      name: "dept",
      type: "input",
      message: "What department would you like to add?"
    }
  ).then(({ dept }) => {
    connection.query("INSERT INTO department SET ?",{ name: dept }, function(err, res) {
        if (err) throw err;

        console.log("Department was successfully added!")
        start();
      }
    );
  });
}; 

function addRoles() {
  // get departments
  let query = "SELECT * FROM department";
  connection.query(query, function(err, deptRes) {
    if (err) throw err;

    const departments = [];
    // console.log('res: ', res);
    deptRes.forEach(e => {
      departments.push(e.name);
    });
    departments.push("Cancel Go Back")
    console.log('departments: ', departments);

    inquirer.prompt([
      {
        name: "role",
        type: "input",
        message: "What role would you like to add?"
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for this role?",
        validate: (ans) => {
          const chk = ans.match(/\d+\.?\d*/)
          console.log('chk: ', chk);
          if (chk[0] === ans){
            return true;
          } 
          console.log("Please enter a proper number for the salary.")
          return false;
        }
      },
      {
        name: "department",
        type: "list",
        message: "Which department is this role for?",
        choices: departments
      },
    ]).then(({ role, salary, department }) => {
      if (department === "Cancel Go Back") return start();

      // get department id
      deptRes.forEach(e => {
        if (e.name === department) deptId = e.id;
      })
    
      connection.query("INSERT INTO role SET ?", { title: role, salary: parseFloat(salary), department_id: deptId }, function(err, res) {
        if (err) throw err;

        console.log("Role was successfully added!")
        start();
      });
    });
  });
}

// var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
    //   query += "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
    //   query += "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";

    //query = "SELECT employee.id, role.title ";
    // query += "FROM employee LEFT JOIN role ON (employee.role_id = role.id)"

function addEmp() {
  // get roles
  let query = "SELECT title, id FROM role";
  connection.query(query, function(err, roleRes) {
    if (err) throw err;

    const roles = [];
    // console.log('res: ', res);
    roleRes.forEach(e => {
      roles.push(e.title);
    });
    console.log('roles: ', roles);

    // get employee info
    inquirer.prompt([
      {
        name: "fName",
        type: "input",
        message: "First Name:"
      },
      {
        name: "lName",
        type: "input",
        message: "Last Name:"
      },
      {
        name: "role",
        type: "list",
        message: "role:",
        choices: roles
      }

    ]).then( ({ fName, lName, role }) => {

      
      query = "SELECT * FROM employee"
      // console.log('query: ', query);

      connection.query(query, function(err, res) {
        if (err) throw err;
        
        // get role id
        roleRes.forEach(e => {
          if (e.title === role) {
            roleId = e.id;
          }
        });

// console.log(res);

        // get manager id
        let managerId = null;
        for (let i = 0; i < res.length; i++) {
          console.log('res[i]: ', res[i]);
          // assumes the manager is one with out a manager
          // assume managers are the role id below the chosen role id
          // probably need to make this a better check, maybe search for word matches with lead in there
          if (res[i].manager_id === null && res[i].role_id === roleId-1) {
            managerId = res[i].id
            break;
          }
        }

        console.log('fName: ', fName);
        console.log('lName: ', lName);
        console.log('roleId: ', roleId);
        console.log('managerId: ', managerId);
        
        connection.query("INSERT INTO employee SET ?",
          {
            first_name: fName,
            last_name: lName,
            role_id: roleId, 
            manager_id: managerId || null
          },
          function(err, res) {
            if (err) throw err;

            console.log("Employee was successfully added!")
            start();
          }
        )
      });
    });
  });
}

function viewDept() {
  let query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewRoles() {
  let query = `SELECT role.title, role.salary, department.name AS "department"
  FROM role LEFT JOIN department ON (role.department_id = department.id)`
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewEmps() {
  
}

function viewBudget() {

}

function viewEmpByManeger() {

}

function updateEmpManagers() {

}

function updateEmpRole() {

}

function delEmps() {

}

function delDepts() {

}

function delRoles() {

}
