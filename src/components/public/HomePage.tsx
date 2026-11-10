import HomeHero from "./home/HomeHero";
import HomeServicesSection from "./home/HomeServicesSection";
import LatestAnnouncementsSection from "./home/LatestAnnouncementsSection";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeServicesSection />
      <LatestAnnouncementsSection />
    </>
  );
}
