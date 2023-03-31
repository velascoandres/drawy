use diesel::result::Error;
use serde::Serialize;

use crate::{draws, state::AppState};

#[derive(Serialize)]
struct Response<T> {
    error: Option<String>,
    data: Option<T>
}

#[tauri::command]
pub fn create_draw_command(name: String, elements_meta: String, state: tauri::State<AppState>) -> String {
    let conn =&mut *state.conn.lock().unwrap();
    let result = draws::create_draw(conn, name, elements_meta);

    let response = match result {
        Ok(created_id) => Response { data: Some(created_id), error: None },
        Err(Error::DatabaseError(e, _)) => Response { data: None, error: Some(format!("Database error: {:?}", e)) },
        _ => Response { data: None, error: Some("An error has occured".to_string()) },
    };

    serde_json::to_string(&response).unwrap()
}

#[tauri::command]
pub fn find_one_draw_command(draw_id: String,state: tauri::State<AppState>) -> String {
    let conn =&mut *state.conn.lock().unwrap();
    let result = draws::find_one_draw(conn, draw_id);

    let response = match result {
        Ok(draw) => Response { data: draw, error: None },
        Err(Error::DatabaseError(e, _)) => Response { data: None, error: Some(format!("Database error: {:?}", e)) },
        _ => Response { data: None, error: Some("An error has occured".to_string()) },
    };

    serde_json::to_string(&response).unwrap()
}

#[tauri::command]
pub fn find_all_draws_command(state: tauri::State<AppState>) -> String {
    let conn =&mut *state.conn.lock().unwrap();
    let result = draws::find_all_draws(conn);

    let response = match result {
        Ok(draws) => Response {data: Some(draws), error: None },
        Err(Error::DatabaseError(e, _)) => Response { data: None, error: Some(format!("Database error: {:?}", e)) },
        _ => Response { data: None, error: Some("An error has occured".to_string()) },
    };

    serde_json::to_string(&response).unwrap()
}

#[tauri::command]
pub fn update_draw_command(draw_id: String, name: String, elements_meta: String, state: tauri::State<AppState>) -> String {
    let conn = &mut *state.conn.lock().unwrap();
    let result = draws::update_draw(conn, draw_id, name, elements_meta);

    let response = match result {
        Ok(_) => Response { data: Some(true), error: None },
        Err(Error::DatabaseError(e, _)) => Response { data: None, error: Some(format!("Database error: {:?}", e)) },
        _ => Response { data: None, error: Some("An error has occured".to_string()) },
    };

    serde_json::to_string(&response).unwrap()
}

#[tauri::command]
pub fn delete_draw_command(draw_id: String, state: tauri::State<AppState>) -> String {
    let conn = &mut *state.conn.lock().unwrap();
    let result = draws::delete_draw(conn, draw_id);

    let response = match result {
        Ok(_) => Response { data: Some(true), error: None },
        Err(Error::DatabaseError(e, _)) => Response { data: None, error: Some(format!("Database error: {:?}", e)) },
        _ => Response { data: None, error: Some("An error has occured".to_string()) },
    };

    serde_json::to_string(&response).unwrap()
}