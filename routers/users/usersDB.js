// Connecting via DB Services
const { response } = require('express');
const expressSrv = require('express');
const routerSrv = expressSrv.Router();  // as we did myApp = expressSrv();
//
const { getUsers, deleteAllUsers } = require ('../dbService');
// this is to inject into MongoDB the mockdata from json files
const userMockData = require('../../db-mock/users.json');
function lineSplit() {
    return (`\n${"-".repeat(50)}`);
}
routerSrv.get('/ReloadAllCollections' , async (request, response) =>{
    console.log(`${lineSplit()}\nReloading all MongoDB collections from JSON Files ${lineSplit()}`);
    response.json ('Done');
});

routerSrv.get('/' , async (request, response) =>{
    console.log(`\n routerSrv=/ usersDB  path="/"              userDB = All `);
    console.log(' ===>>> using (await getUsers()) \n');

    (await getUsers())
        .find(
            { },
            {   projection: {
                    id: 1,
                    name: 1, username: 1, email:1, 
                    address: { street: 1, city: 1, }, 
                },  // END projection
                limit: 0, 
            }  // END opitons
        )
        .toArray( (error, docs) => {
            // we could use res.json(docs) ==> expliciltly convert iy to json
            console.log (`.....................getUsers returns:   ${docs.length}   records.`)
            response.json (docs);
        });
});

routerSrv.get('/:id' , async (request, response) =>{
    const userId = request.params.id;
    console.log(`\n routerSrv=/usersDB    path="/:id"     userDB   id: ${userId} `);

    (await getUsers())
        .find(
             {
                 id: parseInt(userId)
             },  // END if
             {   // start options
                projection: {
                    id: 1,
                    name: 1,
                    username: 1,
                }, // end projection
                limit: 0, // no limit
            }   // END options
        )
        .toArray( (err, docs) => {
            console.log ('returned rows: '+docs.length);
            response.json (docs);
        })
});

// Option 1: the full code is in usersDB.js  --> not as good as each developer has to 
// handle the full "getUsers & then the deleteOne"
routerSrv.delete('/:id' , async (request, response) =>{
    // Must use pasrseInt (userIdToDel).  If not -->> NO error raised, by MongoDB will NOT find the record to DEL
    const userIdToDel = parseInt (request.params.id);
    console.log (`\n usersDB.delete(/:id)   userIdToDel: ${userIdToDel} `);
    try {
        (await getUsers())
            .deleteOne (
                // {id: userIdToDel}
                {id: userIdToDel}
            );
            response.json ('After Deleting user ID = ' + userIdToDel);
    }   catch  (err) {
        console.log ('ERROR:  ' + err);
    }
}); // END delete 1

// Option 2:    the full code is in dbService.js
//              the recommended way
routerSrv.delete('/' , async (request, response) => {
    console.log (`FROM:    usersDB.js   PATH: '/'     BEFORE   dbService.deleteAllUsers()`);
    const dataAfterDel = deleteAllUsers();
    response.json('AFTER calling deleteAllUsers.        Data Left? ' + JSON.stringify(dataAfterDel));    
    console.log (`FROM:    usersDB.js   PATH: '/'     AFTER   dbService.deleteAllUsers()  \n returned object: ${JSON.stringify(dataAfterDel)} \n\n`);
});

routerSrv.post('/' , async (request, response) => {
    console.log (`\n ${"x".repeat(35)} \npost(/)   request body content \n ${JSON.stringify(request.body)}`);
    try {
        (await getUsers()) // pointer to table
            .insertOne (request.body  , (error, newDoc) => {

                console.log (`\n ${"x".repeat(35)} - Information After Insert: `);
                console.log (`Insert status: result.ok=${newDoc.result.ok}`)
                console.log (`Number or documents inserted : result.n=${newDoc.result.n}`)
                console.log (`MongoDB _id .... insertedId:  ${newDoc.insertedId}`);
                console.log ('MongoDB returned Object \n' + newDoc);
                // What we write here is what will be returned to the Client.
                // So we return the new MongoDB _id
                response.json ({newId: newDoc.insertedId});
                
            });
        } catch (error) {
            console.log (`Error : ${error}`);
        }
});


// Yogev-Q2
routerSrv.post('/FileToDB' , async (request, response) => {
    
    console.log (JSON.stringify(userMockData));
    (await getUsers())
        .insertMany (
            // reload our mock-data example
            userMockData,
            // Manual Example
            // [   {id: 77, name: "Zombi"},
            //     {id: 88, name: "Musa"},
            //     {id: 99, name: "Lili"}
            // ], 
            (error, retObject) => {
                if (error) {
                    console.log ('------------------------------------');
                    console.log ('ERROR OCCURRED IN users.insertMany() \n'+error);
                    response.json(error.message);
                } else {
                  console.log (`\n${"x".repeat(25)} \nAfter insertMany().  returned Object as is: \n${JSON.stringify(retObject)}\n`);
                  console.log (`status result.ok: ${retObject.result.ok}`);
                  console.log (`number of inserts result.n: ${retObject.result.n}`);
                  console.log (`new Ids: number of inserts result.n: ${retObject.result.n}`);
                }
            }  // end handle of callback
        ) // end insertMany()
    console.log ('usersDB.post/FileToDB  --> Reload users.json to MongoDB');
    response.json ('reload mock-data file users.json into MongoDB');
});



//===================
routerSrv.get('/' , async (request, response) =>{
    console.log(`\n routerSrv=/ usersDB  path="/AAA"              userDB = All `);
    console.log(' ===>>> using (await getUsers()) \n');

    (await getUsers())
        .find(
            { },
            {   projection: {
                    id: 1,
                    name: 1, username: 1, email:1, 
                    address: { street: 1, city: 1, }, 
                },  // END projection
                limit: 0, 
            }  // END opitons
        )
        .toArray( (error, docs) => {
            // we could use res.json(docs) ==> expliciltly convert iy to json
            console.log (`.....................getUsers returns:   ${docs.length}   records.`)
            response.json (docs);
        });
});

routerSrv.get('/countUsers/a' , async (request, response) => {
    
    console.log (`\n ${"x".repeat(35)} /usersDB/count --> returns Promise`);
    (await (getUsers))
        .count()
        .then(numDocs => {
            console.log(`${numDocs} documents match the specified query.`)
            response.json (`learn how to use count : ${numDocs}`);
        })
        .catch(err => console.error("Failed to count documents: ", err))
    
        response.json (`learn how to use count : ${numDocs}`);


        // console.log (`\n ${"x".repeat(35)} - Information After Count: `);
        // console.log (`Insert status: result.ok=${JSON.stringify (newDoc) }`)
        // console.log (`Number or documents inserted : result.n=${newDoc.result.n}`)
        // console.log (`MongoDB _id .... insertedId:  ${newDoc.insertedId}`);
        // console.log ('MongoDB returned Object \n' + newDoc);
        // What we write here is what will be returned to the Client.
        // So we return the new MongoDB _id
    //     response.json ({'from .count': 'sss'});
        
    // });
}); // END get /count

module.exports = routerSrv;
