use std::fmt::Error;

use crate::domain::draw::draw_model::{DrawModel, CreateDrawModel, UpdateDrawModel, DrawInfoModel};
use crate::domain::draw::draw_repository::DrawRepository;
pub struct DrawService<R> where R: DrawRepository {
    draw_repository: R
}

impl<R> DrawService<R> where R: DrawRepository {
    pub fn new(draw_repository: R) -> Self {
        Self { draw_repository }
    }

    pub async fn create_draw(&self, draw: CreateDrawModel) -> Result<DrawModel, Error> {
        self.draw_repository.create_draw(&draw).await
    }

    pub async fn update_draw(&self, id: String, draw: UpdateDrawModel) -> Result<DrawModel, Error> {
        self.draw_repository.update_draw(id, &draw).await
    }

    pub async fn delete_draw(&self, id: String) -> Result<(), Error> {
        self.draw_repository.delete_draw(id).await
    }

    pub async fn find_draws_info(&self, search: String, page: i64) -> Result<Vec<DrawInfoModel>, Error>{
        self.draw_repository.find_draws_info(search, page).await
    }

    pub async fn find_draw_by(&self, id: String) -> Result<DrawModel, Error>{
        self.draw_repository.find_draw_by_id(id).await
    }

}