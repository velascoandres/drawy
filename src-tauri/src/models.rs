#![allow(unused)]
#![allow(clippy::all)]

use diesel::{Queryable, Insertable};
use serde::Serialize;
use crate::schema::draws;

#[derive(Queryable, Debug, Insertable, Serialize)]
pub struct Draw {
    pub id: String,
    pub name: String,
    pub raw_elements: Option<String>,
}

#[derive(Insertable)]
#[table_name = "draws"]
pub struct NewDraw {
    pub id: String,
    pub name: String,
    pub raw_elements: Option<String>,
}