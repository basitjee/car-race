import { Client } from "pg";

export async function topUsers(req, res) {
  const client = new Client(process.env.DATABASE_URL);
  let page;
  if (req.query.page === undefined) page = 1;
  else if (req.query.page * 1 > 0) page = req.query.page;

  let OFFSET = (page - 1) * 5;
  var result_json = [];
  let users = [];
  await client.connect(e => {
    if (e) res.send(e);
  });
  await client
    .query(
      "SELECT users.id , users.created_at, users.name, count(listings.name) as count  FROM public.users  left join  public.listings on users.id=listings.created_by GROUP BY users.id ORDER BY count DESC,users.created_at DESC LIMIT 5 OFFSET " +
        OFFSET
    )
    .then((rslt, err) => {
      if (err) result_json["error"] = err;
      else if (rslt.rows.length === 0) res.send([]);
      else users = rslt.rows;
    });
  await users.map(async (user, index, arr) => {
    let userID = user.id;
    await client
      .query(
        "SELECT name FROM public.listings where listings.created_by = " +
          userID +
          " LIMIT 3"
      )
      .then((rslt, err) => {
        if (err) result_json["error"] = err;
        user.listing = rslt.rows;
        result_json.push(user);
        if (index + 1 === arr.length) res.send(result_json);
      });
  });
}
