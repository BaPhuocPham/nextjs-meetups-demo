import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";

const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "A First Meetup",
    image:
      "https://i.pinimg.com/564x/13/17/4e/13174e15451caff5507642bf75db447a.jpg",
    address: "Some address 5, 12345 Some City",
    description: "This is a first meetup",
  },
  {
    id: "m2",
    title: "A Second Meetup",
    image:
      "https://i.pinimg.com/564x/6f/2a/43/6f2a43f1b79f3ec455ef36df86d35682.jpg",
    address: "Some address 5, 12345 Some City",
    description: "This is a second meetup",
  },
];

function HomePage(props) {
  return (
    <Fragment>
      {/* create a head for google search */}
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

//reder server side
//use when need to access req or res or the page reder continuous
//because server side will reder page when have request coming
// export async function getServerSideProps() {
//   const req = context.req;
//   const res = context.res;

//   //fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

//reder static page (client side)
export async function getStaticProps() {
  //fetch data from API
  const client = await MongoClient.connect(
    "mongodb+srv://phuoc18112002:kakasi32PBP@cluster.f5igpzx.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = (await client).db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  await client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    //data on server will update each 1s
    revalidate: 1,
  };
}

export default HomePage;
