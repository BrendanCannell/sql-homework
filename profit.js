(async () => {
  let conn = await require('promise-mysql').createConnection({
    user: 'root',
    database: 'bamazon'
  });

  let result = await conn.query(`select department.name as DepartmentName, sum(product.sales) - department.overhead as TotalProfit from product join department where department.id = product.department group by department.id order by department.id asc;`);
})();