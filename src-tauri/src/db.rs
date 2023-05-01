extern crate diesel;

use diesel::prelude::*;

pub fn establish_connection() -> SqliteConnection {
    let database_url = "draws.db";
    SqliteConnection::establish(database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}