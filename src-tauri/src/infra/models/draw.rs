use diesel::{Insertable, AsChangeset, Queryable};

use crate::infra::databases::schema::draws;

#[derive(Insertable, Queryable)]
#[diesel(table_name = draws)]
pub struct DrawDiesel {
    pub id: String,
    pub name: String,
    pub raw_elements: Option<String>,
    pub description: Option<String>,
    
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct DrawInfoDiesel {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

#[derive(AsChangeset)]
#[diesel(table_name = draws)]
pub struct UpdateDrawDiesel {
    pub name: Option<String>,
    pub description: Option<String>,
    pub raw_elements: Option<String>,
    pub updated_at: chrono::NaiveDateTime,
}
