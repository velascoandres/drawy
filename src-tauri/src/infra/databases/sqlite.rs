extern crate diesel;

use diesel_migrations::MigrationHarness;
use diesel_migrations::{embed_migrations, EmbeddedMigrations};

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./src/infra/databases/migrations");

use diesel::r2d2::ConnectionManager;
use diesel::sqlite::SqliteConnection;


pub type DBConn = diesel::r2d2::Pool<ConnectionManager<SqliteConnection>>;
pub type PooledConection = diesel::r2d2::PooledConnection<ConnectionManager<SqliteConnection>>;

pub fn get_sqlite_pool() -> diesel::r2d2::Pool<ConnectionManager<SqliteConnection>> {
    let database_url = "draws.db";

    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    let pool = diesel::r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");

    run_migration(&mut pool.get().unwrap());

    pool
}

fn run_migration(conn: &mut PooledConection) {
    conn.run_pending_migrations(MIGRATIONS).unwrap();
}

extern crate r2d2_diesel;
