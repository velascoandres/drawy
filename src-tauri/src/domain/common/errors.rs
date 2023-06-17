#[derive(Clone, Debug)]
pub enum CustomError {
    DataError(String),
    NotFoundError(String),
}
