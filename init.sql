drop database if exists bamazon;
create database bamazon;
use bamazon;

create table department (
  id int auto_increment primary key,
  name varchar(256) not null,
  overhead decimal(16,2) not null
);

create table product (
  id int auto_increment primary key,
  name varchar(256) not null,
  department int not null,
  price decimal(16,2) not null,
  sales decimal(16,2) not null,
  inventory int not null,
  foreign key (department) references department(id)
);

insert into department (id, name, overhead) values
  (1, "Fizz", 1000),
  (2, "Buzz", 2000);

insert into product (name, department, price, sales, inventory) values
  ("Foo", 1, 100, 500, 10),
  ("Bar", 1, 200, 600, 5);
  ("Spam", 2, 50, 250, 100),
  ("Eggs", 2, 20, 120, 200);