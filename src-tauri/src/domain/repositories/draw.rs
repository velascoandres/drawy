use crate::domain::dtos::query::FindDrawQuery;
use crate::domain::common::errors::CustomError;
use crate::domain::models::draw::*;

pub trait DrawRepository {
    fn create_draw(&self, draw: &DrawCreateModel) -> Result<DrawModel, CustomError>;

    fn update_draw(&self, id: String, draw: &DrawUpdateModel) -> Result<bool, CustomError>;
    
    fn delete_draw_by_id(&self, id: String) -> Result<bool, CustomError>;
    
    fn find_draws_info(&self, find_draw_query: &FindDrawQuery) -> Result<DrawPaginatedModel, CustomError>;

    fn find_draw_by_id(&self, id: String) -> Result<Option<DrawModel>, CustomError>;
}
