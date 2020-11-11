const { response } = require('express');
const {MongoClient} = require('mongodb') ; //. useUnifiedTopology: true);

// Mongo Server : for now run it locally
const mongoDbUrl = 'mongodb://localhost:27017'
// 
const dbStore = 'mosheStore';
const dbUsers = 'usersChats';


/*  the basic 3 steps 
    const clientConnection = await MongoClient.connect('mongodb://localhost:27017') ; // , {useUnifiedTopology: true});
    const db = clientConnection.db('mosheStore');
    const collection = db.collection ('products');
*/
async function dbConnect(dbName, tableName) {
    const clientSrv = await MongoClient.connect (mongoDbUrl);
    const dbClient = clientSrv.db (dbName);  // keep flexibility to define DB name 
    const dbCollection = dbClient.collection ( tableName );
    return dbCollection;
}

//  ==============  database usersChats =====================//
function getUsers() {
    // Returns the Collection
    let temp = dbConnect ( dbUsers, 'users');
    return temp;
}

// this is fully implemented usersDB 
function deleteUserById(idToDel) {
    console.log ('NOT IMPLEMENTED')
    return 'NOT IMPLEMENTED';
}

//add sycn as we must await calling getUsers for DB connection
async function deleteAllUsers() {
    console.log ('FROM:     dbService.deleteAllUsers()   ===== START ====== ');
    // get connection to the Collection
    console.log ('type of  (getUsers) is = ' + typeof getUsers);
    
    let tablePointer = await getUsers();
    // must use await here as well if u want to read the status & deletedCount
    let delStatus = await tablePointer.deleteMany ({});
    console.log ( `deleteMany (deleted status) : ${delStatus.result.ok }`); // note the "acknowledge is not found"
    console.log ( `deleteMany (deletedCount =  ) : ${delStatus.deletedCount }`);
    
    console.log ('FROM:     dbService.deleteAllUsers()   ===== AFTER DEL ====== ');
    return delStatus;
}

function getPosts () {
    let temp = dbConnect ( dbUsers, 'posts');
    return temp;
}

function getComments () {
    let temp = dbConnect (dbUsers, 'comments');
    return temp;
}

async function deleteAllPosts () {
    console.log (`${"-".repeat(25)}\n FROM:   dbService.js   deleteAllPosts.  START..... function is async`);
    let tablePointer = await getPosts();
    let delStatus = await tablePointer.deleteMany ( {userId: 3} );
    console.log (`ret.result:ok? ${delStatus.result.ok} `);
    console.log (`ret.deletedCount? ${delStatus.deletedCount} `);
    console.log (`FROM:   dbService.js   deleteAllPosts.  END....... function is async  \n${"-".repeat(25)}`);
    return (delStatus);
}

//  ==============  database mosheStore  =====================//

//async function getProducts() {        // done locally in products.js as a  exmaple
    // Returns the Collection
    // return (await dbConnect ( dbStore, 'products'));
// }

function getBrands() {
    // Returns the Collection
    let temp = dbConnect ( dbStore, 'brands');
    return temp;
}

function getDummy() {
    return 'getDummy() -->> Testing connection this Service';
}

//===================================================================
module.exports = { 
    dbConnect,          // allow direct use
    //
    // getProducts,        // for "products"
    getBrands,
    //
    getUsers,
    deleteUserById,     // delete a single user: NOT IMPLEMENTED
    deleteAllUsers,     // delete all docs in collection
    //
    getPosts,
    getComments,
    deleteAllPosts,     // delete all docs in collection posts
    // ...
    getDummy,
} ; 

