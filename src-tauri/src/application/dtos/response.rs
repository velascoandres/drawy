use serde::Serialize;

use crate::domain::{common::errors::CustomError, models::draw::{DrawPaginatedModel, DrawInfoModel}};

#[derive(Serialize)]
pub struct Response<T> {
    error: Option<String>,
    data: Option<T>
}

impl<T> Response<T> {

    pub fn new(result: Result<T, CustomError>) -> Self {
        let response: Response<T> = match result {
            Ok(result) => Response { data: Some(result), error: None },
            Err(CustomError::DataError(e)) => Response { data: None, error: Some(format!("Error: {:?}", e)) },
            Err(CustomError::NotFoundError(e)) => Response { data: None, error: Some(format!("Error: {:?}", e)) },
        };

        response
    }
}

#[derive(Serialize)]
pub struct PaginatedResponse {
    pub error: Option<String>,
    pub data: Option<Vec<DrawInfoModel>>,
    pub total_pages: i64,
    pub count: i64
}

impl PaginatedResponse {

    pub fn new(result: Result<DrawPaginatedModel, CustomError>) -> Self {
        let response: PaginatedResponse = match result {
            Ok(result) => PaginatedResponse { 
                data:  Some(result.data), 
                error: None,
                count: result.count,
                total_pages: result.total_pages,
             },
            Err(CustomError::DataError(e)) => PaginatedResponse { 
                data: None, 
                error: Some(format!("Error: {:?}", e)), 
                count: 0,
                total_pages: 0,
            },
            Err(CustomError::NotFoundError(e)) => PaginatedResponse { 
                data: None, 
                error: Some(format!("Error: {:?}", e)),
                count: 0,
                total_pages: 0,
             },
        };

        response
    }
}

