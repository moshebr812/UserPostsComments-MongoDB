// Connecting via DB Services
const expressSrv = require('express');
const routerSrv = expressSrv.Router();  // as we did myApp = expressSrv();
//
// const {MongoClient} = require('mongodb') ; //. useUnifiedTopology: true);
// no need to require mongo --> use this service 
const { getProducts, getBrands, getUsers } = require ('../dbService');

const mongoDbURL = 'mongodb://localhost:27017';

routerSrv.get('/' , async (request, response) =>{
    console.log(`\n routerSrv=/mosheStore/brand  path="/"   All `);
    console.log('\n ===>>> using (await getBrands()) Since dbConnect returns a promise');

    (await getUsers())
        .find(
            {},
            { limit: 0, }  // 0 means NO LIMIT
        )
        .toArray( (error, docs) => {
            // we could use res.json(docs) ==> expliciltly convert iy to json
            response.json (docs);
        });
});

routerSrv.get('/:id' , async (request, response) =>{
    const brandId = request.params.id;
    console.log(`\n routerSrv=/mosheStore/brands    path="/:id"   brandId: ${brandId} `);

    (await getBrands())
        .find(
             {
                 id: parseInt(brandId)
             },  // END if
             {   // start options
                projection: {
                    id: 1,
                    productId: 1,
                    brand: 1,
                    startYear: 1, 
                }, // end projection
                limit: 1, // not really relevant when using id
            }   // END options
        )
        .toArray( (err, docs) => {
            console.log ('returned rows: '+docs.length);
            response.json (docs);
        })
});


module.exports = routerSrv;
