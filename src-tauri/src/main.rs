use drawy::application::{handlers::draws, models::app_state::AppState};
use drawy::domain::services::draw::DrawService;
use drawy::infra::databases::sqlite::get_sqlite_pool;
use drawy::infra::repositories::draws::DrawRepositoryImpl;
use drawy::application::window::menu;

#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    let draw_service = DrawService::new(DrawRepositoryImpl::new(get_sqlite_pool()));

    let state = AppState {
        draw_service
    };

    tauri::Builder::default()
        .menu(menu::get_menu())
        .on_menu_event(menu::get_handlers)
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            draws::create_draw_command,
            draws::find_one_draw_command,
            draws::delete_draw_command,
            draws::update_draw_command,
            draws::find_info_draws_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
