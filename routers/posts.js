// posts 
//      get All
//      get by id
//      delete by id
//      post (pass userId + id)
// get comments by post id


const expressSrv = require ('express')
const routerPostsSrv = expressSrv.Router();
const fileSrv = require ('fs');
//
const postsList = require('../db-mock/posts.json');
const commentsList = require ('../db-mock/comments.json');

// Get Full list of Posts
routerPostsSrv.get('/' , (request, response) =>{
    console.log('\n routerPosts  path="/"   posts.Count='+postsList.length);
    response.send (postsList);
});

// Get 1 post by id 
routerPostsSrv.get('/:id' , (request, response) =>{
    let postId = parseInt ( request.params.id );
    let idx = postsList.findIndex (element => element.id === postId);
    if (idx >= 0) {
        // entity found
        console.log(`\n routerPosts  path="/:id"  |postId: ${postId} |title...: ${postsList[idx].title}`);
    } else {
        console.log(`\n routerPosts  path="/:id"  |postId: ${postId} |post NOT FOUND. return {}`);
    }

    response.send (postsList[idx] ? postsList[idx] : {});
});

// Insert 1 new post
routerPostsSrv.post ('/', (request, response) => {
    console.log( `from posts. adding new post. method = ${request.method}.     `);
    console.log(`postsCount BEFORE: ${postsList.length}`)
    if (!request.body.id) {
        console.log(`INVALID data input for posts.POST `);
    } else {
        postsList.push (request.body);
        fileSrv.writeFileSync('./db-mock/posts.json', JSON.stringify (postsList) );
    }
    console.log ( `postsCount AFTER: ${postsList.length}`);
    response.send( postsList );
});

// Delete 1 post by its ID
routerPostsSrv.delete('/:id' , (request, response) =>{
    let postId = parseInt ( request.params.id );
    console.log(`\n routerPosts  path="/:id"  |postId to Del: ${postId} |counter BEFORE: ${postsList.length}`);
    let idxToDel = postsList.findIndex (ele => ele.id === postId);
    if (idxToDel < 0 ) {
        console.log (`Entity [${postId}] to del NOT FOUND`);
    } else {
        postsList.splice(idxToDel,1);
        fileSrv.writeFileSync('./db-mock/posts.json' , JSON.stringify (postsList) );
    }

    console.log(`......count AFTER: ${postsList.length}`);
    response.send (postsList);
});

// Get All Comments of a Specific postId
routerPostsSrv.get('/:id/comments' , (request, response) => {
    let postId = parseInt ( request.params.id );
    let filteredArray = commentsList.filter (element => element.postId === postId);
    console.log(`\n routerPosts  path="/:id/comments"  |postId: ${postId} |commentsCount: ${filteredArray.length}`);
    response.send (filteredArray);
});

// note in index.js I don't need to refer to the same name, all I have to do there is add a middleWare that will listen
//  from index.js ==>> myApp.use ("/posts", postsRouter);
module.exports = routerPostsSrv;