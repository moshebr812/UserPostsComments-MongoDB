// comments
// get comments by id

const expressSrv = require ('express')
const routerComments = expressSrv.Router();
//
const commentsList = require ('../db-mock/comments.json') || [];

// The actual rest API
routerComments.get('/' , (request, response) =>{
    console.log('\n routerComments  path="/"   comments.Count='+commentsList.length);
    response.send (commentsList);
});

routerComments.get('/:id' , (request, response) =>{
    let commentId = parseInt ( request.params.id );
    let idx = commentsList.findIndex (element => element.id === commentId);
    if (idx < 0) {
        console.log (`\n routerComments  path="/:id"  NOT FOUND for id=${commentId}`  );
        response.send ( {} )
    } else {

        console.log(`\n routerComments  path="/:id"  |commentId: ${commentId} found at index: ${idx} |email...: ${commentsList[idx].email}`);
        // return the specific Object found
        response.send (commentsList[idx]);
    }
});

routerComments.delete('/:id' , (request, response) => {
    let commentId = parseInt ( request.params.id );
    let idxToDel = commentsList.findIndex ( obj => obj.id === commentId);
    if ( idxToDel < 0 ) {
        console.log (`\n routerComments.delete  path="/:id"  NOT FOUND for DELETE id=${commentId}`  );
        response.send ( {} )
    } else {
        commentsList.splice(idxToDel, 1);
        console.log (`\n routerComments.delete  path="/:id" DELETED id=${commentId}`  );
        // new array after delete 
        response.send ( commentsList );
    }
});

module.exports = routerComments;