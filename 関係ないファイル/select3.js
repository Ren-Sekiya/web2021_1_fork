const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test_1.db');

let sql = `select * from gamecenter;"`/*
select station.id, station.name, line.name as name2 from station
inner join line
on station.line_id = line.id;
`*/
db.serialize( () => {
	db.all( sql, (error, row) => {
		if(error) {
			console.log('Error: ', error );
			return;
		}
		for( let data of row ) {
			console.log( data.id + ' : ' + data.name);
		}
	});
});
