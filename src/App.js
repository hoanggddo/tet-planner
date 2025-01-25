import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Calendar from './Calendar';
import Budget from './Budget';
import createCalendarEvent from './api';

function App() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  const [showImages, setShowImages] = useState(false); // Initially set to false (images hidden)

  // If the session changes (e.g., sign-in or sign-out), update the images visibility
  useEffect(() => {
    if (session) {
      setShowImages(true); // Show images when the user is signed in
    } else {
      setShowImages(false); // Hide images when the user is signed out
    }
  }, [session]); // Trigger the effect when session changes

  if (isLoading) {
    return <></>;
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
        redirectTo: window.location.href,
      },
    });

    if (error) {
      alert('Error logging in to Google provider with Supabase');
      console.log(error);
      return;
    }

    const { data: user } = await supabase.auth.getUser();
    const accessToken = user?.user_metadata?.google?.access_token;

    if (accessToken) {
      // Example event details (you can replace this with actual form data if needed)
      const eventDetails = {
        summary: 'Test Event',
        description: 'This is a test event',
        start: {
          dateTime: new Date().toISOString(),
          timeZone: 'America/New_York', // Adjust time zone as needed
        },
        end: {
          dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
          timeZone: 'America/New_York',
        },
      };

      await createCalendarEvent(accessToken, eventDetails); // Pass the access token and event details
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <Router>
      <div
        className="App"
        style={{
          backgroundColor: '#FEE2B3',
          padding: '20px',
          fontFamily: '"Times New Roman", Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Navigation Bar */}
        <nav
          style={{
            padding: '10px',
            backgroundColor: '#FF6900',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <div>
            <Link
              to="/"
              style={{
                color: '#fff',
                padding: '10px 20px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              Home 🌸
            </Link>
            <Link
              to="/calendar"
              style={{
                color: '#fff',
                padding: '10px 20px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              Calendar 🏮
            </Link>
            <Link
              to="/budget"
              style={{
                color: '#fff',
                padding: '10px 20px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              Budget 🧧
            </Link>
          </div>
          {session && (
            <button
              onClick={signOut}
              style={{
                backgroundColor: '#D84A00',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Sign Out 🦋
            </button>
          )}
        </nav>

        {/* Conditional rendering for Tết decoration images */}
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <>
                {/* Show images only if the user is signed in */}
                {showImages && (
                  <>
                    <img
                      src="/images/lanterns.png"
                      alt="Viet Tết Lanterns"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50px',
                        transform: 'translateY(-50%)',
                        width: '250px',
                        height: 'auto',
                        zIndex: 10,
                        backgroundColor: 'transparent',
                      }}
                    />
                    <img
                      src="/images/plum-blossoms.png"
                      alt="Plum Blossoms"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '50px',
                        transform: 'translateY(-50%)',
                        width: '250px',
                        height: 'auto',
                        zIndex: 10,
                      }}
                    />
                  </>
                )}

                <div
                  style={{
                    maxWidth: '400px',
                    margin: '30px auto',
                    backgroundColor: '#FFB81C',
                    borderRadius: '10px',
                    padding: '20px',
                    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {session ? (
                    <>
                      <h2
                        style={{
                          color: '#D84A00',
                          textAlign: 'center',
                          fontFamily: '"Times New Roman", Georgia, serif',
                          fontSize: '24px',
                        }}
                      >
                        Chúc Mừng Năm Mới 🎉
                        <br />
                        Welcome, {session.user.email}
                      </h2>
                      <Calendar session={session} />
                      <button
                        onClick={signOut}
                        style={{
                          backgroundColor: '#D84A00',
                          color: '#fff',
                          padding: '10px',
                          borderRadius: '5px',
                          width: '100%',
                          marginTop: '10px',
                        }}
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={googleSignIn}
                      style={{
                        backgroundColor: '#FF6900',
                        color: '#fff',
                        padding: '10px',
                        borderRadius: '5px',
                        width: '100%',
                      }}
                    >
                      Sign In With Google 🧧
                    </button>
                  )}
                </div>
              </>
            }
          />

          {/* Calendar Route (no images) */}
          <Route path="/calendar" element={<Calendar session={session} />} />

          {/* Budget Route (no images) */}
          <Route path="/budget" element={<Budget />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
