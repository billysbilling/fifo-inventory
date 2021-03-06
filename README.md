FIFO inventory
==============

To prove your abilities to solve tasks in an efficient and straight-forward way, you'll implement an API, that support basic inventory actions. To calculate your inventory throughout time, you'll use the FIFO (First in, First out) principle.

Actions that should be supported:

* Buy item
* Sell item

Your input for buying an item, should be the purchase date, quantity, and item cost price. Your input for selling an item, should be the sell date and quantity. You should also be able to retrieve the quantity for all items, current value from cost price, and sold value.

Given the following variables presented in the tables, your solution should be able to answer the below questions correctly:

(Sebastian is a bullpen dealer, who makes a living from buying and selling ballpens.)

Sebastian buys:

|Date|Quantity|Cost per pen|
|----|--------|------------|
|Jan 1st 2016|200|10|
|Jan 5th 2016|250|15|
|Jan 10th 2016|150|12.5|

Sebastian sells:

|Date|Quantity|
|----|--------|
|Jan 3rd 2016|50|
|Jan 8th 2016|225|
|Jan 11th 2016|50|

Questions:

* How many pens does Sebastian have in stock ultimo Jan 11th 2016?
* What is the value of the inventory ultimo Jan 11th 2016?
* What are the costs of pen solds ultimo Jan 11th 2016?

While the implementation is up to you, the service should be self-sustained, production ready. Consider the service to be public, so omit any authentication / authorization logic, but make sure it has correct execution logic (start / stop), error handling, logging and it's covered by tests. We appreciate automated tests a lot so everything that we built should be well-tested. Please document the decision making while building this service (work log). API documentation for the service will be a plus.
