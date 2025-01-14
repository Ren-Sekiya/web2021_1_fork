const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test_1.db');

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const message = "あなたは駅チカのゲームセンターを検索することができます。";
  res.render('show', {mes:message});
});

app.get("/db", (req, res) => {
    db.serialize( () => {
        db.all("select id, 都道府県, 人口 from example;", (error, row) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            res.render('select', {data:row});
        })
    })
})
app.get("/default", (req, res) => {
    //console.log(req.query.pop);    // ①
    let sql = `
select allinfo.id as id, linename, stationname, gamecentername,url.url from allinfo inner join mediumtable on allinfo.gamecentername = mediumtable.name inner join url on allinfo.id = url.id;
`;
    console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('all', {data:data});
        })
    })
})

app.get("/insert", (req, res) => {
    //console.log(req.query.pop);    // ①
    //console.log(sql);    // ②
    let sql=`select station.id as sid, station.name as sname, line.id as lid, line.name as lname, gamecenter.id as gid, gamecenter.name as gname from station left outer join line on station.id = line.id left outer join gamecenter on station.id = gamecenter.id`;
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(sql);    // ③
            res.render('nowdata', {data:data});
        })
    })
})

app.get("/delete", (req, res) => {
    //console.log(req.query.pop);    // ①
    let sql = `
select * from allinfo;
`;
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('delete', {data:data});
        })
    })
})

app.post("/deletedata", (req, res) => {
    //console.log(req.query.pop);    // ①
  sql=`delete from allinfo where id="` + req.body.number + `";`;
  console.log(sql);    // ②
    db.serialize( () => {
        db.run(sql, (error, row) => { 
            if( error ) {
                res.render('show', {mes:"何も入力されていません。"});
            }
            //console.log(data);    // ③
            res.redirect('/delete');
        })
    })
})

app.post("/insertdata", (req, res) => {
    //console.log(req.query.pop);    // ①
  let sql = "";
  if(req.body.newline != "0" && req.body.newstation != "0" && req.body.newgamecenter != "0"){
    sql=`insert into allinfo("linename", "stationname", "gamecentername") values('` + req.body.newline + `','` + req.body.newstation + `','` + req.body.newgamecenter + `');`;
  }
  console.log(sql);    // ②
    db.serialize( () => {
        db.run(sql, (error, row) => {
            console.log(sql); 
            if( error ) {
                res.render('show2', {mes:"入力されていない項目があります。"});
            }
            //console.log(data);    // ③
            res.redirect('/default');
        })
    })
})

app.get("/search", (req, res) => {
    //console.log(req.query.pop);    // ①
    //console.log(sql);    // ②
    let sql=`select station.id as sid, station.name as sname, line.id as lid, line.name as lname, gamecenter.id as gid, gamecenter.name as gname from station left outer join line on station.id = line.id left outer join gamecenter on station.id = gamecenter.id`;
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(sql);    // ③
            res.render('keyword', {data:data});
        })
    })
})

app.get("/sibo", (req, res) => {
    //console.log(req.query.pop);    // ①
    let sql = `
select allinfo.id as id, linename, stationname, gamecentername,url.url from allinfo inner join mediumtable on allinfo.gamecentername = mediumtable.name inner join url on allinfo.id = url.id `;
    if( req.query.anyname ){
      sql += `where linename = `+ `'`+ req.query.anyname + `' or ` + `stationname = `+ `'` + req.query.anyname + `' or ` + `gamecentername = ` + `'`+ req.query.anyname + `'`;
    }else{
      sql += `where linename = ""`+ `or ` + `stationname = ""` + ` or ` + `gamecentername = ""` ;
    }
    sql += `;`;
    console.log(sql);
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('search', {data:data});
        })
    })
})

app.get("/line", (req, res) => {
    //console.log(req.query.pop);    // ①
    //console.log(sql);    // ②
    let sql=`select * from line`;
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('showline', {data:data});
        })
    })
})

app.get("/nowline", (req, res) => {
    //console.log(req.query.pop);    // ①
    //console.log(sql);    // ②
    let sql=`select * from line`;
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('deleteline', {data:data});
        })
    })
})

