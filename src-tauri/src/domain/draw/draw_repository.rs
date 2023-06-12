use std::fmt::Error;

use async_trait::async_trait;
use super::draw_model::{DrawModel, CreateDrawModel, UpdateDrawModel, DrawInfoModel};

#[async_trait]
pub trait DrawRepository {
    async fn create_draw(&self, draw: &CreateDrawModel) -> Result<DrawModel, Error>;

    async fn update_draw(&self, id: String, draw: &UpdateDrawModel) -> Result<DrawModel, Error>;
    
    async fn delete_draw(&self, id: String) -> Result<(), Error>;
    
    async fn find_draws_info(&self, search: String, page: i64) -> Result<Vec<DrawInfoModel>, Error>;

    async fn find_draw_by_id(&self, id: String) -> Result<DrawModel, Error>;
}

