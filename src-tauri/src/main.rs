use std::sync::Mutex;
use drawy::{db, state::AppState, cmds::*, menu};

#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    let state = AppState {
        conn: Mutex::new(db::establish_connection())
    };

    tauri::Builder::default()
        .menu(menu::get_menu())
        .on_menu_event(menu::get_handlers)
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            create_draw_command, 
            find_one_draw_command,
            find_all_draws_command,
            delete_draw_command,
            update_draw_command,
            find_info_draws_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
