use std::sync::Mutex;

use diesel::SqliteConnection;

pub struct AppState {
    pub conn: Mutex<SqliteConnection>
}