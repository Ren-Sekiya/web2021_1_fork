const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test_1.db');

let sql = `
select name,sql from sqlite_master where type='table';
`;

db.serialize( () => {
	db.each( sql, (error, row) => {
		if(error) {
			console.log('Error: ', error );
			return;
		}
		console.log( "テーブル名 : " + row.name );
		console.log( "Schema : " + row.sql );
		console.log();
	});
});
