
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { AuthProvider } from './components/auth/AuthContext.tsx';
import LoginForm from "./components/LoginForm.tsx";
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import Dashboard from './components/DashBoard.tsx';
import BlogList from './components/blog/BlogList.tsx';
import { ToastContainer } from 'react-toastify';
import BlogDetailPage from './components/blog/BlogDetailPage.tsx';
import DocumentUpload from './components/document/DocumentUpload.tsx';
import { StudentListUI } from './components/StudentListUI/StudentListUI.tsx';
import Message from './components/message/Message.tsx';
import StudentRegistration from './components/studentregister/StudentRegistration.tsx';
import IndividualAssignments from './components/students/IndividualAssignments.tsx';

function App() {
     return (
          <>
               <ToastContainer position="top-right" autoClose={2000} />
               <AuthProvider>
                    <BrowserRouter>
                         <Routes>
                              <Route path="/" element={<LoginForm />} />
                              <Route path="/dashboard" element={
                                   <ProtectedRoute>
                                        <Dashboard />
                                   </ProtectedRoute>
                              } />
                              <Route path="/blogs" element={
                                   <ProtectedRoute>
                                        <BlogList />
                                   </ProtectedRoute>
                              } />
                              <Route path="/blogs/:id" element={
                                   <ProtectedRoute>
                                        <BlogDetailPage />
                                   </ProtectedRoute>
                              } />
                              <Route path="/message" element={
                                   <ProtectedRoute>
                                        <Message />
                                   </ProtectedRoute>
                              } />

                              <Route path="/message/:partnerId" element={
                                   <ProtectedRoute>
                                        <Message />
                                   </ProtectedRoute>
                              } />

                              <Route path="/document" element={<DocumentUpload />} />

                              <Route path="/StudentListUI" element={
                                   <ProtectedRoute>
                                        <StudentListUI />
                                   </ProtectedRoute>
                              } />

                              <Route path="/studentRegistration" element={
                                   <ProtectedRoute>
                                        <StudentRegistration />
                                   </ProtectedRoute>
                              } />

                              <Route path="/assignments/:studentId" element={
                                   <ProtectedRoute>
                                        <IndividualAssignments />
                                   </ProtectedRoute>
                              } />
                         </Routes>
                    </BrowserRouter>
               </AuthProvider>
          </>
     )
}

export default App
