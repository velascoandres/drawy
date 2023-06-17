use serde::{Serializer, Serialize};
use chrono::NaiveDateTime;

pub fn serialize_datetime<S>(dt: &NaiveDateTime, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    dt.format("%m/%d/%Y %H:%M")
            .to_string()
            .serialize(serializer)
}