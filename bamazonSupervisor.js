let mysql = require('promise-mysql'),
  Table = require('cli-table'),
  inq = require('inquirer');

async function main() {
  let conn = await mysql.createConnection({
    user: 'root',
    database: 'bamazon'
  });
  
  inq.prompt([
    {
      type: 'list',
      name: 'action',
      choices: [
        {
          name: "View Product Sales by Department",
          value: viewSalesByDepartment
        },
        {
          name: "Create New Department",
          value: createNewDepartment
        }
      ]
    }
  ])
    .then(async ({action}) => {
      await action();
      conn.end();
    })

}

main();