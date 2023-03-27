use crate::models::{Draw};
use diesel::prelude::*;
use diesel::result::Error;
use uuid::Uuid;

pub fn create_draw(conn: &mut SqliteConnection, new_name: &'static str, new_raw_elements: &'static str) -> Result<usize, Error> {
    use crate::schema::draws::dsl::*;

    let uuid = Uuid::new_v4();

    let new_draw = Draw {
        id: uuid.to_string(), 
        name: String::from(new_name), 
        raw_elements: Some(String::from(new_raw_elements))
     };

     diesel::insert_into(draws)
        .values(&new_draw)
        .execute(conn)
}

pub fn read_draws(conn: &mut SqliteConnection) -> Result<Vec<Draw>, Error> {
    use crate::schema::draws::dsl::*;

    draws.load::<Draw>(conn)
}

pub fn read_draw(conn: &mut SqliteConnection, draw_id: &str) -> Result<Option<Draw>, Error> {
    use crate::schema::draws::dsl::*;

    draws.filter(id.eq(draw_id)).first::<Draw>(conn).optional()
}

pub fn update_draw(
    conn: &mut SqliteConnection,
    draw_id: &str,
    new_name: &'static str, 
    new_raw_elements: &'static str
) -> Result<usize, Error> {
    use crate::schema::draws::dsl::*;

    diesel::update(draws.filter(id.eq(draw_id)))
        .set((name.eq(new_name), raw_elements.eq(new_raw_elements)))
        .execute(conn)
}

pub fn delete_Draw(conn: &mut SqliteConnection, draw_id: &str) -> Result<usize, Error> {
    use crate::schema::draws::dsl::*;

    diesel::delete(draws.filter(id.eq(draw_id))).execute(conn)
}