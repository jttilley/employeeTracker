let mysql = require("mysql");
let inquirer = require("inquirer");


function start() {
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

  inquirer.prompt([
    {
      name: "action",
      type: "input",
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
                "View Department Budget Used"
      ]
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
    }
  })
};

function addDept() {

}

function addRoles() {

}

function addEmp() {

}

function viewDept() {

}

function viewRoles() {

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
