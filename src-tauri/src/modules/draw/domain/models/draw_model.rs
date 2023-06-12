#[derive(Debug)]
pub struct DrawModel {
    pub id: String,
    pub name: String,
    pub raw_elements: Option<String>,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}
