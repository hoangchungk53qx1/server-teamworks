const app = require('../../app')

//404 nott found
app.use((req,res,next)=>{
    next({
        code:404,
        data:null
    })
});

//Handle error
app.use((error,req,res,next)=>{
    return res.status(400).json(error);
});