extern crate diesel;

use diesel::prelude::*;
use diesel_migrations::{embed_migrations, EmbeddedMigrations};
use diesel_migrations::MigrationHarness;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");


pub fn establish_connection() -> SqliteConnection {
    let database_url = "draws.db";
    let mut conn = SqliteConnection::establish(database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url));

    run_migration(&mut conn);
    conn
}

fn run_migration(conn: &mut SqliteConnection) {
    conn.run_pending_migrations(MIGRATIONS).unwrap();
}
