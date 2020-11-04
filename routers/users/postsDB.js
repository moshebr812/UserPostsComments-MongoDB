// Connecting via DB Services
const expressSrv = require('express');
const routerSrv = expressSrv.Router();  // as we did myApp = expressSrv();
//
const { getPosts } = require ('../dbService');

// All
routerSrv.get('/' , async (request, response) =>{
    console.log(`\nrouterSrv=/postsDB  path="/"              postsDB = All `);
    console.log(' ===>>> using (await getPosts()) \n');
    const rowLimit = 5;
    const skipToRow = 15;
    (await getPosts())
        .find(
            { },
            {  
                limit: rowLimit,
                skip: skipToRow, 
            }  // END opitons
        )
        .toArray( (error, docs) => {
            // we could use res.json(docs) ==> expliciltly convert iy to json
            console.log (`                 postsId. rowLimit=${rowLimit}   docs.length=${docs.length}:   skip(to document #)=${skipToRow}`);
            response.json (docs);
        });
});

// by postId
routerSrv.get('/:id' , async (request, response) =>{
    const postId = request.params.id;
    console.log(`\n routerSrv=/postsDB    path="/:id"     postsDB   postId: ${postId} `);

    (await getPosts())
    .find(
        {id: parseInt(postId)  },
    )
    .toArray( (error, docs) => {
        // we could use res.json(docs) ==> expliciltly convert iy to json
        console.log (`postsDB by postId                 postId=${postId}   `);
        response.json (docs);
    });
});


module.exports = routerSrv;
