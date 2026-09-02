import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Seo from '../components/Seo/Seo';
import Analytics from '../components/Analytics/Analytics';
import Hero from '../sections/Hero/Hero';
import Experience from '../sections/Experience/Experience';
import AboutPassport from '../sections/AboutPassport/AboutPassport';
import ObjectQuiz from '../sections/ObjectQuiz/ObjectQuiz';
import DocumentsComparison from '../sections/DocumentsComparison/DocumentsComparison';
import WhoNeedsPassport from '../sections/WhoNeedsPassport/WhoNeedsPassport';
import Process from '../sections/Process/Process';
import Advantages from '../sections/Advantages/Advantages';
import Prices from '../sections/Prices/Prices';
import RequiredDocuments from '../sections/RequiredDocuments/RequiredDocuments';
import Penalties from '../sections/Penalties/Penalties';
import RelatedServices from '../sections/RelatedServices/RelatedServices';
import Expert from '../sections/Expert/Expert';
import FAQ from '../sections/FAQ/FAQ';
import FinalCTA from '../sections/FinalCTA/FinalCTA';


export default function App() {
  return (
    <>
      <Seo />
      <Analytics />
      <Header />
      <main id="main-content">
        <Hero />
        <Experience />
        <AboutPassport />
        <ObjectQuiz />
        <DocumentsComparison />
        <WhoNeedsPassport />
        <Process />
        <Advantages />
        <Prices />
        <RequiredDocuments />
        <Penalties />
        <RelatedServices />
        <Expert />
        <FAQ />

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
