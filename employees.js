const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// look up queries
const deptQuery = `SELECT * FROM department`;
const rolesQuery = `SELECT * FROM role`;
const empNamesQuery = `SELECT id, CONCAT(employee.first_name, " ", employee.last_Name) AS name, role_id, manager_id FROM employee`;



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


// functions to get lists for questions
function getList(res, objElName)
{
  const arr = [];
  // console.log('res: ', res);
  res.forEach(e => {
    arr.push(e[objElName]);
  });
  return arr;
}

function listDepartments(deptRes) {
  return getList(deptRes,"name");
}

function listRoles(roleRes) {
  return getList(roleRes,"title");
}

function listEmployees(empRes) {
  return getList(empRes,"name");
}

// functions to find ids for updates
function findValue(res, srchEl, value, returnEl) {
  // console.log('returnEl: ', returnEl);
  // console.log('value: ', value);
  // console.log('srchEl: ', srchEl);

  for(let i = 0; i < res.length; i++) {
    // console.log('res[i][srchEl]: ', res[i][srchEl]);
    //for strings
    if (isNaN(res[i][srchEl])) {
      if (res[i][srchEl].match(value)) return res[i][returnEl];
    } 
    
    // for numbers
    if (res[i][srchEl] === value) {
      return res[i][returnEl];
    }
  }
}

function findRoleId(roleRes,role) {
  return findValue(roleRes,"title",role,"id")
}

function findEmpId(empRes, employee) {
  return findValue(empRes,"name",employee,"id")
}

function findDeptId(deptRes, department) {
  return findValue(deptRes,"name",department,"id")
}


// SQL connection functions
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
      choices: [
                "View Employees",
                "View Departments",
                "View Roles",
                "Add Employees",
                "Add Roles",
                "Add Department",
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

    const departments = listDepartments(deptRes)
    departments.push("Cancel & Go Back")
    // console.log('departments: ', departments);

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
          // console.log('chk: ', chk);
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
      }
    ]).then(({ role, salary, department }) => {
      if (department === "Cancel & Go Back") return start();

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

async function badaddEmp() {
  // get roles
  try {
    const roleRes = await connection.query(rolesQuery);
    
    // console.log('roleRes.title: ', roleRes.title);
    
    const roles = listRoles(roleRes);
  
    // console.log('roles: ', roles);
  
      // get employee info
    const { fName, lName, role } = await inquirer.prompt([
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
    ]);
  
    let res = await connection.query(empNamesQuery);

    // get role id
    const roleId = findRoleId(roleRes,role);
    
    // get manager id
    // checks role table for a role_id matching the roleId and returns that department id
    const deptId = findValue(roleRes,"role_id",roleId,"department_id");
    // checks the role table for a title that inlcudes "Lead" and the department id matches deptId then
    // uses that roles id to check the employee table for the matching role_id and returns the employee id
    for (let i = 0; i < roleRes.length; i++) {
      if (roleRes[i].title.match("Lead") && roleRes[i].department_id === deptId) {
        const managerId = findValue(res,"role_id",roleRes[i].id,"id");
      }
    }
  
    // console.log('fName: ', fName);
    // console.log('lName: ', lName);
    // console.log('roleId: ', roleId);
    // console.log('managerId: ', managerId);
    
    res = await connection.query("INSERT INTO employee SET ?",
      {
        first_name: fName,
        last_name: lName,
        role_id: roleId, 
        manager_id: managerId || null
      }
    );

    console.log("Employee was successfully added!")
    start();
  } catch (err) {
    throw err;
  }
}


function addEmp() {
  // get roles
  connection.query(rolesQuery, function(err, roleRes) {
    if (err) throw err;

    const roles = listRoles(roleRes);

    // console.log('roles: ', roles);

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
      connection.query(query, function(err, res) {
        if (err) throw err;
        
        // console.log('role: ', role);
        // console.log('roleRes: ', roleRes);
        
        // get role id
        const roleId = findRoleId(roleRes,role);
        console.log('roleId: ', roleId);

        // get manager id
        // checks role table for a role_id matching the roleId and returns that department id
        const deptId = findValue(roleRes,"id",roleId,"department_id");
        console.log('deptId: ', deptId);
        // checks the role table for a title that inlcudes "Lead" and the department id matches deptId then
        // uses that roles id to check the employee table for the matching role_id and returns the employee id
        let managerId = null;

        for (let i = 0; i < roleRes.length; i++) {
          if (roleRes[i].title.match("Lead") && roleRes[i].department_id === deptId) {
            managerId = findValue(res,"role_id",roleRes[i].id,"id");
          }
        }
  
        // console.log('fName: ', fName);
        // console.log('lName: ', lName);
        // console.log('roleId: ', roleId);
        // console.log('managerId: ', managerId);
        
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
        );
      });
    })
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
  let query = `SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, role.title, department.name AS department, role.salary, 
	  CONCAT(manager.first_name, " ", manager.last_name) as manager
	  FROM employee employee LEFT JOIN employee manager ON (employee.manager_id = manager.id) 
    LEFT JOIN role ON (employee.role_id = role.id) LEFT JOIN department ON (role.department_id = department.id)`
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewBudget() {

}

function viewEmpByManeger() {

}

function updateEmpManagers() {

}

function updateEmpRole() {
  let query = `SELECT CONCAT(employee.first_name, " ", employee.last_Name) AS name, id FROM employee`;
  connection.query(empNamesQuery,function(err, empRes) {
    if (err) throw err;

    const employees = listEmployees(empRes);
    // console.log('employees: ', employees);

    connection.query(rolesQuery,function(err, roleRes) {
      if (err) throw err;

      const roles = listRoles(roleRes);
      roles.push("Cancel & Go back");

      inquirer.prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee would you like to change the role of?",
          choices: employees
        },
        {
          name: "role",
          type: "list",
          message: "What is their new role?",
          choices: roles
        }
      ]).then(({ employee, role }) => {
        if (role === "Cancel & Go back") return start();

        // find employee id for reference
        let empId = findEmpId(empRes, employees);

        // find role id
        let roleId = findRoleId(roleRes, role);

        let query = `UPDATE employee Set ? WHERE ?`
        connection.query(query,[
          { role_id: roleId },
          { id: empId }
        ],
        function(err, res) {
          if (err) throw err;
          
          console.log(`${employee} has the new role of ${role}!`);
          start();
        })
      })
    })
  })
}

function deleteFromDB(query, idFunctionName, tableName, listFunctionName) {
  connection.query(query, function(err, res) {
    if (err) throw err;
    const choiceList = eval(`${listFunctionName}(res)`);

    inquirer.prompt([
      {
        name: "removed",
        type: "list",
        message: `Which ${tableName} would you like to remove?`,
        choices: choiceList
      }
    ]).then(({ removed }) => {
      const id = eval(`${idFunctionName}(res, removed)`);
      console.log('id: ', id);
      let query = `Delete FROM ${tableName} WHERE ?`;
      connection.query(query,[{ id: id }], function(err, res) {
        if (err) throw err;

        console.log(`${removed} has been successfully removed!`);
        start();
      })
    })
  })
}

function delEmps() {
  deleteFromDB(empNamesQuery, "findEmpId", "employee", "listEmployees");
}

function delDepts() {
  deleteFromDB(deptQuery, "findDeptId", "department", "listDepartments");  
}

function delRoles() {
  deleteFromDB(rolesQuery, "findRoleId", "role", "listRoles");
}
