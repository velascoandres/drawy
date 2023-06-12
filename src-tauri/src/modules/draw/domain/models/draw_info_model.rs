#[derive(Debug)]
pub struct DrawInfoModel {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub updated_at: chrono::NaiveDateTime,
    pub createad_at: chrono::NaiveDateTime,
}
