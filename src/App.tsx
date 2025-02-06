import { LandingPage } from "./components/LandingPage"
import { Nav } from "./components/Nav"
import { BrowserRouter as Router, Route, Routes } from "react-router"
import SongList from "./components/SongList"
import { CreateSongForm } from "./components/CreateSong"

function App() {


  return (
    <>
        <Router>
          <Nav />
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/songs" element={<SongList />} />
          <Route path="/create" element={<CreateSongForm />} />
          </Routes>
        </Router>
    </>
  )
}

export default App
