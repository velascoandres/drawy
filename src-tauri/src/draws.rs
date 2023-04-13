use crate::models::{Draw, DrawInfo, UpdateDraw};
use diesel::prelude::*;
use diesel::result::Error;
use uuid::Uuid;

use chrono::prelude::Utc;


pub fn create_draw(conn: &mut SqliteConnection, new_name: String, new_raw_elements: String) -> Result<String, Error> {
    use crate::schema::draws::dsl::*;

    let uuid = Uuid::new_v4();
    let now = Utc::now().naive_utc();

    let new_draw = Draw {
        id: uuid.to_string(), 
        name: new_name, 
        description: None,
        raw_elements: Some(new_raw_elements),
        created_at: now,
        updated_at: now,
     };

     diesel::insert_into(draws)
        .values(&new_draw).execute(conn)?;

     Ok(uuid.to_string())
}

pub fn find_all_draws(conn: &mut SqliteConnection) -> Result<Vec<Draw>, Error> {
    use crate::schema::draws::dsl::*;

    draws.load::<Draw>(conn)
}

pub fn find_info_draws_paginated(conn: &mut SqliteConnection, limit: i64) -> Result<(Vec<DrawInfo>, i64), Error> {
    use crate::schema::draws::dsl::*;

    let base_query = draws.select(
        (id, name, description, created_at, updated_at)
    ).order_by(created_at.desc());

    let data = base_query.limit(limit).load::<DrawInfo>(conn)?;
    let count = base_query.count().get_result(conn)?;

    Ok((data, count))
}

pub fn find_one_draw(conn: &mut SqliteConnection, draw_id: String) -> Result<Option<Draw>, Error> {
    use crate::schema::draws::dsl::*;

    draws.filter(id.eq(draw_id.as_str())).first::<Draw>(conn).optional()
}

pub fn find_one_draw_info(conn: &mut SqliteConnection, draw_id: String) -> Result<DrawInfo, Error> {
    use crate::schema::draws::dsl::*;

    draws
        .filter(id.eq(draw_id.as_str()))
        .select((id, name, description, created_at, updated_at))
        .first::<DrawInfo>(conn)
}

pub fn update_draw(
    conn: &mut SqliteConnection,
    draw_id: String,
    body: &UpdateDraw,
) -> Result<usize, Error> {
    use crate::schema::draws::dsl::*;

    diesel::update(draws.filter(id.eq(draw_id)))
        .set(body)
        .execute(conn)
}

pub fn delete_draw(conn: &mut SqliteConnection, draw_id: String) -> Result<usize, Error> {
    use crate::schema::draws::dsl::*;

    diesel::delete(draws.filter(id.eq(draw_id.as_str()))).execute(conn)
}