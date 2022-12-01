const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test_1.db');

let schema = `
create table allinfo(
  id integer primary key,
  lineid integer not null,
  stationid integer not null,
  gamecenterid integer not null
);
`

db.serialize( () => {
	db.run( schema, (error, row) => {
		if(error) {
			console.log('Error: ', error );
			return;
		}
		console.log( "テーブルを作成しました" );
	});
});
