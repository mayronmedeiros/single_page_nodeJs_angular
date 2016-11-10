//set up
var express= require('express');
var app = express(); //cria nossa aplicação
var mongoose = require('mongoose'); // mongoose do mongoDB
var morgan = require('morgan'); // gera logs para o nosso console (express4)
var bodyParser = require('body-parser'); // impurra a informação do HTML POS T(express4)
var methodOverride = require('method-override'); // simula o DELETE e o PUT (express4)


//configuração

mongoose.connect('mongodb://admin:pass@ds149577.mlab.com:49577/single_page'); //endereço do nosso banco de dados


app.use(express.static(__dirname + '/public')); //obtem os arquivos dentro da pasta public
app.use(morgan('dev')); //regitra as solicitações no console
app.use(bodyParser.urlencoded({'extended':'true'})); // analisa nossa aplicação / x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());


//definir modelo no mongoDB
var Todo = mongoose.model('Todo',{
    text: String
});




//rotas

//api
//obtem todos todos

app.get('/api/todos', function(req, res){
    Todo.find(function(err, todos){
        if(err)
            res.send(err)
        res.json(todos);
    });
});

app.post('/api/todos', function(req, res){
    Todo.create({
        text: req.body.text,
        done: false
    }, function(err, todo){
        if(err)
        res.send(err);

        Todo.find(function(err, todos){
            if(err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.delete('/api/todos/:todo_id', function(req, res){
    Todo.remove({
        _id: req.params.todo_id
    }, function(err, todo){
        if(err)
            res.send(err);

        Todo.find(function(err, todos){
            if(err)
                res.send(err)
            res.json(todos);
        });
    });
});

 app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


//inicia nosso app na porta 8080
app.listen(8080);
console.log('iniciado em localhost porta 8080');

