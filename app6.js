const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test_1.db');

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const message = "あなたは最寄りのゲームセンターを検索することができます。";
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
select allinfo.id as aid, line.name as name, station.name as name2, gamecenter.name as name3 from allinfo inner join line on allinfo.lineid = line.id inner join station on allinfo.stationid = station.id inner join gamecenter
on allinfo.gamecenterid = gamecenter.id;
`;
    //console.log(sql);    // ②
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
    let sql=`select station.id as sid, station.name as sname, line.id as lid, line.name as lname, gamecenter.id as gid, gamecenter.name as gname from gamecenter left outer join station on gamecenter.id = station.id left outer join line on gamecenter.id = line.id`;
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

app.post("/insertdata", (req, res) => {
    //console.log(req.query.pop);    // ①
  let sql = "";
  if(req.body.newline && req.body.newstation && req.body.newgamecenter){
    sql=`insert into allinfo("lineid", "stationid", "gamecenterid") values(` + req.body.newline + `,` + req.body.newstation + `,` + req.body.newgamecenter + `);`;
  }
  console.log(sql);    // ②
    db.serialize( () => {
        db.run(sql, (error, row) => {
            console.log(sql); 
            if( error ) {
                res.render('nowdata', {mes:"何も入力されていません。"});
            }
            //console.log(data);    // ③
            res.redirect('/default');
        })
    })
})

app.get("/sibo", (req, res) => {
    //console.log(req.query.pop);    // ①
    let sql = `
select allinfo.id as aid, line.name as name, station.name as name2, gamecenter.name as name3 from allinfo inner join line on allinfo.lineid = line.id inner join station on allinfo.stationid = station.id inner join gamecenter
on allinfo.gamecenterid = gamecenter.id`;
    if( req.query.anyname ) sql += `where line.name = `+ `'`+ req.query.anyname + `' or ` + `station.name = `+ `'` + req.query.anyname + `' or ` + `gamecenter.name = ` + `'`+ req.query.anyname + `'`;
    sql += `;`;
    console.log(sql);
    //console.log(sql);    // ②
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
                res.render('show', {mes:"何も入力されていません。"});
            }
            //console.log(data);    // ③
            res.redirect('/line');
        })
    })
})

app.post("/deleteline", (req, res) => {
    //console.log(req.query.pop);    // ①
  sql=`delete from line where name="` + req.body.deleteline + `";`;
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
                res.render('showstation', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.redirect('/station');
        })
    })
})

app.post("/deletestation", (req, res) => {
    //console.log(req.query.pop);    // ①
  sql=`delete from station where name="` + req.body.deletestation + `";`;
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
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('deletegamecenter', {data:data});
        })
    })
})

app.post("/insertgamecenter", (req, res) => {
    //console.log(req.query.pop);    // ①
  let blank = req.body.newline;
  let sql=`insert into gamecenter("name") values("` + req.body.newgamecenter + `");`;
  if(blank == ""){
    "abc" + sql;
  }
  console.log(sql);    // ②
    db.serialize( () => {
        db.run(sql, (error, row) => {
            console.log(sql); 
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.redirect('/gamecenter');
        })
    })
})

app.post("/deletegamecenter", (req, res) => {
    //console.log(req.query.pop);    // ①
  sql=`delete from gamecenter where name="` + req.body.deletegamecenter + `";`;
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
