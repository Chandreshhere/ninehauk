import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductShowcase from './components/ProductShowcase'
import Scanner from './components/Scanner'
import Statement from './components/Statement'
import HowItWorks from './components/HowItWorks'
import About from './components/About'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProductShowcase />
      <Scanner />
      <Statement />
      <HowItWorks />
      <About />
      <Footer />
    </>
  )
}

export default App
