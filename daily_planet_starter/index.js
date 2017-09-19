var express = require('express');
var partials = require('express-partials'); // https://github.com/publicclass/express-partials
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

app.use(partials());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));

var articles = [
    { title: 'Bernie! Bernie!', body: '#feelthebern' },
    { title: 'Trump for change!', body: 'Make America Great Again' },
    { title: 'Brian Hague founds the Daily Planet', body: 'Wow! Amazing! Such good news!' }
];

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/articles', function(req, res) {
    res.render('articles/index', { articles: articles });
});

app.get('/articles/new', function(req, res) {
    res.render('articles/new');
});

app.get('/articles/:index', function(req, res) {
    var index = parseInt(req.params.index);
    if (index < articles.length && index >= 0) {
        res.render('articles/show', { article: articles[req.params.index] });
    } else {
        res.send('Error');
    }
});

app.post('/articles', function(req, res) {
    articles.push(req.body);
    res.redirect('/articles');
});

app.get('/about', function(req, res) {
    res.render('about');
});

app.delete('/articles/:id', function(req, res) {
   var delIndex = req.params.id;
   delIndex = parseInt(delIndex);
     articles.splice(delIndex,1);
   });
 
  app.get('/articles/:id/edit', function(req,res) {
      var index = req.params.id;
      res.render('articles/:id/show', {})
     
  });
 
 app.get('/articles/edit/:idx', function(req, res) { //express to show route for animals (show one more animal) -- :idx = paramater, which animal to talk about
     var edit = req.params.idx; //get animals
     edit = JSON.parse(edit); //parse list of animals
     var articleIndex = parseInt(req.params.idx); //get array index from url paramater
     res.render('articles/edit/:idx', {articles: articles[articleIndex], id: articleIndex}); //render page with data of the specified animal
 });
 app.post('/articles/:idx', function(req, res) { //backend -- express route
     var articles = fs.readFileSync('./index.ejs'); //read animals file
     articles = JSON.parse(articles); 
     articles.push(req.params.idx); //push item to animals array
     fs.writeFileSync('./index.ejs', JSON.stringify(articles)); //save animals to the data.json file //stringify is opposite of JSON.parse
     res.redirect('/articles/:index'); //redirect to the GET /animals route (index)
 });

app.listen(3000, function() {
    console.log("You're listening to the smooth sounds of port 3000 in the morning");
});
