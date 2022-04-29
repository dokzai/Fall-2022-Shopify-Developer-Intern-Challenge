# 🛍️ Shopify Fall 2022 Developer Challenge Submission
Hey there 👋! My name is Judy and this is my submission to Shopify's Fall 2022 Developer Challenge!

**So you can skip the setup**: I've left a link to the repl.it demo in my application, where you can feel free to run the automated testing, and play around with the code!

I made an API using **Express** and **Node.js** that connected to a **MongoDB database**. In order to simplify things I also created schemas using **Mongoose**. 

**For more details on methods and routes available, skip to this section:** _[Using the API](#-using-the-api)_

## 👩‍💻 Set Up

1. Installation of technologies and dependencies needed
- First make sure to install [Node.js](https://nodejs.org/en/download/), I recommend the LTS version which is what I am using
- Download or clone this repository
- Then run `npm install` to install the dependencies
2. Creating a [MongoDB Database](https://www.mongodb.com/atlas/database) 
- Click start free now and create an account
- Follow the instructions to set up and create a cluster, user, and network access
- Click connect to application to get a connection string. It will look something like this: `mongodb+srv://<username>:<password>@cluster0.p6qpq.mongodb.net/yourDatabaseName?retryWrites=true&w=majority`
3. Adding an .env file
- Using the information of the database user (username, password), you may also add a port number
- An example of the contents of the file should look like the below, where the values such as name/password can be changed!

```
DB_USERNAME=name
DB_PASSWORD=password
PORT=3000
```
## 🏃 Running the server 
- Run `npm run dev` or `node server.js`
- A message saying `server listening on http://localhost:3000/` should pop up in the terminal
- Using Postman you can test routes and methods, or use the automated testing


## 💡 Using the API

#### Inventory Routes
| Method         | Route   | Description|
| ------------- |-------------|---|
| GET     | /inventory |Returns all inventory items|
| GET      | /inventory:inventoryID      |Returns inventory item by ID|
| GET | /inventory?warehouseID      | Returns inventory items by warehouse ID|
| POST | /inventory     |Creates an inventory item |
| PUT | /inventory:inventoryID   |Update an inventory item by ID|
| DELETE | /inventory      |Removes all inventory items|
| DELETE | /inventory:inventoryID      |Removes inventory item by ID|

#### Warehouse Routes
| Method         | Route   | Description|
| ------------- |-------------|---|
| GET     | /warehouse |Returns all warehouses|
| GET      | /warehouse:warehouseID     |Returns warehouse by ID|
| POST | /warehouse      | Creates warehouse|
| PUT | /warehouse:warehouseID      |Updates warehouse by ID |

## 🤖 Automated Testing
I made basic tests using jest and supertest, to run it use:
`npm run test`

## 📚 Stuff I Learnt
Since I have never used jest and supertest before I had to learn and watch YouTube videos in order to learn how to use it. I also learnt about GeoJSON data and how it can be used to query for locations near or in proximity to a longitude and lattidude!

## 😄 Next Steps
I think that with usage of GeoJSON points I can probably add a lot more features for querying to my MVP (minimum viable product). Overall I had a lot of fun learning new technologies and I'm excited to apply this to other projects I make soon in the future!
