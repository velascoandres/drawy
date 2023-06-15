use crate::domain::dtos::query::FindDrawQuery;
use crate::domain::repositories::draw::DrawRepository;
use crate::domain::models::draw::*;
use crate::domain::common::errors::CustomError;


pub const INFO_DRAW_PAGINATION: i64 = 10;
pub const INITAL_OFFSET: i64 = 0;

pub struct DrawService<R>
where
    R: DrawRepository,
{
    draw_repository: R,
}

impl<R> DrawService<R>
where
    R: DrawRepository,
{
    pub fn new(draw_repository: R) -> Self {
        Self { draw_repository }
    }

    pub fn create_draw(&self, draw: DrawCreateModel) -> Result<DrawModel, CustomError> {
        self.draw_repository.create_draw(&draw)
    }

    pub fn update_draw(&self, id: String, draw: DrawUpdateModel) -> Result<bool, CustomError> {
        self.draw_repository.update_draw(id, &draw)
    }

    pub fn delete_draw_by_id(&self, id: String) -> Result<bool, CustomError> {
        self.draw_repository.delete_draw_by_id(id)
    }

    pub fn find_draws_info(
        &self,
        search: Option<String>,
        page: i64,
    ) -> Result<DrawPaginatedModel, CustomError> {
        let mut offset = 10;

        if page > 1 {
            offset = (page - 1) * INFO_DRAW_PAGINATION;
        }

        let query = FindDrawQuery { search, offset };

        self.draw_repository.find_draws_info(&query)
    }

    pub fn find_draw_by_id(&self, id: String) -> Result<Option<DrawModel>, CustomError> {
        self.draw_repository.find_draw_by_id(id)
    }
}
