use diesel::result::Error;

use crate::{draws, state::AppState, models::Draw};

#[tauri::command]
pub fn create_draw_command(name: String, element_meta: String, state: tauri::State<AppState>) -> bool {
    let conn =&mut *state.conn.lock().unwrap();
    let result = draws::create_draw(conn, name, element_meta);

    result.is_ok()
}

#[tauri::command]
pub fn find_one_draw_command(draw_id: String,state: tauri::State<AppState>) -> Result<Option<Draw>, String> {
    let conn =&mut *state.conn.lock().unwrap();
    let result = draws::find_one_draw(conn, draw_id);

    match result {
        Ok(crated) => Ok(crated),
        Err(Error::DatabaseError(e, _)) => Err(format!("Database error: {:?}", e)),
        _ => Err("An error has occured".to_string())
    }
}