use super::draw_info_model::DrawInfoModel;

pub struct DrawPaginatedModel {
    pub data: Vec<DrawInfoModel>,
    pub total_pages: i64,
    pub count: i64
}
