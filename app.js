const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Item = require('./models/items');

app.use(express.urlencoded({extended:true}));
const mongodb = 'mongodb+srv://todoapp:todoapp@cluster0.bx0o7.mongodb.net/item-database?retryWrites=true&w=majority';
mongoose.connect(mongodb,{useCreateIndex:true,useFindAndModify:true,useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("connected");
    app.listen(3000);
}).catch(err=>console.log(err))

app.set('view engine','ejs');


app.get('/',(req,res)=>{
    res.redirect('/get-items');
});

app.get('/create-item',(req,res)=>{
    const item = new Item({
        name:'phone',
        price:1000
    });
    item.save().then(result=>res.send(result));
})

app.get('/get-items',(req,res)=>{
    Item.find().then(result=>
        res.render('index',{items:result}))
        .catch(err=>console.log(err));
})

app.get('/add-item',(req,res)=>{
    return res.render('add-item');
})

app.post('/items',(req,res)=>{
    const item = new Item(req.body);
    item.save().then(()=>{
        res.redirect('/get-items');
    }).catch(err=>console.log(err));
})

app.get('/items/:id',(req,res)=>{
    Item.findById(req.params.id).then(result=>{
        console.log(result);
        res.render('item-detail',{item:result});
    })
})

app.delete('/items/:id',(req,res)=>{
    Item.findByIdAndDelete(req.params.id).then(result=>{
        res.json({redirect:'/get-items'});
    })
})

app.put('/items/:id',(req,res)=>{
    Item.findByIdAndUpdate(req.params.id,req.body).then(result=>{
        res.json({msg:'updated successfully'});
    })
})

app.use((req,res)=>{
    return res.render('error');
})