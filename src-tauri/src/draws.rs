use crate::models::{Draw, DrawInfo, UpdateDraw, UpdateDrawBody};
use chrono::prelude::Utc;
use diesel::prelude::*;
use diesel::result::Error;
use math::round;
use uuid::Uuid;

pub fn create_draw(
    conn: &mut SqliteConnection,
    new_name: String,
    new_raw_elements: String,
) -> Result<String, Error> {
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

    diesel::insert_into(draws).values(&new_draw).execute(conn)?;

    Ok(uuid.to_string())
}

pub fn find_all_draws(conn: &mut SqliteConnection) -> Result<Vec<Draw>, Error> {
    use crate::schema::draws::dsl::*;

    draws.load::<Draw>(conn)
}

pub fn find_info_draws_paginated(
    conn: &mut SqliteConnection,
    search: Option<String>,
    offset: i64,
) -> Result<(Vec<DrawInfo>, i64, i64), Error> {
    use crate::schema::draws::dsl::*;

    let page_size: i64 = 10;

    let mut base_query = draws
        .into_boxed()
        .select((id, name, description, created_at, updated_at))
        .order_by(created_at.desc());

    let mut count_query = draws
        .into_boxed()
        .select((id, name, description, created_at, updated_at))
        .order_by(created_at.desc());

    if let Some(search_text) = &search {
        let is_empty_or_whitespace = search_text.trim().is_empty();

        if !is_empty_or_whitespace {
            let like_expression = format!("%{}%", &search_text.trim());

            let filter_criteria = name.like(like_expression.clone()).or(description.like(like_expression));

            base_query = base_query.filter(filter_criteria.clone());
            count_query = count_query.filter(filter_criteria);
        }
    }

    let data = base_query
        .limit(page_size)
        .offset(offset)
        .load::<DrawInfo>(conn)?;
    let count = count_query.count().get_result(conn)?;

    let total_pages = round::ceil(count as f64 / page_size as f64, 0);

    Ok((data, count, total_pages as i64))
}

pub fn find_one_draw(conn: &mut SqliteConnection, draw_id: String) -> Result<Option<Draw>, Error> {
    use crate::schema::draws::dsl::*;

    draws
        .filter(id.eq(draw_id.as_str()))
        .first::<Draw>(conn)
        .optional()
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
    body: UpdateDrawBody,
) -> Result<usize, Error> {
    use crate::schema::draws::dsl::*;

    let now = Utc::now().naive_utc();

    let updated = UpdateDraw {
        name: body.name,
        description: body.description,
        raw_elements: body.raw_elements,
        updated_at: now,
    };

    diesel::update(draws.filter(id.eq(draw_id)))
        .set(updated)
        .execute(conn)
}

pub fn delete_draw(conn: &mut SqliteConnection, draw_id: String) -> Result<usize, Error> {
    use crate::schema::draws::dsl::*;

    diesel::delete(draws.filter(id.eq(draw_id.as_str()))).execute(conn)
}