app.post("/insertline", (req, res) => {
    //console.log(req.query.pop);    // ①
  let sql = "";
  if(req.body.newline){
    sql=`insert into line("name") values("` + req.body.newline + `");`;
  }
  console.log(sql);    // ②
    db.serialize( () => {
        db.run(sql, (error, row) => {
            console.log(sql); 
            if( error ) {
                res.render('show3', {mes:"何も入力されていません。"});
            }
            //console.log(data);    // ③
            res.redirect('/line');
        })
    })
})

app.post("/deleteline", (req, res) => {
    //console.log(req.query.pop);    // ①
  sql=`delete from line where id="` + req.body.deleteline + `";`;
  console.log(sql);    // ②
    db.serialize( () => {
        db.run(sql, (error, row) => { 
            if( error ) {
                res.render('nowline', {mes:"何も入力されていません。"});
            }
            //console.log(data);    // ③
            res.redirect('/nowline');
        })
    })
})

app.get("/station", (req, res) => {
    //console.log(req.query.pop);    // ①
    //console.log(sql);    // ②
    let sql=`select * from station`;
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(sql);    // ③
            res.render('showstation', {data:data});
        })
    })
})

app.get("/nowstation", (req, res) => {
    //console.log(req.query.pop);    // ①
    //console.log(sql);    // ②
    let sql=`select * from station`;
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('deletestation', {data:data});
        })
    })
})

app.post("/insertstation", (req, res) => {
    //console.log(req.query.pop);    // ①
  let sql = "";
  if(req.body.newstation){
    sql=`insert into station("name") values("` + req.body.newstation + `");`;
  }
  //console.log(sql);    // ②
    db.serialize( () => {
        db.run(sql, (error, row) => {
            console.log(sql); 
            if( error ) {
                res.render('show4', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.redirect('/station');
        })
    })
})

app.post("/deletestation", (req, res) => {
    //console.log(req.query.pop);    // ①
  sql=`delete from station where id="` + req.body.deletestation + `";`;
  console.log(sql);    // ②
    db.serialize( () => {
        db.run(sql, (error, row) => { 
            if( error ) {
                res.render('show', {mes:"何も入力されていません。"});
            }
            //console.log(data);    // ③
            res.redirect('/nowstation');
        })
    })
})

app.get("/gamecenter", (req, res) => {
    //console.log(req.query.pop);    // ①
    //console.log(sql);    // ②
    let sql=`select * from gamecenter`;
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('showgamecenter', {data:data});
        })
    })
})

app.get("/nowgamecenter", (req, res) => {
    //console.log(req.query.pop);    // ①
    //console.log(sql);    // ②
    let sql=`select * from gamecenter`;
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show5', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('deletegamecenter', {data:data});
        })
    })
})

app.post("/insertgamecenter", (req, res) => {
    //console.log(req.query.pop);    // ①
  let sql = "";
  if(req.body.newgameceter){
    sql=`insert into gamecenter("name") values("` + req.body.newgamecenter + `");`;
  }
  console.log(sql);    // ②
    db.serialize( () => {
        db.run(sql, (error, row) => {
            console.log(sql); 
            if( error ) {
                res.render('show5', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.redirect('/gamecenter');
        })
    })
})

app.post("/deletegamecenter", (req, res) => {
    //console.log(req.query.pop);    // ①
  sql=`delete from gamecenter where id="` + req.body.deletegamecenter + `";`;
  console.log(sql);    // ②
    db.serialize( () => {
        db.run(sql, (error, row) => { 
            if( error ) {
                res.render('show', {mes:"何も入力されていません。"});
            }
            //console.log(data);    // ③
            res.redirect('/nowgamecenter');
        })
    })
})

app.get("/top", (req, res) => {
    //console.log(req.query.pop);    // ①
    let desc = "";
    if( req.query.desc ) desc = " desc";
    let sql = "select id, 都道府県, 人口 from example order by 人口" + desc + " limit " + req.query.pop + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('select', {data:data});
        })
    })
})
app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
