#[derive(Debug)]
pub struct DrawModel {
    pub id: String,
    pub name: String,
    pub raw_elements: Option<String>,
    pub description: Option<String>,
    
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}


#[derive(Debug)]
pub struct CreateDrawModel {
    pub name: String,
    pub raw_elements: Option<String>,
    pub description: Option<String>
}


#[derive(Debug)]
pub struct UpdateDrawModel {
    pub name: Option<String>,
    pub raw_elements: Option<String>,
    pub description: Option<String>
}


#[derive(Debug)]
pub struct DrawInfoModel {
    pub id: String,
    pub name: String,
    pub description: Option<String>
}


