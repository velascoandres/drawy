#![allow(unused)]
#![allow(clippy::all)]

use diesel::{Queryable, Insertable, sql_types::Timestamp, AsChangeset};
use serde::{Serialize, Serializer};
use crate::schema::draws;
use chrono::{self, DateTime, Utc};

pub fn serialize_dt<S>(dt: &chrono::NaiveDateTime, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    dt.format("%m/%d/%Y %H:%M")
            .to_string()
            .serialize(serializer)
}

#[derive(Debug, Insertable, Queryable, Serialize)]
pub struct Draw {
    pub id: String,
    pub name: String,
    pub raw_elements: Option<String>,
    pub description: Option<String>,
    #[serde(serialize_with = "serialize_dt")]
    pub created_at: chrono::NaiveDateTime,
    #[serde(serialize_with = "serialize_dt")]
    pub updated_at: chrono::NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize)]
pub struct DrawInfo {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    #[serde(serialize_with = "serialize_dt")]
    pub created_at: chrono::NaiveDateTime,
    #[serde(serialize_with = "serialize_dt")]
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

#[derive(AsChangeset)]
#[diesel(table_name = draws)]
pub struct CreateDraw {
    pub name: String,
    pub description: Option<String>,
    pub raw_elements: Option<String>,
    pub updated_at: chrono::NaiveDateTime,
}

pub struct UpdateDrawBody {
    pub name: Option<String>,
    pub description: Option<String>,
    pub raw_elements: Option<String>,
}