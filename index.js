// import your node modules
const express = require('express');

const db = require('./data/db.js');

const server = express();
const parser = express.json();
const PORT = 4000;


server.use(parser)
// add your server code starting here

server.get('/api/posts', (req, res) => {
    db.find()
        .then((posts)=>{
            res.json(posts)
        })
        .catch(err =>{
            res.status(500)
                .json({error:'The posts information could not be retrieved.'})
        })
})

server.get('/api/posts/:id', (req, res) =>{
    const { id } = req.params;
    db.findById(id)
        .then(post => {
            console.log('post',post.length)
            if(post.length > 0){
                res.json(post);
            } else{
                res.status(404)
                .json({message: "The post with the specified ID does not exist."})
                
            }
            
        })
        .catch(err => {
            res
                .status(500)
                .json({error: "The post information could not be retrieved."})
        })
});

server.post('/api/posts', (req, res) => {
    const post  = req.body;
    console.log(post)
    if(post.title && post.contents){
        console.log('post from body', post.name);
        db.insert(post)
        .then(idInfo =>{
            db.findById(idInfo.id)
            .then(post =>{
                console.log('user from findbyid method', post);
                res.status(201).json(post);
            })
            
        }).catch(err => {
            res
                .status(500)
                .json({message:"failed to insert post in db"})
        }); 
    } else {
        res.status(400).json({ message:"missing title or content"})
    }
    
})

server.delete('/api/posts/:id', (req, res)=>{
    const {id} = req.params;
    console.log(req.params);
    db.remove(id).then(count =>{
        console.log(count)
        if(count){
            res.json({message: "successfully deleted"});
        } else{
            res.status(400)
                .json({message: "failed to delete post"})
        }
    })
})

server.put('/api/posts/:id', (req, res)=>{
    const { id } = req.params;
    const post = req.body;
    if(post.title && post.contents){
        console.log(id, post)
        db.update(id, post).then(count =>{
            if(count){
                console.log('count', count)
                db.findById(id).then(post =>{
                    res.json(post)
                })
            }else {
                res.status(400)
                    .json({message: 'The post with the specified ID does not exist.'})
            }
        }).catch(err =>{
            res.status(500)
                .json({error: "The post information could not be modified."})
        })
    }else {
        res.status(400)
            .json({errorMessage: "Please provide title and contents for the post."})
    }
})
    
//listening 

server.listen(PORT, () => {
    console.log(`server is up and running on port ${PORT}`)
})