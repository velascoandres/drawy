use serde::Serialize;

use crate::domain::common::serializers::serialize_datetime;

#[derive(Debug)]
pub struct DrawUpdateModel {
    pub name: Option<String>,
    pub description: Option<String>,
    pub raw_elements: Option<String>,
}

#[derive(Debug, Clone)]
pub struct DrawCreateModel {
    pub name: String,
    pub description: Option<String>,
    pub raw_elements: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct DrawInfoModel {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    #[serde(serialize_with = "serialize_datetime")]
    pub updated_at: chrono::NaiveDateTime,
    #[serde(serialize_with = "serialize_datetime")]
    pub createad_at: chrono::NaiveDateTime,
}

#[derive(Debug, Serialize)]
pub struct DrawPaginatedModel {
    pub data: Vec<DrawInfoModel>,
    pub total_pages: i64,
    pub count: i64
}

#[derive(Debug, Serialize)]
pub struct DrawModel {
    pub id: String,
    pub name: String,
    pub raw_elements: Option<String>,
    pub description: Option<String>,
    #[serde(serialize_with = "serialize_datetime")]
    pub created_at: chrono::NaiveDateTime,
    #[serde(serialize_with = "serialize_datetime")]
    pub updated_at: chrono::NaiveDateTime,
}
