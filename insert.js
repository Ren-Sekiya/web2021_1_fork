const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test_1.db');

let sql = `
insert into station ("name", "line_id", "game_id") values ("木更津駅", 1, 1);
`

db.serialize( () => {
	db.run( sql, (error, row) => {
		if(error) {
			console.log('Error: ', error );
			return;
		}
		console.log( "データを追加しました" );
	});
});
