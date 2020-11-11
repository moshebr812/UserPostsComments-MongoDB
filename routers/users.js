// NOTE THE module.exports to the new routerSrv
// Services 
const expressSrv = require('express');
const routerSrv = expressSrv.Router();  // as we did myApp = expressSrv();
const fileSrv = require('fs');
// const { getDummy } = require ('./dbService');
// const { getUsers } = require ('./dbService');
// const { getBrands } = require ('./dbService');

usersList =[];
postsList =[];

usersList = require('../db-mock/users.json');
postsList = require('../db-mock/posts.json');



// Users API
// routerSrv.get('/users' , (request, response) =>{
routerSrv.get('/' , (request, response) =>{
    console.log(`\n routerSrv=Users  path="/"   |usersCount= ${usersList.length}`);
    
    // let check = getDummy();
    // console.log (' ----- ' + check);

    // (await getBrands())
    // .find(
    //     {},
    //     { limit: 0, }  // 0 means NO LIMIT
    // )
    // .toArray( (error, docs) => {
    //     // we could use res.json(docs) ==> expliciltly convert iy to json
    //     response.json (docs);
    // });

    // (await getUsers())
    //     .find ({}) // all data
    //     .toArray ( (err, data) => {
    //          response.json (data);
    //     });
    
    response.send( usersList );   // I loaded all arrays via reloadMockData();
});

// routerSrv.get('/users/:id/posts' ,(request, response) => {
routerSrv.get('/:id/posts' ,(request, response) => {
    let userId = parseInt(request.params.id);
    let filteredPosts = postsList.filter (object => object.userId === userId);
    console.log(`\n routerSrv=Users   path="/:id/posts"  |userId: ${userId} |filteredPosts.length: ${filteredPosts.length}`);
    response.send(filteredPosts);
})

// Standard Insert. method: POST.  body:  objet in a Valid in JSON Format
routerSrv.post('/', (request, response) => {
    // Debug
    console.log (`/users/posts.   request.method: ${request.method}`);
    if (request.body.id) {  // valid request input
        console.log('---- VALID body\n' + JSON.stringify ( request.body ) );
        usersList.push( request.body );
    } else {  // use mock data
        console.log (` invalid data on body. Inserting mockdata \n${mockNewUser}`);
        usersList.push( mockNewUser );
    }

    fileSrv.writeFileSync('./db-mock/users.json', JSON.stringify(usersList));
    console.log(`POST .... usersList.length after post:  ${usersList.length}`)
    // New Array
    response.send(usersList); // Send the new Array, including tne new Insert
});

