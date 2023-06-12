use crate::modules::shared::custom_error::CustomError;
use crate::modules::draw::domain::models::draw_model::DrawModel;
use crate::modules::draw::domain::models::draw_create_model::DrawCreateModel;


pub trait DrawRepository {
    fn create_draw(&mut self, draw: &DrawCreateModel) -> Result<DrawModel, CustomError>;

    // async fn update_draw(&self, id: String, draw: &DrawUpdateModel) -> Result<DrawModel, CustomError>;
    
    // async fn delete_draw(&self, id: String) -> Result<(), CustomError>;
    
    // async fn find_draws_info(&self, search: String, page: i64) -> Result<Vec<DrawInfoModel>, CustomError>;

    // async fn find_draw_by_id(&self, id: String) -> Result<DrawModel, CustomError>;
}
