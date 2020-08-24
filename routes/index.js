var express = require('express');
var router = express.Router();

//require('C://Users//Torp//Documents//Try//create_Mysql_con_table.js'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST method route
router.post('/URL', function (req, res) {

		const mysql      = require('mysql');
		const connection = mysql.createConnection({
		  host     : 'rafaelgiordano-mysql-app',
		  //host     : 'localhost',
		  port     : '3306',
		  user     : 'root',
		  password : 'root',
		  //password : '',
		  database : 'linksibm'
		});

		connection.connect(function(err){
		  if(err) return console.log(err);
		  //console.log('conectou! de novo');
		  createTable(connection);
		  //addRows(connection, "link", "origin");
		  //connection.end();//fecha a conexão
		
			
	     //console.log('entrou post');
	     const cheerio = require('cheerio');
		 const rp = require('request-promise');
			//console.debug('entrou post');

		    var url = req.body.inputURL;
		    //console.log("URL before: " + url);
			if (url[0] != 'h'){
				url = 'https://' + url;
			}
	     	//console.log("URL main: " + url);

	     	//get links
	     	rp(url).then(html => {
		    const linkObjects = cheerio('a', html);
		    // this is a mass object, not an array

		    const total = linkObjects.length;
		    // The linkObjects has a property named "lenght"

		    const links = [];
		    const inside_links = [];
		    // we only need the "href" and "title" of each link
		    var sql ;
		    for(let i = 0; i < total; i++){
		        links.push({
		            href: linkObjects[i].attribs.href,
		            //title: linkObjects[i].attribs.title
		        });
		        if(links[i].href.includes("https") || links[i].href.includes("http") || links[i].href.includes("www")){
		        	inside_links.push(links[i].href);

		        sql = "INSERT INTO links(links,origin) VALUES (";
		        sql = sql + "'"+ links[i].href + "','"+ url + "')";
		        connection.query(sql, function (error, results, fields){
		          if(error) return console.log(error);
		          //console.log('adicionou registros!');
		          
		      });
		        }
		    }


		    //addRows(connection, links[i], url);

		    //console.log("links",inside_links);
		    //console.log("quantidade" + inside_links.length);
		    // do something else here with links
		    GoOverLinks(connection, inside_links);
		})
		.catch(err => {
		    console.log(err); 
		})	
			     
			     //res.end();
			     
			     })
		

		//connection.end();
		//SELECT `ID`, `links`, `origin` FROM `links` order by links
		//var query = "select (links, origin) from links order by links";
		function sleep(ms) {
		  return new Promise(resolve => setTimeout(resolve, ms));
		}

		//console.log("Hello");
		sleep(5000).then(() => { 
		var query = "SELECT `links`, `origin` FROM `links` order by origin, links";
        connection.query(query,function(err,result){
            if(err)
                throw err;
            else {
                 res.render('links.ejs', { links: result });  
            }
        });
        });
  		//res.send('POST request to the homepage');

})
function createTable(conn){
const sql = "CREATE TABLE IF NOT EXISTS links ("+
                  "links varchar(100) NOT NULL,"+
                  "origin varchar(100),"+
                  "PRIMARY KEY (links, origin)"+
                  ");";
      
      conn.query(sql, function (error, results, fields){
          if(error) return console.log(error);
          //console.log('criou a tabela!');
      });
}

function GoOverLinks(connection, links_inside){
		const cheerio = require('cheerio');
		 const rp = require('request-promise');
		 var url;
		 const count = links_inside.length;
	for(let j =0 ; j <  count; j++){
			url = links_inside[j];
			if ( url[0] != 'h'){
				url = 'https://' +  url;
			}
	     	//console.log("URL main: " + url);

	     	//get links
	     	rp(url).then(html => {
		    const linkObjects = cheerio('a', html);
		    // this is a mass object, not an array

		    const total = linkObjects.length;
		    // The linkObjects has a property named "lenght"

		    const links = [];
		    const inside_links = [];
		    
		    var sql ;
		    for(let i = 0; i < total; i++){
		        links.push({
		            href: linkObjects[i].attribs.href,
		            //title: linkObjects[i].attribs.title
		        });
		        if(links[i].href.includes("https") || links[i].href.includes("http") || links[i].href.includes("www")){
		        	inside_links.push(links[i].href);

		        sql = "INSERT INTO links(links,origin) VALUES (";
		        sql = sql + "'"+ links[i].href + "','"+ url + "')";
		        connection.query(sql, function (error, results, fields){
		          if(error) return console.log(error);
		          //console.log('adicionou registros!');
		          
		      });
		        }
		    }


		    //addRows(connection, links[i], url);

		    //console.log("links",inside_links);
		    // do something else here with links
		})
		.catch(err => {
		    console.log(err); 
		})	
	}
}


module.exports = router;
