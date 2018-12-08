let mysql = require('promise-mysql'),
  Table = require('cli-table'),
  inq = require('inquirer'),
  isInteger = require('./isInteger');

async function main() {
  let conn = await mysql.createConnection({
    user: 'root',
    database: 'bamazon'
  });

  inq.prompt([
    {
      type: 'list',
      name: 'action',
      message: "Choose one:",
      choices: [
        {
          name: "View Products for Sale",
          value: viewProducts
        },
        {
          name: "View Low Inventory",
          value: viewLowInventory
        },
        {
          name: "Add to Inventory",
          value: addToInventory,
        },
        {
          name: "Add New Product",
          value: 'TODO' || addNewProduct,
        }
      ]
    }
  ])
    .then(async ({ action }) => {
      await action(conn);
      conn.end();
    })
}

async function viewProducts(conn) {
  let table = new Table({ head: ["ID", "Name", "Price", "Inventory"] });
  let products = await conn.query("select id, name, price, inventory from product");
  products.forEach((p) => table.push([p.id, p.name, p.price, p.inventory]));
  console.log(table.toString());
}

async function viewLowInventory(conn) {
  let table = new Table({ head: ["ID", "Name", "Price", "Inventory"] });
  let products = await conn.query("select id, name, price, inventory from product where inventory < 5");
  products.forEach((p) => table.push([p.id, p.name, p.price, p.inventory]));
  console.log(table.toString());
}

async function addToInventory(conn) {
  let products = await conn.query("select id, name, price, inventory from product");
  productById = (id) => products.find((p) => p.id == id);

  let { id, quantity } = await inq.prompt([
    {
      type: 'input',
      name: 'id',
      message: "Product ID:",
      validate: (id) => Boolean(productById(id)) || "Unknown ID",
    },
    {
      type: 'input',
      name: 'quantity',
      message: ({ id }) => `Quantity (${productById(id).inventory} in stock):`,
      validate: (quantity) => isInteger(quantity) && quantity > 0 || "Invalid input"
    }]);

  conn.query("update product set inventory = inventory + ? where id = ?", [quantity, id]);
}

main();