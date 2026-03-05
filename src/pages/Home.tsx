import HeroSection from '../components/home/HeroSection'
import IntroSection from '../components/home/IntroSection'
import NetworkSection from '../components/home/NetworkSection'
import EventsSection from '../components/home/EventsSection'
import VolunteerSection from '../components/home/VolunteerSection'
import NewsSection from '../components/home/NewsSection'

export default function Home() {
  return (
    <div className="bg-white overflow-hidden">
      <HeroSection />
      <IntroSection />
      <NetworkSection />
      <EventsSection />
      <VolunteerSection />
      <NewsSection />
    </div>
  )
}