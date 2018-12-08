let mysql = require('promise-mysql');
let Table = require('cli-table');
let inq = require('inquirer');
let isInteger = require('./isInteger');

async function main() {

  let conn = await mysql.createConnection({
      user: 'root',
      database: 'bamazon'
    });

  let table = new Table({ head: ["ID", "Name", "Price", "Inventory"] });

  let products = await conn.query("select id, name, price, inventory from product");

  let productById = (id) => products.find((p) => p.id == id);

  products.forEach((p) => table.push([p.id, p.name, p.price, p.inventory]));

  console.log(table.toString() + '\n' + "Enter an order:");

  let { id, quantity } = await inq.prompt([
    {
      type: 'input',
      name: 'id',
      message: "Product ID:",
      validate: (id) => Boolean(productById(id)) || "Unknown ID: " + id,
    },
    {
      type: 'input',
      name: 'quantity',
      message: "Quantity:",
      validate: (quantity, { id }) => false
        || !(isInteger(quantity) && quantity > 0) && "Invalid input: " + quantity
        || !(productById(id).inventory >= quantity) && "Quantity exceeds inventory: " + quantity
        || true
    }])

  let cost = productById(id).price * quantity;

  await conn.query("update product set inventory = inventory - ?, sales = sales + ? where id = ?", [quantity, cost, id]);

  console.log("Total cost: $" + cost);
  conn.end();
}

main();