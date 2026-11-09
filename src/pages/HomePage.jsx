import { useState } from 'react'
import TopBar from '../components/layout/TopBar.jsx'
import BrandRow from '../components/layout/BrandRow.jsx'
import MainNav from '../components/layout/MainNav.jsx'
import Footer from '../components/layout/Footer.jsx'
import Hero from '../components/home/Hero.jsx'
import FeaturedOpportunities from '../components/home/FeaturedOpportunities.jsx'
import Objectives from '../components/home/Objectives.jsx'
import StakeholderEcosystem from '../components/home/StakeholderEcosystem.jsx'
import PlacementProcess from '../components/home/PlacementProcess.jsx'
import PlatformAccess from '../components/home/PlatformAccess.jsx'
import CTASection from '../components/home/CTASection.jsx'
import SearchModal from '../components/ui/SearchModal.jsx'
import '../styles/home.css'

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      {/* <a href="#main-content" className="skip-link">
        Skip to main content
      </a> */}
      <TopBar />
      <BrandRow onSearchClick={() => setSearchOpen(true)} />
      <MainNav />
      <Hero onFindPlacement={() => setSearchOpen(true)} />
      <FeaturedOpportunities />
      <Objectives />
      <StakeholderEcosystem /> 
      <PlacementProcess />
      <PlatformAccess />
      <CTASection />
      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}