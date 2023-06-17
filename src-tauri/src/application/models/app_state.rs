use crate::{domain::{services::draw::DrawService}, infra::repositories::draws::DrawRepositoryImpl};

pub struct AppState{
    pub draw_service: DrawService<DrawRepositoryImpl>
}