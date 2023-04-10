use crate::models::{Draw, DrawInfo};
use diesel::prelude::*;
use diesel::result::Error;
use uuid::Uuid;

pub fn create_draw(conn: &mut SqliteConnection, new_name: String, new_raw_elements: String) -> Result<String, Error> {
    use crate::schema::draws::dsl::*;

    let uuid = Uuid::new_v4();

    let new_draw = Draw {
        id: uuid.to_string(), 
        name: new_name, 
        raw_elements: Some(new_raw_elements)
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

    let selection = draws.select(
        (id, name)
    );

    let data = selection.limit(limit).load::<DrawInfo>(conn)?;
    let count = selection.count().get_result(conn)?;

    Ok((data, count))
}

pub fn find_one_draw(conn: &mut SqliteConnection, draw_id: String) -> Result<Option<Draw>, Error> {
    use crate::schema::draws::dsl::*;

    draws.filter(id.eq(draw_id.as_str())).first::<Draw>(conn).optional()
}

pub fn update_draw(
    conn: &mut SqliteConnection,
    draw_id: String,
    new_name: String, 
    new_raw_elements: String
) -> Result<usize, Error> {
    use crate::schema::draws::dsl::*;

    diesel::update(draws.filter(id.eq(draw_id)))
        .set((name.eq(new_name), raw_elements.eq(new_raw_elements)))
        .execute(conn)
}

pub fn delete_draw(conn: &mut SqliteConnection, draw_id: String) -> Result<usize, Error> {
    use crate::schema::draws::dsl::*;

    diesel::delete(draws.filter(id.eq(draw_id.as_str()))).execute(conn)
}