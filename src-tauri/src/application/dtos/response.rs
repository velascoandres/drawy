use serde::Serialize;

use crate::domain::common::errors::CustomError;

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
            _ => Response { data: None, error: Some("An error has occured".to_string()) },
        };

        response
    }
}

