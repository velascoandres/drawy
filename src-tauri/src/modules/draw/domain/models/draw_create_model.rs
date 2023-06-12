#[derive(Debug)]
pub struct DrawCreateModel {
    pub name: String,
    pub description: Option<String>,
    pub raw_elements: Option<String>,
}