// read=get,  delete=delete,  insert=post for/users/:id ==>> Can use a common route
routerSrv.route('/:id')
    // routerSrv.get('/users/:id' , (request, response) =>{     // the "user"  is defined in index.js
    // routerSrv.get('/:id' , (request, response) =>{           // this section is now common get/delete/put which will be using /:id
    .get( (request, response) => {
            let userId = request.params.id;     // user id from URL
            let userIndex = usersList.findIndex (object => object.id == userId);  // location of user in Array
            let userName = '';
            if (userIndex>=0) {
                userName = usersList[userIndex].name; // user name, assuming here we found the userId in the Array
            } else {
                userName = `user by id ${userId} NOT FOUND`;
            }    
        
            console.log(`\n routerSrv=Users  .get("/:id")  |indexLocation: ${userIndex}   |userId: ${userId}  |userName: ${userName}`);
            response.send( usersList[userIndex] );
    })  // without ;
    // routerSrv.get('/:id', (request, response) =>{
    .delete( (request, response) =>{
            let userId = parseInt(request.params.id);
            console.log(`\n routerSrv=Users   delete path="/:id"  |method: ${request.method}  |userId: ${userId} |countBefore: ${usersList.length}`);
            let idxToDel = usersList.findIndex (object => object.id == userId);  // location of user in Array
            if (idxToDel >= 0) {
                usersList.splice (idxToDel, 1);
                console.log(`\n routerSrv=Users   DELETE  |countAfter Delete: ${usersList.length}`);
                fileSrv.writeFileSync('./db-mock/users.json', JSON.stringify (usersList) );
            }  else {
                console.log(`\n routerSrv=Users   userId to delete NOT FOUND. No Changes  |countAfter: ${usersList.length}`);
            }
            response.send(usersList);   // the list after the delete
    })
    .put((request, response) => {
        // put for UPDATE = replace all fields
        let idToUpdate = parseInt(request.params.id);
        console.log (`.put() /users/:${idToUpdate}   .....   for replace (update) |userId: ${idToUpdate}    |method: ${request.method}`);
        
        let idxNumber = usersList.findIndex (element => element.id === idToUpdate);
        if (idxNumber >= 0) {
            // full update ==>> replave object at location X in the array
            usersList[idxNumber] = request.body;
            console.log(`\n ..... PUT (replace) userId ${idToUpdate} at index ${idxNumber} \n ${JSON.stringify(request.body)}`);
            // commit to file
            fileSrv.writeFileSync('./db-mock/users.json', JSON.stringify ( usersList ) );
        }  else {
            console.log(`\n ..... in PUT:  Entity for Update NOT FOUND`);
        }
        // return the full new array
        return response.send(usersList);
    })
    .patch( (req, res) =>{
        let idToUpdate = parseInt(req.params.id);
        console.log (`BODY content for PATH .... ${JSON.stringify(req.body)}`)
        
        let idxNumber = usersList.findIndex (element => element.id === idToUpdate);
        console.log (`\n .patch()  /users/${idToUpdate}    (userId is taken from req.params.name)   |idx after findIndex: ${idxNumber}`);

        if (idxNumber >= 0) {
            
            console.log ('Checking which fields passed in req.body using "for (element in req.body {bla bla) )"' );

            let c=0;
            for (element in req.body) {
                console.log (`${++c}  key=element ==> ${element}   |value=req.body[element] ==> ${req.body[element]}`);
                // and now we can update the usersList Array
                usersList[idxNumber][element] = req.body[element];
            } 
            // Additional ways to Access object req.body:
            fileSrv.writeFileSync('./db-mock/users.json', JSON.stringify ( usersList) ); 
            console.log ('DONE .patch() - writeFileSync');
          
        }  else {
            console.log(`\n ..... in PATCH:  Entity ${idToUpdate} for Update NOT FOUND !!!`);
        }


        // For Debug I retun only the update element. return {} when id NOT FOUND on array
        res.send (  (idxNumber>=0)? usersList[idxNumber] : {} );
        // Inreality need to return all
        // res.send (usersList);
    });

//====================================================
function  usersReloadMockData  ()  {
    console.log ('users.js --> usersReloadMockData()')
    // reload users array
    let tmpArray = require('../db-mock/users-org.json');
    fileSrv.writeFileSync ('../db-mock/users.json', JSON.stringify(tmpArray));
    usersList = tmpArray;
    // reload posts array
    tmpArray = require('../db-mock/posts-org.json');
    fileSrv.writeFileSync ('../db-mock/posts.json', JSON.stringify(tmpArray));
    postsList = tmpArray;
    console.log (`reloadMockData:  |users: ${usersList.length}  |posts: ${postsList.length}`);
}

const mockNewUser  =
{
    "id": 808080,
    "name": "Moshe Test Braude",
    "username": "DoItNow",
    "email": "aaa@mmm.com",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  }
// //====================================================
module.exports = routerSrv;


//  ==================           This will work, but its a very primitve way to check which fields were passed in teh BODY
// function fieldsInReqBody (reqExample) {
//     console.log ('Checking each field name using      req.body.fieldName ')

//     // Practice the various options on field name
//     if (req.body.name == undefined) {
//         console.log (`users.PATCH  updating field |name|    req.body.name == undefined, I assume FIELD WAS NOT send in request.body`);
//     }    

//     if (req.body.name != undefined) {
//         console.log (`users.PATCH  updating field |name: ${req.body.name}   field was sent in request.body`);
//         usersList[idxNumber].name = req.body.name;
//     }

//     if (req.body.name === null) {
//         console.log (`users.PATCH  updating field |name: ${req.body.name}   --> input value is NULL`);
//     }
        
//     if (req.body.name === '') {
//         console.log (`users.PATCH  updating field |name: ${req.body.name}   --> input value is "" EMPTY `);
//         // note in the JSON empty is --> "fieldName": ""   |||  while '' is a value passed as "fieldName": "''"
//         // "fieldName": ''  ---> compilation error
//     }
            
//     // field username
//     if (req.body.username != undefined) {
//         console.log (`users.PATCH  updating field |name: ${req.body.username}`);
//         usersList[idxNumber].username = req.body.username;
//     };

//     // field email    
//     if (req.body.email != undefined) {
//         console.log (`users.PATCH  updating field |name: ${req.body.email}`);
//         usersList[idxNumber].email = req.body.email;
//     }
// }