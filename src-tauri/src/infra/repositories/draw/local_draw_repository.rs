use std::fmt::Error;

use async_trait::async_trait;
use diesel::SqliteConnection;

use crate::domain::draw::{draw_repository::DrawRepository, draw_model::{CreateDrawModel, DrawModel}};

pub struct LocalDrawRepository {
    connection: SqliteConnection
}

impl LocalDrawRepository {
    fn new(conn: SqliteConnection) -> Self {
        Self { connection: conn }
    }
}

#[async_trait]
impl DrawRepository for LocalDrawRepository {
    async fn create_draw(&self, draw: &CreateDrawModel) -> Result<DrawModel, Error>{
        
    }

    async fn update_draw(&self, id: String, draw: &UpdateDrawModel) -> Result<DrawModel, Error>;
    
    async fn delete_draw(&self, id: String) -> Result<(), Error>;
    
    async fn find_draws_info(&self, search: String, page: i64) -> Result<Vec<DrawInfoModel>, Error>;

    async fn find_draw_by_id(&self, id: String) -> Result<DrawModel, Error>;
}