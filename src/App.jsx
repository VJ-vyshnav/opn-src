import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import ImageCardCarousel from "./components/ImageCardCarousel.jsx";
import EventsTimeline from "./components/EventsTimeline.jsx";
import Projects from "./components/Projects.jsx";
import Team from "./components/Team.jsx";
import JoinForm from "./components/JoinForm.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <ImageCardCarousel />
        <EventsTimeline />
        <Projects />
        <Team />
        <JoinForm />
      </main>
      <Footer />
    </>
  );
}