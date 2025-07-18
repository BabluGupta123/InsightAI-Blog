import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import BlogList from "../components/BlogList";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Header />
      <BlogList></BlogList>
      <Newsletter></Newsletter>
      <Footer></Footer>
    </>
  );
}

export default Home;
