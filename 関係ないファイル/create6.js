const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test_1.db');

let schema = `
create table mediumtable(
  name text not null,
  urlid integer
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
