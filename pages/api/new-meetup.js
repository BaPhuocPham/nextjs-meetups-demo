import { MongoClient } from "mongodb";

//this route will run in server side
// /api.new-meetup
// POST /api/new-meetup

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const client = await MongoClient.connect(
      "mongodb+srv://phuoc18112002:kakasi32PBP@cluster.f5igpzx.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = (await client).db();

    const meetupsCollection = db.collection("meetups");

    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    await client.close();

    res.status(201).json({ message: "Meetup inserted!" });
  }
}

export default handler;
