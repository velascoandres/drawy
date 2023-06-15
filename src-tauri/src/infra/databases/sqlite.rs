extern crate diesel;

use diesel::prelude::*;
use diesel_migrations::MigrationHarness;
use diesel_migrations::{embed_migrations, EmbeddedMigrations};

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");

use diesel::r2d2::ConnectionManager;
use diesel::sqlite::SqliteConnection;


pub type DBConn = diesel::r2d2::Pool<ConnectionManager<SqliteConnection>>;

pub fn get_sqlite_conn() -> diesel::r2d2::Pool<ConnectionManager<SqliteConnection>> {
    let database_url = "draws.db";
    let mut conn = SqliteConnection::establish(database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url));

    let manager = ConnectionManager::<SqliteConnection>::new("db.sqlite");
    let pool = diesel::r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");

    run_migration(&mut conn);

    pool
}

fn run_migration(conn: &mut SqliteConnection) {
    conn.run_pending_migrations(MIGRATIONS).unwrap();
}

extern crate r2d2_diesel;
