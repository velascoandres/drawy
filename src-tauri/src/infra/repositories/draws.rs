use std::sync::Arc;

use chrono::Utc;
use diesel::prelude::*;
use math::round;
use uuid::Uuid;

use crate::domain::dtos::query::FindDrawQuery;
use crate::domain::repositories::draw::DrawRepository;
use crate::infra::databases::sqlite::DBConn;
use crate::infra::models::draw::{DrawDiesel, UpdateDrawDiesel, DrawInfoDiesel};
use crate::domain::common::errors::CustomError;
use crate::domain::models::draw::*;



pub struct DrawRepositoryImpl {
    conn: Arc<DBConn>,
}

impl DrawRepositoryImpl {
    pub fn new(conn: DBConn) -> Self {
        Self { conn: Arc::new(conn) }
    }
}

impl DrawRepository for DrawRepositoryImpl {
    fn create_draw(&self, draw: &DrawCreateModel) -> Result<DrawModel, CustomError> {
        use crate::infra::databases::schema::draws::dsl::*;

        let uuid = Uuid::new_v4();
        let now = Utc::now().naive_utc();

        let new_draw = DrawDiesel {
            id: uuid.to_string(),
            name: draw.name.clone(),
            description: draw.description.clone(),
            raw_elements: draw.raw_elements.clone(),
            created_at: now,
            updated_at: now,
        };

        let result = diesel::insert_into(draws)
            .values(&new_draw)
            .execute(&mut self.conn.get().unwrap());

        match result {
            Ok(_) => {
                let draw_created = DrawModel {
                    id: new_draw.id,
                    name: new_draw.name,
                    description: None,
                    raw_elements: new_draw.raw_elements,
                    created_at: now,
                    updated_at: now,
                };

                Ok(draw_created)
            }
            Err(_) => Err(CustomError::DataError(String::from(
                "Error on create a draw",
            ))),
        }
    }

    fn update_draw(
        &self,
        draw_id: String,
        draw: &DrawUpdateModel,
    ) -> Result<bool, CustomError> {
        use crate::infra::databases::schema::draws::dsl::*;

        let now = Utc::now().naive_utc();

        let updated = &UpdateDrawDiesel {
            name: draw.name.clone(),
            description: draw.description.clone(),
            raw_elements: draw.raw_elements.clone(),
            updated_at: now,
        };

        let result = diesel::update(draws.filter(id.eq(&draw_id)))
            .set(updated)
            .execute(&mut self.conn.get().unwrap());

        if result.is_err() {
            return Err(CustomError::DataError(String::from(
                "Error on update a draw",
            )));
        }

        Ok(true)
    }

    fn delete_draw_by_id(&self, draw_id: String) -> Result<bool, CustomError>{
        use crate::infra::databases::schema::draws::dsl::*;

        let result = diesel::delete(draws.filter(id.eq(draw_id.as_str()))).execute(&mut self.conn.get().unwrap());
    
        if result.is_err() {
            return Err(CustomError::DataError(String::from(
                "Error on delete a draw",
            )));
        }

        Ok(true)
    }

    fn find_draw_by_id(&self, draw_id: String) -> Result<Option<DrawModel>, CustomError> {
        use crate::infra::databases::schema::draws::dsl::*;

        let result = draws
            .filter(id.eq(draw_id))
            .first::<DrawDiesel>(&mut self.conn.get().unwrap())
            .optional();

        if result.is_err() {
            return Err(CustomError::DataError(String::from(
                "Error on find a draw by id",
            )));
        }

        let response = result.unwrap();

        if response.is_none() {
            return Err(CustomError::NotFoundError(String::from(
                "Draw not found with id ",
            )));
        }

        let stored_draw = response.unwrap();

        let draw_model = DrawModel {
            id: stored_draw.id,
            name: stored_draw.name,
            description: stored_draw.description,
            raw_elements: stored_draw.raw_elements,
            created_at: stored_draw.created_at,
            updated_at: stored_draw.updated_at,
        };

        Ok(Some(draw_model))
    }

    fn find_draws_info(&self, query: &FindDrawQuery) -> Result<DrawPaginatedModel, CustomError>{
        use crate::infra::databases::schema::draws::dsl::*;
        let page_size: i64 = 10;
    
        let mut base_query = draws
            .into_boxed()
            .select((id, name, description, created_at, updated_at))
            .order_by(created_at.desc());
    
        let mut count_query = draws
            .into_boxed()
            .select((id, name, description, created_at, updated_at))
            .order_by(created_at.desc());
    
        if let Some(search_text) = &query.search {
            let is_empty_or_whitespace = search_text.trim().is_empty();
    
            if !is_empty_or_whitespace {
                let like_expression = format!("%{}%", &search_text.trim());
    
                let filter_criteria = name.like(like_expression.clone()).or(description.like(like_expression));
    
                base_query = base_query.filter(filter_criteria.clone());
                count_query = count_query.filter(filter_criteria);
            }
        }
    
        let data_response = base_query
            .limit(page_size)
            .offset(query.offset)
            .load::<DrawInfoDiesel>(&mut self.conn.get().unwrap());

        let count_response = count_query.count().get_result(&mut self.conn.get().unwrap());
    
    
        if data_response.is_err() {
            return Err(CustomError::DataError(String::from(
                "Error on find a draws information",
            )));
        }

        if count_response.is_err() {
            return Err(CustomError::DataError(String::from(
                "Error on count results",
            )));
        }

        let count = count_response.unwrap();
        let data = data_response.unwrap();

        let parsed_data = data.iter().map(move |draw_selection|{
            DrawInfoModel {
                id: draw_selection.id.clone(),
                name: draw_selection.name.clone(),
                description: draw_selection.description.clone(),
                updated_at: draw_selection.updated_at,
                createad_at: draw_selection.created_at,
            }
        }).collect::<Vec<DrawInfoModel>>();

        let total_pages = round::ceil(count as f64 / page_size as f64, 0);

        let response = DrawPaginatedModel {
            data: parsed_data,
            total_pages: total_pages as i64,
            count,
        };

        Ok(response)
    }
}
