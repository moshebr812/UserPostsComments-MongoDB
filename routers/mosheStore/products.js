// Accessing database locally in each function
const expressSrv = require('express');
const routerSrv = expressSrv.Router();  // as we did myApp = expressSrv();
//
const {MongoClient} = require('mongodb') ; //. useUnifiedTopology: true);
const mongoDbURL = 'mongodb://localhost:27017';

// routerSrv.get('/mosheStore/products' , (request, response) =>{
routerSrv.get('/' , async (request, response) =>{
    console.log(`\n routerSrv=/mosheStore/products  path="/"   My Test `);

    const clientConnection = await MongoClient.connect('mongodb://localhost:27017') ; // , {useUnifiedTopology: true});
    const db = clientConnection.db('mosheStore');
    const collection = db.collection ('products');

    // let collection = getDbConnection ('mosheStore','products');
    console.log ('after  calling getDbConnection(dbName, CollectionName)');
    // console.log ('removed call to establishDbConnection(dbName, CollectionName)');
    collection
        .find()
        .toArray( (error, docs) => {
            // we could use res.json(docs) ==> expliciltly convert iy to json
            response.json (docs);
        });
});

// get from Products list by family (Name)
routerSrv.get('/family/:familyName' , async (request, response) =>{
    let familyName = request.params.familyName;
    console.log(`\n path = /mosheStore/products/family/:familyName   ${familyName} `);

    const clientConnection = await MongoClient.connect('mongodb://localhost:27017') ; // , {useUnifiedTopology: true});
    const db = clientConnection.db('mosheStore');
    const collection = db.collection ('products');

    // let collection = getDbConnection ('mosheStore','products');
    console.log ('after  calling getDbConnection(dbName, CollectionName)');
    // console.log ('removed call to establishDbConnection(dbName, CollectionName)');
    collection
        .find(
            {family: familyName},
        )
        .toArray( (error, docs) => {
            // we could use res.json(docs) ==> expliciltly convert iy to json
            response.json ( docs );
        });
});

routerSrv.get('/:id' , async (request, response) =>{
    let productId = parseInt( request.params.id );
    console.log(`\n path = /mosheStore/products/:id   ${productId} `);

    const clientConnection = await MongoClient.connect('mongodb://localhost:27017', {useUnifiedTopology: true});
    // select database
    const db = clientConnection.db('mosheStore');
    // select collection (table)
    const collection = db.collection ('products');
    // get the documents
    
    collection
        .find({
            id: productId,
        })
        // toArray is call back.
        .toArray( (error, docs) => {
            // we could use res.json(docs) ==> expliciltly convert iy to json
            response.json (docs);
        });
});

//===================================================================
module.exports = routerSrv;
