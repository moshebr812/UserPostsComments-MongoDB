// Connecting via DB Services
const expressSrv = require('express');
const routerSrv = expressSrv.Router();  // as we did myApp = expressSrv();
//
const { getComments } = require ('../dbService');

// All
routerSrv.get('/' , async (request, response) =>{
    console.log(`\ncommentsDB  path="/"              commentsDB = All `);
    console.log('===============>>> CALLING        (await getComments()) \n');
    const rowLimit = 10;
    const skipToRow = 51;
    (await getComments())
        .find(
            { },
            {  
                limit: rowLimit,
                skip: skipToRow, 
            }  // END opitons
        )
        .toArray( (error, docs) => {
            // we could use res.json(docs) ==> expliciltly convert iy to json
            console.log (`                 commentsDB.      rowLimit=${rowLimit}   docs.length=${docs.length}:   skip(to document #)=${skipToRow}`);
            response.json (docs);
        });
});

// by Id
routerSrv.get('/:id' , async (request, response) =>{
    const commentId = parseInt(request.params.id);
    console.log(`\ncommentsDB  path="/:id"              commentsId = ${commentId} `);
    console.log('===============>>> CALLING        (await getComments()) \n');
    (await getComments())
        .find(
            { id: commentId},
        )
        .toArray( (error, docs) => {
            response.json (docs);
        });
});

module.exports = routerSrv;