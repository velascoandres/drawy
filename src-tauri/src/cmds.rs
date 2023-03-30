use diesel::result::Error;
use serde::Serialize;

use crate::{draws, state::AppState, models::Draw};

#[derive(Serialize)]
pub struct Response {
    error: Option<String>,
    data: Option<Draw>
}

#[tauri::command]
pub fn create_draw_command(name: String, element_meta: String, state: tauri::State<AppState>) -> bool {
    let conn =&mut *state.conn.lock().unwrap();
    let result = draws::create_draw(conn, name, element_meta);

    result.is_ok()
}

#[tauri::command]
pub fn find_one_draw_command(draw_id: String,state: tauri::State<AppState>) -> String {
    let conn =&mut *state.conn.lock().unwrap();
    let result = draws::find_one_draw(conn, draw_id);

    let response = match result {
        Ok(created) => Response { data: created, error: None },
        Err(Error::DatabaseError(e, _)) => Response { data: None, error: Some(format!("Database error: {:?}", e)) },
        _ => Response { data: None, error: Some("An error has occured".to_string()) },
    };

    serde_json::to_string(&response).unwrap()
}