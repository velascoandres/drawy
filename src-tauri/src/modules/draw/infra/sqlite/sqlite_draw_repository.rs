use chrono::Utc;
use diesel::SqliteConnection;
use uuid::Uuid;
use diesel::RunQueryDsl;

use crate::modules::draw::domain::models::draw_create_model::DrawCreateModel;
use crate::modules::draw::domain::models::draw_model::DrawModel;
use crate::modules::draw::domain::repositories::draw_repository::DrawRepository;
use crate::modules::draw::infra::sqlite::entities::DrawEntity;
use crate::modules::shared::custom_error::CustomError;


pub struct SQLiteDrawRespository {
    connection: SqliteConnection
}

impl SQLiteDrawRespository {
    pub fn new(conn: SqliteConnection) -> Self {
        Self {
            connection: conn
        }
    }
}

impl DrawRepository for SQLiteDrawRespository {
    fn create_draw(&mut self, draw: &DrawCreateModel) -> Result<DrawModel, CustomError> {
        use crate::schema::draws::dsl::*;

        let uuid = Uuid::new_v4();
        let now = Utc::now().naive_utc();
    
        let new_draw = DrawEntity {
            id: uuid.to_string(),
            name: draw.name.clone(),
            description: None,
            raw_elements: draw.raw_elements.clone(),
            created_at: now,
            updated_at: now,
        };
    
        let result =  diesel::insert_into(draws).values(&new_draw).execute( &mut self.connection);

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
            },
            Err(_) => Err(CustomError::DataError(String::from("Error on create a draw"))),
        }
    }

    // fn update_draw(&self, id: String, draw: &DrawUpdateModel) -> Result<DrawModel, CustomError>;
    
    // fn delete_draw(&self, id: String) -> Result<(), CustomError>;
    
    // fn find_draws_info(&self, search: String, page: i64) -> Result<Vec<DrawInfoModel>, CustomError>;

    // fn find_draw_by_id(&self, id: String) -> Result<DrawModel, CustomError>;
}