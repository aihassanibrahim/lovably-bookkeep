import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#2dd4bf',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>B</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>BizPal</span>
          </div>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <button 
              onClick={() => scrollToSection('funktioner')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Funktioner
            </button>
            <button 
              onClick={() => scrollToSection('priser')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Priser
            </button>
            <button 
              onClick={() => scrollToSection('om-oss')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Om oss
            </button>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={handleLoginClick}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px'
              }}
            >
              Logga in
            </button>
            <button 
              onClick={handleGetStarted}
              className="finpay-button-primary"
            >
              Kom igång gratis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: '96px',
        paddingBottom: '64px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h1 className="finpay-heading">
                Hantera ordrar enkelt,
                <br />
                <span style={{ color: '#2dd4bf' }}>spara tid automatiskt</span>
                <br />
                för ditt företag.
              </h1>
              <p className="finpay-subheading">
                Stöd små företag med enkel orderhantering, kraftfulla integrationer och verktyg för kassaflödeshantering.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', maxWidth: '400px' }}>
              <input
                type="email"
                placeholder="Din företags-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  height: '48px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
              <button 
                onClick={handleGetStarted}
                className="finpay-button-primary"
                style={{ whiteSpace: 'nowrap' }}
              >
                Kom igång →
              </button>
            </div>

            {/* Trust indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b' }}>
                <span>🏢</span>
                <span>Svenskt företag</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b' }}>
                <span>🔒</span>
                <span>GDPR-säkert</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b' }}>
                <span>⭐</span>
                <span>5-stjärnigt stöd</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div style={{ position: 'relative' }}>
            <div className="finpay-card" style={{ padding: '32px', maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#2dd4bf',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ color: 'white', fontSize: '16px' }}>📦</span>
                    </div>
                    <span style={{ fontWeight: '500', color: '#64748b' }}>Dina ordrar</span>
                  </div>
                  <span style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Aktiv
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="finpay-stats-number">234 ordrar</div>
                  <div className="finpay-stats-label">April 2024</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Orderhantering</span>
                    <span style={{ color: '#22c55e' }}>✓</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Kundregister</span>
                    <span style={{ color: '#22c55e' }}>✓</span>
                  </div>
                </div>

                <button className="finpay-button-primary" style={{ width: '100%' }}>
                  Hantera
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funktioner" style={{ padding: '64px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              backgroundColor: 'rgba(45, 212, 191, 0.1)',
              color: '#2dd4bf',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              FUNKTIONER
            </div>
            <h2 className="finpay-heading" style={{ marginBottom: '24px' }}>
              Upplevelse som växer
              <br />
              med din skala.
            </h2>
            <p className="finpay-subheading" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Designa ett operativsystem som fungerar för ditt företag och strömlinjeforma orderhantering
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '48px'
          }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <span style={{ fontSize: '32px' }}>💳</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Enkel orderhantering</h3>
              <p style={{ color: '#64748b' }}>
                Skapa en orderupplevelse och automatisera återkommande processer genom att schemalägga uppföljningar.
              </p>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <span style={{ fontSize: '32px' }}>🏢</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Kundregister</h3>
              <p style={{ color: '#64748b' }}>
                Hantera dina kunder med kontaktinformation och generera långsiktiga relationer lagrade i ditt system.
              </p>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <span style={{ fontSize: '32px' }}>🔒</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Säker datahantering</h3>
              <p style={{ color: '#64748b' }}>
                Hantera säkert dina data med avancerade säkerhetskontroller och GDPR-efterlevnad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '64px 0', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              backgroundColor: 'rgba(45, 212, 191, 0.1)',
              color: '#2dd4bf',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              VARFÖR OSS
            </div>
            <h2 className="finpay-heading">Varför de föredrar BizPal</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '48px'
          }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="finpay-stats-number" style={{ color: '#2dd4bf' }}>3k+</div>
              <div className="finpay-stats-label">Företag som redan kör på BizPal</div>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="finpay-stats-number">24%</div>
              <div className="finpay-stats-label">Intäktsförbättring</div>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="finpay-stats-number">180K</div>
              <div className="finpay-stats-label">I årlig intäkt</div>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="finpay-stats-number">10+</div>
              <div className="finpay-stats-label">Månader av tillväxt</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="priser" style={{ padding: '64px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              backgroundColor: 'rgba(45, 212, 191, 0.1)',
              color: '#2dd4bf',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              VÄLJ PLAN
            </div>
            <h2 className="finpay-heading" style={{ marginBottom: '24px' }}>
              Vi har hjälpt
              <br />
              innovativa företag
            </h2>
            <p className="finpay-subheading" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Hundratals av alla storlekar och inom alla branscher har gjort stora förbättringar med oss.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '32px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {/* Free Plan */}
            <div className="finpay-card" style={{ padding: '32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>Gratis</h3>
                <p style={{ color: '#64748b', fontSize: '18px' }}>Perfekt för att komma igång</p>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', fontWeight: '900', color: '#1e293b' }}>0 kr</div>
                <div style={{ color: '#64748b' }}>/månad</div>
              </div>
              
              <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Upp till 10 ordrar/månad</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Grundläggande kundhantering</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Produktkatalog</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>E-postsupport</span>
                </div>
              </div>

              <button 
                onClick={handleGetStarted}
                className="finpay-button-secondary"
                style={{ width: '100%' }}
              >
                Kom igång gratis
              </button>
            </div>

            {/* Pro Plan */}
            <div className="finpay-card" style={{ 
              padding: '32px', 
              border: '2px solid #2dd4bf',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#2dd4bf',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                POPULÄR
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>Pro</h3>
                <p style={{ color: '#64748b', fontSize: '18px' }}>För växande företag</p>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', fontWeight: '900', color: '#1e293b' }}>99 kr</div>
                <div style={{ color: '#64748b' }}>/månad</div>
              </div>
              
              <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Obegränsade ordrar</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Avancerad kundhantering</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Rapporter och analys</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Prioriterad support</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>API-åtkomst</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/pricing')}
                className="finpay-button-primary"
                style={{ width: '100%' }}
              >
                Uppgradera till Pro →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="finpay-gradient" style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-block',
              margin: '0 auto'
            }}>
              REDO ATT KOMMA IGÅNG
            </div>
            <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>
              Redo att höja nivån på din
              <br />
              orderprocess?
            </h2>
            <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '32px' }}>
              Stöd små företag med enkla orderverktyg, kraftfulla integrationer och verktyg för kassaflödeshantering.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={handleGetStarted}
                style={{
                  backgroundColor: 'white',
                  color: '#1e293b',
                  fontWeight: '600',
                  padding: '12px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Kom igång nu
              </button>
              <button 
                onClick={() => scrollToSection('om-oss')}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  fontWeight: '600',
                  padding: '12px 32px',
                  borderRadius: '12px',
                  border: '1px solid white',
                  cursor: 'pointer'
                }}
              >
                Läs mer →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="om-oss" style={{ padding: '64px 0', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{
                  backgroundColor: 'rgba(45, 212, 191, 0.1)',
                  color: '#2dd4bf',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'inline-block',
                  width: 'fit-content'
                }}>
                  OM BIZPAL
                </div>
                <h2 className="finpay-heading">
                  Byggt för svenska
                  <br />
                  småföretag
                </h2>
                <p className="finpay-subheading">
                  Vi förstår utmaningarna som svenska småföretag står inför. BizPal är designat för att förenkla din orderhantering och hjälpa dig fokusera på det du gör bäst.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(45, 212, 191, 0.1)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4px'
                  }}>
                    <span style={{ color: '#2dd4bf' }}>📦</span>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px', color: '#1e293b' }}>Enkel orderhantering</h4>
                    <p style={{ color: '#64748b' }}>Håll koll på alla dina ordrar från beställning till leverans</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(45, 212, 191, 0.1)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4px'
                  }}>
                    <span style={{ color: '#2dd4bf' }}>👥</span>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px', color: '#1e293b' }}>Kundregister</h4>
                    <p style={{ color: '#64748b' }}>Organisera och hantera alla dina kundkontakter på ett ställe</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(45, 212, 191, 0.1)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4px'
                  }}>
                    <span style={{ color: '#2dd4bf' }}>📊</span>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px', color: '#1e293b' }}>Insikter och rapporter</h4>
                    <p style={{ color: '#64748b' }}>Få värdefulla insikter om din verksamhet med enkla rapporter</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div className="finpay-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontWeight: '600', color: '#1e293b' }}>Månadens översikt</h4>
                    <span style={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      +12%
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '24px'
                  }}>
                    <div>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>47</div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>Ordrar</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e' }}>23,450 kr</div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>Intäkt</div>
                    </div>
                  </div>

                  <div style={{
                    height: '96px',
                    background: 'linear-gradient(to right, rgba(45, 212, 191, 0.1), rgba(45, 212, 191, 0.05))',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '16px'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '48px',
                      background: 'rgba(45, 212, 191, 0.3)',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '48px 0', backgroundColor: '#1e293b', color: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#2dd4bf',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px'
                }}>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>B</span>
                </div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>BizPal</span>
              </div>
              <p style={{ color: '#94a3b8' }}>
                Enkel orderhantering för svenska småföretag
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h5 style={{ fontWeight: '600' }}>Lösningar</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Småföretag</a>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Frilansare</a>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>E-handel</a>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Tjänster</a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h5 style={{ fontWeight: '600' }}>Företag</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Om oss</a>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Karriär</a>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Kontakt</a>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Press</a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h5 style={{ fontWeight: '600' }}>Lär dig</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Blogg</a>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Guider</a>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>API</a>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Mallar</a>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid #475569',
            marginTop: '48px',
            paddingTop: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
              © 2024 BizPal. Alla rättigheter förbehållna.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
                Integritetspolicy
              </a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
                Användarvillkor
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;