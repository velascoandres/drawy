use diesel::{Insertable, AsChangeset, Queryable};

use crate::schema::draws;

#[derive(Insertable, Queryable)]
#[diesel(table_name = draws)]
pub struct DrawEntity {
    pub id: String,
    pub name: String,
    pub raw_elements: Option<String>,
    pub description: Option<String>,
    
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct DrawInfo {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

#[derive(AsChangeset)]
#[diesel(table_name = draws)]
pub struct UpdateDraw {
    pub name: Option<String>,
    pub description: Option<String>,
    pub raw_elements: Option<String>,
    pub updated_at: chrono::NaiveDateTime,
}
