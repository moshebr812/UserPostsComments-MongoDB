// Services
const { response } = require('express');
const expressSrv = require('express');
const myApp = expressSrv();
const fileSrv = require ('fs');

// ============     MondoDB Service     =================//
// const mongoClientSrv = require('mongodb').MongoClient ({useUnifiedTopology: true});
// Can also use Destructuring
const {MongoClient} = require('mongodb'); // add this at .connect() : { useUnifiedTopology: true });
// the assert is requited for a Test
const assertSrv = require('assert');
// Mongo Server : for now run it locally
const mongoDbUrl = 'mongodb://localhost:27017'
const dbName = 'mosheStore';
const collectionName = 'products';


// Import routers.  Corresponds to modules.export = routerSrv
const usersRouter = require ('./routers/users');
const postsRouter = require ('./routers/posts');
const commentsRouter = require ('./routers/comments');
const productsRouter = require  ('./routers/mosheStore/products');
const brandsRouter = require  ('./routers/mosheStore/brands');
// 
const usersDBRouter = require  ('./routers/users/usersDB');
const postsDBRouter = require  ('./routers/users/postsDB');
const commentsDBRouter = require  ('./routers/users/commentsDB');
// Settings
const localPort = 8080;

console.clear();
console.log (`${"--".repeat(25)}\nProject: UserPostsComments-MongDB-Y\n${"--".repeat(25)}`);
console.log (`uVersion: 1.2 \\// listening on port: ${localPort} \n${"--".repeat(25)}`)

// reloadMockData();

// middlewhere that coverts valid json structures to JS Objects
myApp.set("myInternalRevision", '1.0.0.103');
myApp.set("json spaces", 3);
myApp.use(expressSrv.json());

// Testing the mongoDB Connection ==> note we must apply async when calling the DB Server
myApp.get('/mongoDbTest' ,async  (req, res) => {
    console.log (`route:   mongoDbTest    . dbName: ${dbName}.  collection: ${collectionName}`);
    // get an open connection to mongoDB
    const clientConnection = await MongoClient.connect(mongoDbUrl, {useUnifiedTopology: true});
    // select database
    const db = clientConnection.db(dbName);
    // select collection (table)
    const collection = db.collection (collectionName);
    
    
    // get the documents
    collection
        .find()
        // toArray is call back.
        .toArray( (error, docs) => {
            // we want to return a JSON to the Client
            // express will automatically convert the data to valid JSON
            // DON'T confuse with the middleware that consvert the incoming traffic 
            // Here we refer to the outgoing traffic
            // res.send (docs);
            
            // we could use res.json(docs) ==> expliciltly convert iy to json
            res.json (docs);
        });
}); // END get ('/mongoDbTest')


// Business REST API-S routers
// I must define the userRouter as a middleware, and it should handle only request with path prefix "/users"
// users using db-mock json files
myApp.use ("/users", usersRouter);
myApp.use ("/posts", postsRouter);
myApp.use ("/comments", commentsRouter);
// Access database mosheStore for products & Brands
myApp.use ("/mosheStore/products", productsRouter)
myApp.use ("/mosheStore/brands", brandsRouter);
// users using Mongo DB
myApp.use ("/usersDB", usersDBRouter);
myApp.use ("/postsDB", postsDBRouter);
myApp.use ("/commentsDB", commentsDBRouter);

// default path
myApp.get('/', (request, response) => {
    console.log('\n path="/"   loading html file.   myInternalRevision:   ' + myApp.get("myInternalRevision"));
    // find without filter will return the full data
    response.send('Hello Moshe - Test ....');
});


// Reload all mock data to the 3 files after we tested deletes etc
myApp.get('/reload-mockdata' , (req, res) => {
    console.log('\n path="/reload-mockdata"   read mcok data from jsonplaceholder SITE');
    reloadMockData();
    res.send(' AFTER reloading 3 mock data files \n must restart the service on node');
}); 

myApp.listen(localPort);


function  reloadMockData  ()  {
    // reload all 3 files from the orginal files.
    // 
    let tmpArray = require('./db-mock/users-org.json');
    fileSrv.writeFileSync ('./db-mock/users.json', JSON.stringify(tmpArray));
    console.log (`reloadMockData:  |users: ${tmpArray.length}`);
    //
    tmpArray = require('./db-mock/posts-org.json');
    fileSrv.writeFileSync ('./db-mock/posts.json', JSON.stringify(tmpArray));
    console.log (`reloadMockData:  |posts: ${tmpArray.length}`);
    // 
    tmpArray = require('./db-mock/comments-org.json');
    fileSrv.writeFileSync ('./db-mock/comments.json', JSON.stringify(tmpArray));
    console.log (`reloadMockData:  |comments: ${tmpArray.length}`);

    // ======
    console.log ('\n\n MUST RESTART NODE on FILE to Apply');
}
