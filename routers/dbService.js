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

//  ==============  usersChats
function getUsers() {
    // Returns the Collection
    let temp = dbConnect ( dbUsers, 'users');
    return temp;
}

function getPosts () {
    let temp = dbConnect ( dbUsers, 'posts');
    return temp;
}

function getComments () {
    let temp = dbConnect (dbUsers, 'comments');
    return temp;
}
//  ==============  mosheStore
async function getProducts() {
    // Returns the Collection
    return (await dbConnect ( dbStore, 'products'));
}

function getBrands() {
    // Returns the Collection
    let temp = dbConnect ( dbStore, 'brands');
    return temp;
}

function getDummy() {
    return 'Test=1';
}
module.exports = { 
    dbConnect,          // allow direct use
    //
    getProducts,        // for "products"
    getBrands,
    //
    getUsers,
    getPosts,
    getComments,
    //
    getDummy,
} ; 

