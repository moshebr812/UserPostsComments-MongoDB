// Connecting via DB Services
const expressSrv = require('express');
const routerSrv = expressSrv.Router();  // as we did myApp = expressSrv();
//
const { getUsers } = require ('../dbService');

routerSrv.get('/' , async (request, response) =>{
    console.log(`\n routerSrv=/ usersDB  path="/"              userDB = All `);
    console.log(' ===>>> using (await getUsers()) \n');

    (await getUsers())
        .find(
            { },
            {   projection: {
                    name: 1, username: 1, email:1, 
                    address: { street: 1, city: 1, }, 
                },  // END projection
                limit: 4, 
            }  // END opitons
        )
        .toArray( (error, docs) => {
            // we could use res.json(docs) ==> expliciltly convert iy to json
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


module.exports = routerSrv;
