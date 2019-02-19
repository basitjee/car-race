import { Client } from "pg";

export async function users(req, res) {
  //Creating new db client
  const client = new Client(process.env.DATABASE_URL);
  if (req.query.id * 1 > 0) {
    let id = req.query.id;
    var result_json = [];

    //connecting to db
    await client.connect(e => {
      if (e) res.send(e);
      //console.log("connected to db");
    });
    await client
      .query(
        "SELECT id,name,created_at FROM public.users WHERE users.id=" +
          id +
          " LIMIT 1; "
      )
      .then((rslt, err) => {
        result_json = rslt.rows;
        //console.log("Returning user Info");
      });

    // Adding company data
    await client
      .query(
        "SELECT companies.id, companies.created_at,companies.name,teams.contact_user FROM public.teams LEFT JOIN public.companies ON teams.company_id=companies.id  WHERE  teams.user_id=" +
          id +
          " ORDER BY companies.created_at ASC LIMIT 5"
      )
      .then((rslt, err) => {
        result_json[0].company = rslt.rows;
        //console.log("Returning user company data");
      });

    // Adding createdListings data
    await client
      .query(
        "SELECT * FROM public.listings WHERE listings.created_by=" +
          id +
          " ORDER BY listings.created_at ASC LIMIT 5"
      )
      .then((rslt, err) => {
        result_json[0].createdListings = rslt.rows;
        //console.log("Returning user createdListings data");
      });

    // Adding applications data
    await client
      .query(
        "SELECT * FROM public.applications WHERE applications.user_id=" +
          id +
          " ORDER BY applications.created_at ASC LIMIT 5"
      )
      .then((rslt, err) => {
        result_json[0].applications = rslt.rows;
        //console.log("Returning user createdListings data");
      });
    res.status(200).send(result_json);
  } else res.status(400).send("Please input valid id!!");
}
