import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <>
      <Navigation />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '24px',
          padding: '50px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <img 
            src={Logo} 
            alt="SermonDive Logo" 
            style={{ 
              width: '150px', 
              height: 'auto',
              margin: '0 auto 30px',
              display: 'block'
            }} 
          />
          
          <h1 style={{ 
            fontSize: '36px', 
            color: '#667eea', 
            marginBottom: '10px', 
            textAlign: 'center' 
          }}>
            Privacy Policy
          </h1>
          
          <p style={{ 
            textAlign: 'center', 
            color: '#666', 
            marginBottom: '40px',
            fontSize: '14px'
          }}>
            Last Updated: {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
          
          <div style={{ 
            lineHeight: '1.8', 
            color: '#333', 
            fontSize: '16px' 
          }}>
            {/* Introduction */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                Introduction
              </h2>
              <p>
                Welcome to SermonDive ("we," "our," or "us"). We are committed to protecting 
                your privacy and ensuring you have a positive experience on our website. This 
                Privacy Policy explains how we collect, use, disclose, and safeguard your 
                information when you visit our website{' '}
                <a href="https://sermondive.com" style={{ color: '#667eea' }}>
                  sermondive.com
                </a>.
              </p>
              <p style={{ marginTop: '10px' }}>
                By using SermonDive, you agree to the collection and use of information in 
                accordance with this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                1. Information We Collect
              </h2>
              
              <h3 style={{ 
                fontSize: '18px', 
                color: '#333', 
                marginTop: '20px',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                1.1 Information You Provide
              </h3>
              <p>
                When you use SermonDive, you may provide:
              </p>
              <ul style={{ marginLeft: '30px', marginTop: '10px' }}>
                <li>YouTube video URLs you submit for analysis</li>
                <li>Email address (if you create an account)</li>
                <li>Study preferences and customization options</li>
                <li>Any feedback or correspondence you send us</li>
              </ul>

              <h3 style={{ 
                fontSize: '18px', 
                color: '#333', 
                marginTop: '20px',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                1.2 Automatically Collected Information
              </h3>
              <p>
                We automatically collect certain information when you visit our site:
              </p>
              <ul style={{ marginLeft: '30px', marginTop: '10px' }}>
                <li><strong>Log Data:</strong> IP address, browser type, device information, pages visited</li>
                <li><strong>Usage Data:</strong> How you interact with our website and features</li>
                <li><strong>Cookies:</strong> Small data files stored on your device (see Cookie Policy below)</li>
              </ul>
            </section>

            {/* Google Analytics */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                2. Google Analytics
              </h2>
              <p>
                We use Google Analytics to understand how visitors use our site. Google Analytics 
                collects information such as:
              </p>
              <ul style={{ marginLeft: '30px', marginTop: '10px' }}>
                <li>Pages you visit and time spent on each page</li>
                <li>How you arrived at our site</li>
                <li>Your geographic location (city/country level)</li>
                <li>Device and browser information</li>
              </ul>
              <p style={{ marginTop: '15px' }}>
                <strong>Opting Out:</strong> You can opt out of Google Analytics by installing the{' '}
                <a 
                  href="https://tools.google.com/dlpage/gaoptout" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#667eea' }}
                >
                  Google Analytics Opt-out Browser Add-on
                </a>.
              </p>
              <p style={{ marginTop: '10px' }}>
                Learn more about how Google uses data:{' '}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#667eea' }}
                >
                  Google Privacy Policy
                </a>
              </p>
            </section>

            {/* Google AdSense */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                3. Google AdSense and Advertising
              </h2>
              <p>
                We use Google AdSense to display advertisements on our website. Google and its 
                partners may use cookies to serve ads based on your prior visits to our website 
                or other websites.
              </p>
              
              <h3 style={{ 
                fontSize: '18px', 
                color: '#333', 
                marginTop: '20px',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                How Ads Work
              </h3>
              <ul style={{ marginLeft: '30px', marginTop: '10px' }}>
                <li>Third-party vendors use cookies to serve ads based on your browsing history</li>
                <li>Ads may be personalized based on your interests</li>
                <li>We do not control the cookies placed by advertisers</li>
              </ul>

              <h3 style={{ 
                fontSize: '18px', 
                color: '#333', 
                marginTop: '20px',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                Your Ad Choices
              </h3>
              <p>
                You can opt out of personalized advertising by visiting:
              </p>
              <ul style={{ marginLeft: '30px', marginTop: '10px' }}>
                <li>
                  <a 
                    href="https://www.google.com/settings/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#667eea' }}
                  >
                    Google Ads Settings
                  </a>
                </li>
                <li>
                  <a 
                    href="https://optout.aboutads.info/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#667eea' }}
                  >
                    Digital Advertising Alliance Opt-Out
                  </a>
                </li>
                <li>
                  <a 
                    href="https://optout.networkadvertising.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#667eea' }}
                  >
                    Network Advertising Initiative Opt-Out
                  </a>
                </li>
              </ul>
            </section>

            {/* Cookies */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                4. Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our service 
                and store certain information. You can instruct your browser to refuse all cookies 
                or to indicate when a cookie is being sent.
              </p>
              
              <h3 style={{ 
                fontSize: '18px', 
                color: '#333', 
                marginTop: '20px',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                Types of Cookies We Use:
              </h3>
              <ul style={{ marginLeft: '30px', marginTop: '10px' }}>
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
                <li><strong>Advertising Cookies:</strong> Used to deliver relevant ads</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                5. How We Use Your Information
              </h2>
              <p>
                We use the information we collect to:
              </p>
              <ul style={{ marginLeft: '30px', marginTop: '10px' }}>
                <li>Generate personalized Bible study guides</li>
                <li>Improve and optimize our website and services</li>
                <li>Understand user behavior and preferences</li>
                <li>Communicate with you about updates or issues</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                6. How We Share Your Information
              </h2>
              <p>
                We do not sell your personal information. We may share information with:
              </p>
              <ul style={{ marginLeft: '30px', marginTop: '10px' }}>
                <li><strong>Service Providers:</strong> Google Analytics, Google AdSense, hosting providers</li>
                <li><strong>Legal Requirements:</strong> If required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
              </ul>
            </section>

            {/* Data Security */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                7. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures to protect your 
                personal information. However, no method of transmission over the Internet is 
                100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                8. Data Retention
              </h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the 
                purposes outlined in this Privacy Policy, unless a longer retention period is 
                required by law.
              </p>
            </section>

            {/* Your Rights */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                9. Your Privacy Rights
              </h2>
              <p>
                Depending on your location, you may have the following rights:
              </p>
              <ul style={{ marginLeft: '30px', marginTop: '10px' }}>
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Opt-Out:</strong> Opt out of marketing communications or data collection</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
              </ul>
              <p style={{ marginTop: '15px' }}>
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:privacy@sermondive.com" style={{ color: '#667eea' }}>
                  privacy@sermondive.com
                </a>
              </p>
            </section>

            {/* Children's Privacy */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                10. Children's Privacy
              </h2>
              <p>
                Our service is not directed to children under 13 (or 16 in the EU). We do not 
                knowingly collect personal information from children. If you believe we have 
                collected information from a child, please contact us immediately.
              </p>
            </section>

            {/* International Users */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                11. International Users
              </h2>
              <p>
                If you are accessing our website from outside the United States, please be aware 
                that your information may be transferred to, stored, and processed in the United 
                States where our servers are located.
              </p>
            </section>

            {/* Third-Party Links */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                12. Third-Party Links
              </h2>
              <p>
                Our website may contain links to third-party websites (such as YouTube). We are 
                not responsible for the privacy practices of these external sites. We encourage 
                you to read their privacy policies.
              </p>
            </section>

            {/* Changes to Policy */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                13. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the "Last 
                Updated" date.
              </p>
            </section>

            {/* Contact */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                color: '#764ba2', 
                marginBottom: '15px' 
              }}>
                14. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div style={{ 
                marginTop: '15px',
                padding: '20px',
                background: '#f8f7ff',
                borderRadius: '8px'
              }}>
                <p style={{ marginBottom: '5px' }}>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:privacy@sermondive.com" style={{ color: '#667eea' }}>
                    privacy@sermondive.com
                  </a>
                </p>
                <p>
                  <strong>Website:</strong>{' '}
                  <a href="https://sermondive.com" style={{ color: '#667eea' }}>
                    https://sermondive.com
                  </a>
                </p>
              </div>
            </section>

            {/* Consent */}
            <section style={{ 
              marginTop: '40px',
              padding: '20px',
              background: '#e8e5ff',
              borderRadius: '12px',
              border: '2px solid #667eea'
            }}>
              <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#667eea' }}>
                By using SermonDive, you acknowledge that you have read and understood this 
                Privacy Policy and agree to its terms.
              </p>
            </section>
          </div>
          
          {/* Back to Home Button */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link 
              to="/"
              style={{
                display: 'inline-block',
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}