// @generated automatically by Diesel CLI.

diesel::table! {
    draws (id) {
        id -> Text,
        name -> Text,
        raw_elements -> Nullable<Text>,
        description -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}
