use nanoid;

/// Generates `shortId` from `nanoid::nanoid!()`
/// ### Params
///  - size : `Option<usize>` (size of the generated id) by default `6`
pub fn short_id(size: Option<usize>) -> String {
    let len = size.unwrap_or(6);
    nanoid::nanoid!(len)
}
