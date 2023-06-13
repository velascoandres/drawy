use crate::modules::draw::domain::dtos::query::FindDrawQuery;
use crate::modules::draw::domain::models::draw_paginated_model::DrawPaginatedModel;
use crate::modules::shared::custom_error::CustomError;
use crate::modules::draw::domain::models::draw_model::DrawModel;
use crate::modules::draw::domain::models::draw_create_model::DrawCreateModel;
use crate::modules::draw::domain::models::draw_update_model::DrawUpdateModel;


pub trait DrawRepository {
    fn create_draw(&mut self, draw: &DrawCreateModel) -> Result<DrawModel, CustomError>;

    fn update_draw(&mut self, id: String, draw: &DrawUpdateModel) -> Result<bool, CustomError>;
    
    fn delete_draw_by_id(&mut self, id: String) -> Result<bool, CustomError>;
    
    fn find_draws_info(&mut self, findDrawQuery: &FindDrawQuery) -> Result<DrawPaginatedModel, CustomError>;

    fn find_draw_by_id(&mut self, id: String) -> Result<Option<DrawModel>, CustomError>;
}
