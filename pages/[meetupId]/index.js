import { Fragment } from "react";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

function MeetupDetails(props) {
  console.log("props", props);
  const data = props.meetupData;
  return (
    <Fragment>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description}></meta>
      </Head>
      <MeetupDetail
        id={data.id}
        title={data.title}
        image={data.image}
        address={data.address}
        description={data.description}
      />
    </Fragment>
  );
}

//declare id for dynamic page for pre-reder of nextjs in running time
export async function getStaticPaths() {
  //fetch data from API
  const client = await MongoClient.connect(
    "mongodb+srv://phuoc18112002:kakasi32PBP@cluster.f5igpzx.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    //where variable like id in params is ready
    //if false if user access other id -> 404, if true will create a link for this id
    //when deploy we add more detial if false this detail page will 404 error
    //because all detail id will determine at buiding time
    fallback: "blocking", //=== true
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  //code in this function run in buiding time so console.log will show on terminal of server not in browser

  //fetch data for a sigle meetup

  const meetupId = context.params.meetupId;
  console.log(meetupId);

  const client = await MongoClient.connect(
    "mongodb+srv://phuoc18112002:kakasi32PBP@cluster.f5igpzx.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  console.log("select", selectedMeetup);

  await client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
