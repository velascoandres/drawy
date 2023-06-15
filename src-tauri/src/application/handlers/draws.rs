use crate::application::{dtos::response::Response, models::app_state::AppState};
use crate::domain::models::draw::{DrawCreateModel, DrawUpdateModel};

#[tauri::command]
pub fn create_draw_command(
    name: String,
    description: Option<String>,
    elements_meta: Option<String>,
    state: tauri::State<AppState>,
) -> String {
    let draw = DrawCreateModel {
        name,
        description,
        raw_elements: elements_meta,
    };

    let result =  state.draw_service.create_draw(draw);

    let response = Response::new(result);

    serde_json::to_string(&response).unwrap()
}

#[tauri::command]
pub fn find_one_draw_command(draw_id: String, state: tauri::State<AppState>) -> String {
    let result = state.draw_service.find_draw_by_id(draw_id);

    let response = Response::new(result);

    serde_json::to_string(&response).unwrap()
}

#[tauri::command]
pub fn update_draw_command(
    draw_id: String,
    name: Option<String>,
    description: Option<String>,
    elements_meta: Option<String>,
    state: tauri::State<AppState>,
) -> String {
    let draw_update = DrawUpdateModel {
        name,
        description,
        raw_elements: elements_meta,
    };

    let result = state.draw_service.update_draw(draw_id, draw_update);

    let response = Response::new(result);

    serde_json::to_string(&response).unwrap()
}


#[tauri::command]
pub fn delete_draw_command(draw_id: String, state: tauri::State<AppState>) -> String {
    let result = state.draw_service.delete_draw_by_id(draw_id);

    let response = Response::new(result);

    serde_json::to_string(&response).unwrap()
}

#[tauri::command]
pub fn find_info_draws_command(search: Option<String>, page: i64, state: tauri::State<AppState>) -> String {
    let result = state.draw_service.find_draws_info(search, page);

    let response = Response::new(result);

    serde_json::to_string(&response).unwrap()
}