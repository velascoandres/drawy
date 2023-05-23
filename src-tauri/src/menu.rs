use tauri::{CustomMenuItem, Menu, WindowMenuEvent, Submenu, MenuItem};

pub fn get_menu() -> Menu {
    let import = CustomMenuItem::new("import".to_string(), "Import from your computer");
    let close = CustomMenuItem::new("close".to_string(), "Close");

    let submenu = Submenu::new("File", Menu::new().add_item(import).add_item(close));

    Menu::new()
    .add_native_item(MenuItem::Copy)
    .add_item(CustomMenuItem::new("hide", "Hide"))
    .add_submenu(submenu)
}

pub fn get_handlers(event: WindowMenuEvent) {
    match event.menu_item_id() {
        "import" => {
            event.window().emit("open_import", "import").unwrap();
        }
        "close" => {
            event.window().close().unwrap();
        }
        _ => {}
    }
}
