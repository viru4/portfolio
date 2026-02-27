import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'

// Lazy-loaded pages for code splitting
const About = lazy(() => import('@/pages/About'))
const Projects = lazy(() => import('@/pages/Projects'))
const Skills = lazy(() => import('@/pages/Skills'))
const Certifications = lazy(() => import('@/pages/Certifications'))
const Contact = lazy(() => import('@/pages/Contact'))
const AiChatbot = lazy(() => import('@/components/AiChatbot'))

// Admin (lazy)
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const MessagesAdmin = lazy(() => import('@/pages/admin/MessagesAdmin'))
const ProjectsAdmin = lazy(() => import('@/pages/admin/ProjectsAdmin'))
const SkillsAdmin = lazy(() => import('@/pages/admin/SkillsAdmin'))
const CertificationsAdmin = lazy(() => import('@/pages/admin/CertificationsAdmin'))
const AboutAdmin = lazy(() => import('@/pages/admin/AboutAdmin'))

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public site ── */}
        <Route
          path="/*"
          element={
            <div className="relative flex min-h-screen flex-col bg-background text-foreground">
              {/* ML Grid Background */}
              <div className="ml-grid-bg pointer-events-none fixed inset-0 z-0" />
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/certifications" element={<Certifications />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <Suspense fallback={null}>
                <AiChatbot />
              </Suspense>
            </div>
          }
        />

        {/* ── Admin panel (no Navbar / Footer) ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="certs" element={<CertificationsAdmin />} />
          <Route path="about" element={<AboutAdmin />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
