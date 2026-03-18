import { useEffect, useState } from 'react';
import './index.css';
import { translatePage } from './translatePage';

const STEPS = [
  'gender',
  'goal',
  'attraction',
  'interests',
  'birthday',
  'name',
  'email',
  'emailSent'
];

const RIGHT_MESSAGES = {
  gender: {
    title: '70 million people trust Vantage Dating.',
    label: 'Trust',
    text: 'Verified profiles, real people, and a safe place to meet online.'
  },
  popup: {
    title: '70 million people trust Vantage Dating.',
    label: 'Trust',
    text: 'Verified profiles, real people, and a safe place to meet online.'
  },
  goal: {
    title: 'Get replies more often than ever before.',
    label: 'Impression',
    text: 'Connect with active members who enjoy starting real conversations.'
  },
  attraction: {
    title: 'Your safety is backed by dedicated anti‑scam protection.',
    label: 'Protection',
    text: 'We continuously watch for and block suspicious behaviour to keep you safe.'
  },
  interests: {
    title: 'Every verified member has confirmed who they are.',
    label: 'Verification',
    text: 'Profile checks help you focus on genuine matches and real chemistry.'
  },
  birthday: {
    title: 'Get attention from people who find you attractive.',
    label: 'Attention',
    text: 'We highlight your profile for members who fit your preferences.'
  },
  name: {
    title: 'Chat, exchange letters and enjoy secure video calls.',
    label: 'Communication',
    text: 'Stay in touch in the way that feels most comfortable for you.'
  },
  email: {
    title: 'Your data stays private and protected.',
    label: 'Privacy',
    text: 'Modern security standards keep your personal details confidential.'
  },
  emailSent: {
    title: 'Your data stays private and protected.',
    label: 'Privacy',
    text: 'Modern security standards keep your personal details confidential.'
  }
};

function App() {
  const [step, setStep] = useState('gender');
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState('');
  const [attraction, setAttraction] = useState('');
  const [ageFrom, setAgeFrom] = useState('');
  const [ageTo, setAgeTo] = useState('');
  const [interests, setInterests] = useState([]);
  const [birthday, setBirthday] = useState({ day: '', month: '', year: '' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem('landing_language') || 'en'
  );
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [promoStage, setPromoStage] = useState('teaser'); // 'teaser' | 'form'
  const [promoShown, setPromoShown] = useState(false);

  const activeRight = RIGHT_MESSAGES[step];
  // Use Vite dev proxy (/api -> backend) so we avoid CORS issues
  const apiUrl = '';
  // Main app URL for legal pages (same routes as frontend: /about, /terms, /privacy, /safety)
  const frontendBase = (import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

  // Show promo popup once when user pauses anywhere on the landing flow
  useEffect(() => {
    if (promoShown) return;
    const timer = setTimeout(() => {
      setShowPromoPopup(true);
      setPromoShown(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [step, promoShown]);

  // Run whole-page translation when language changes (similar to main app)
  useEffect(() => {
    if (!language || language === 'en' || language === 'en-uk') return;
    // slight delay so initial render paints before translation
    const id = setTimeout(() => {
      translatePage(language);
    }, 300);
    return () => clearTimeout(id);
  }, [language, step]);

  const toggleInterest = (value) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const handleNext = async () => {
    setError('');

    if (step === 'goal' && !goal) {
      setError('Please choose what you are looking for.');
      return;
    }

    if (step === 'attraction' && !attraction) {
      setError('Please select who you are most attracted to.');
      return;
    }

    if (step === 'interests' && interests.length === 0) {
      setError('Please pick at least one thing you enjoy.');
      return;
    }

    if (step === 'birthday') {
      if (!birthday.day || !birthday.month || !birthday.year) {
        setError('Please enter your full date of birth.');
        return;
      }
      const dob = new Date(`${birthday.month} ${birthday.day}, ${birthday.year}`);
      const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (Number.isNaN(age) || age < 18) {
        setError('You must be at least 18 years old.');
        return;
      }
    }

    if (step === 'name' && !name.trim()) {
      setError('Please enter a name we can use for you.');
      return;
    }

    if (step === 'email') {
      const emailTrimmed = email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
        setError('Please enter a valid email address.');
        return;
      }

      // Call backend to send login link, then show popup on success
      try {
        setSubmitting(true);
        const res = await fetch(`${apiUrl}/api/auth/send-login-link`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailTrimmed })
        });
        if (!res.ok) {
          let message = 'Failed to send login link. Please try again.';
          try {
            const data = await res.json();
            if (data?.message) message = data.message;
          } catch {
            // ignore JSON parse errors
          }
          // Show popup anyway so user sees the "check your email" message,
          // but surface the backend error below the form.
          setError(message);
        } else {
          setStep('emailSent');
          return;
        }
      } catch (err) {
        setError(err.message || 'Failed to send login link. Please try again.');
      } finally {
        setSubmitting(false);
      }
      // Even if there was an error, move to the emailSent step so popup appears
      setStep('emailSent');
      return;
    }

    const currentIndex = STEPS.indexOf(step);
    if (currentIndex < STEPS.length - 1) {
      setStep(STEPS[currentIndex + 1]);
    }
  };

  const handleEmailSentClose = () => {
    // Close the popup and reload the landing page
    window.location.reload();
  };

  const handleOpenEmailInbox = () => {
    const addr = (email || '').toLowerCase();
    const domain = addr.split('@')[1] || '';

    let url = 'https://mail.google.com';
    if (domain.includes('yahoo.')) url = 'https://mail.yahoo.com';
    else if (domain.includes('outlook.') || domain === 'hotmail.com' || domain.includes('live.'))
      url = 'https://outlook.live.com';
    else if (domain === 'icloud.com' || domain.endsWith('me.com')) url = 'https://www.icloud.com/mail';

    window.open(url, '_blank');
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const handlePromoPrimaryClick = async () => {
    if (promoStage === 'teaser') {
      setPromoStage('form');
      return;
    }

    // promoStage === 'form' → act like email step: validate and send login link,
    // then show the main email-sent popup.
    setError('');
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) {
      setError('Please enter a name we can use for you.');
      return;
    }
    if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${apiUrl}/api/auth/send-login-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrimmed })
      });
      if (!res.ok) {
        let message = 'Failed to send login link. Please try again.';
        try {
          const data = await res.json();
          if (data?.message) message = data.message;
        } catch {
          // ignore JSON parse errors
        }
        setError(message);
      }
    } catch (err) {
      setError(err.message || 'Failed to send login link. Please try again.');
    } finally {
      setSubmitting(false);
    }

    setShowPromoPopup(false);
    setStep('emailSent');
  };

  const renderLeftCard = () => {
    const compatibility = step === 'gender' ? null : step === 'goal' ? 92 : step === 'emailSent' ? null : 95;

    // Shared title/content variables for all non-gender steps
    let title = '';
    let content = null;

    if (step === 'gender') {
      return (
        <div className="bg-white rounded-2xl shadow-xl px-8 pt-10 pb-8 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Tell us who you are</h2>
          <div className="space-y-3 mb-5">
            <button
              type="button"
              onClick={() => {
                setGender('man');
                // setShowPromoPopup(true); // popup disabled for now
                setStep('goal');
              }}
              className="w-full py-3.5 rounded-full font-semibold text-base text-white bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral hover:opacity-90 transition"
            >
              Man
            </button>
            <button
              type="button"
              onClick={() => {
                setGender('woman');
                // setShowPromoPopup(true); // popup disabled for now
                setStep('goal');
              }}
              className="w-full py-3.5 rounded-full font-semibold text-base text-white bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral hover:opacity-90 transition"
            >
              Woman
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-2">or</p>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-slate-300 rounded-full py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white overflow-hidden">
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-4 w-4"
              />
            </span>
            <span>Sign in with Google</span>
          </button>
        </div>
      );
    }

    if (step === 'emailSent') {
      // When the email popup is open, keep showing the email form behind it.
      // Reuse the same UI as the email step.
      title = 'What is your email address?';
      content = (
        <div className="space-y-3 mb-6">
          <p className="text-xs text-slate-500">
            We&apos;ll send you a link to verify your account when you finish registration.
          </p>
          <input
            type="email"
            placeholder="Your email"
            className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      );
    }

    const goals = ['Serious', 'Pen pal', 'Romantic', 'Flirty', 'Naughty'];
    const interestOptions = ['Games', 'Cooking', 'Nature', 'Dancing', 'Travelling', 'Biking', 'Camping', 'Movies'];

    const ageFromOptions = Array.from({ length: 75 - 18 + 1 }).map((_, i) => 18 + i);
    const ageToOptions = [
      ...Array.from({ length: 80 - 20 + 1 }).map((_, i) => 20 + i),
      '80+'
    ];

    if (step === 'goal') {
      title = 'What are you looking for?';
      content = (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {goals.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGoal(g)}
              className={`py-2.5 rounded-full border text-sm font-medium ${
                goal === g
                  ? 'text-white border-transparent bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral'
                  : 'border-slate-300 text-slate-800 hover:bg-slate-50'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      );
    } else if (step === 'attraction') {
      title = 'Who are you most attracted to?';
      content = (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            {['Men', 'Women', 'Both'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAttraction(opt)}
              className={`py-2.5 rounded-full border text-sm font-medium ${
                  attraction === opt
                    ? 'text-white border-transparent bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral'
                    : 'border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
            <span className="whitespace-nowrap text-xs">Between ages:</span>
            <select
              className="flex-1 border border-slate-300 rounded-full px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
              value={ageFrom}
              onChange={(e) => setAgeFrom(e.target.value)}
            >
              <option value="">From</option>
              {ageFromOptions.map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
            <span className="text-xs">to</span>
            <select
              className="flex-1 border border-slate-300 rounded-full px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
              value={ageTo}
              onChange={(e) => setAgeTo(e.target.value)}
            >
              <option value="">To</option>
              {ageToOptions.map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    } else if (step === 'interests') {
      title = 'What do you enjoy most?';
      content = (
        <>
          <p className="text-xs text-slate-500 mb-3">
            Choose one or more to find mutual interests.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {interestOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleInterest(opt)}
              className={`py-2.5 rounded-full border text-sm font-medium ${
                  interests.includes(opt)
                    ? 'text-white border-transparent bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral'
                    : 'border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      );
    } else if (step === 'birthday') {
      title = 'What is your date of birth?';
      content = (
        <div className="space-y-3 mb-6">
          <p className="text-xs text-slate-500">You must be at least 18 years old.</p>
          <div className="grid grid-cols-3 gap-3">
            <select
              className="border border-slate-300 rounded-full px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
              value={birthday.day}
              onChange={(e) => setBirthday({ ...birthday, day: e.target.value })}
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }).map((_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              className="border border-slate-300 rounded-full px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
              value={birthday.month}
              onChange={(e) => setBirthday({ ...birthday, month: e.target.value })}
            >
              <option value="">Month</option>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
                (m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                )
              )}
            </select>
            <select
              className="border border-slate-300 rounded-full px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
              value={birthday.year}
              onChange={(e) => setBirthday({ ...birthday, year: e.target.value })}
            >
              <option value="">Year</option>
              {Array.from({ length: 60 }).map((_, i) => {
                const yearVal = 2006 - i;
                return (
                  <option key={yearVal} value={String(yearVal)}>
                    {yearVal}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      );
    } else if (step === 'name') {
      title = 'What should we call you?';
      content = (
        <div className="space-y-3 mb-6">
          <p className="text-xs text-slate-500">
            How other users will call you. Can be changed at any time.
          </p>
          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      );
    } else if (step === 'email') {
      title = 'What is your email address?';
      content = (
        <div className="space-y-3 mb-6">
          <p className="text-xs text-slate-500">
            We&apos;ll send you a link to verify your account when you finish registration.
          </p>
          <input
            type="email"
            placeholder="Your email"
            className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      );
    }

    return (
      <div className="w-full max-w-md">
        {compatibility != null && (
          <p className="text-center text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
            {compatibility}%
            <span className="block text-sm md:text-base font-normal text-slate-500 mt-2">
              How well you match here
            </span>
          </p>
        )}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-5 text-center">{title}</h2>
          {content}
          {error && (
            <p className="text-xs text-red-500 mb-3 text-center">{error}</p>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="w-full py-3.5 rounded-full font-semibold text-base text-white bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && step === 'email' ? 'Sending…' : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  const getRightImage = () => {
    if (step === 'goal') return '/whatisyourgoal.png';
    if (step === 'attraction') return '/attracts.png';
    if (step === 'interests') return '/whodoyoulove.png';
    if (step === 'birthday') return '/birthday.png';
    if (step === 'name') return '/yourname.png';
    if (step === 'email' || step === 'emailSent') return '/enteremail.png';
    return '/gender-bg.png';
  };

  return (
    <div className="min-h-screen bg-[#ffe9de] text-slate-900 flex flex-col relative overflow-hidden">
      {/* Right-half full-height background image (behind header, main, footer on desktop) */}
      <div className="hidden md:block absolute inset-y-0 right-0 w-1/2">
        <img
          src={getRightImage()}
          alt="Happy person using dating app"
          className="w-full h-full object-cover"
        />
        {/* Uniform dark overlay for readability across all steps */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* Top bar / logo + language dropdown */}
      <header className="w-full px-4 md:px-8 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <img
            src="/logonew.png"
            alt="Vantage Dating"
            className="h-9 w-auto object-contain drop-shadow-sm"
          />
        </div>
        <div className="flex items-center">
          <select
            className="bg-black/60 text-white text-xs md:text-sm px-3 py-1.5 rounded-full border border-white/30 outline-none cursor-pointer"
            value={language}
            onChange={(e) => {
              const lang = e.target.value;
              setLanguage(lang);
              localStorage.setItem('landing_language', lang);
            }}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="zh">中文</option>
            <option value="it">Italiano</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </header>

      <main className="flex-1 flex items-stretch pb-10 relative z-10">
        <div className="w-full grid md:grid-cols-2 gap-0 items-stretch">
          {/* Left side: light gradient background with centered form card (template style).
              On mobile this comes second (below image), on desktop it is first. */}
          <div className="order-2 md:order-1 flex items-center justify-center py-10 bg-gradient-to-b from-[#ffe9de] via-[#ffeae2] to-[#ffe9e0] border-r border-white/60">
            {renderLeftCard()}
          </div>

          {/* Right side: image + copy. On mobile this comes first and spans full width,
              with its own background image; on desktop the image comes from the global half-width bg. */}
          <div className="relative order-1 md:order-2 flex items-end justify-center overflow-hidden pb-10 md:pb-20 min-h-[260px] md:min-h-0">
            {/* Mobile background image */}
            <img
              src={getRightImage()}
              alt="Happy person using dating app"
              className="absolute inset-0 w-full h-full object-cover md:hidden"
            />
            <div className="absolute inset-0 bg-black/40 md:hidden" />
            <div className="relative z-10 max-w-xl text-white px-10 text-center">
              <p className="text-xs md:text-sm uppercase tracking-[0.25em] mb-3 opacity-80">
                {activeRight?.label}
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 leading-snug">
                {activeRight?.title}
              </h2>
              <p className="text-sm md:text-lg text-white/85 max-w-xl mx-auto">
                {activeRight?.text}
              </p>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/60">
              For display purposes only. The individual in the image is not a user of this service.
            </div>
          </div>
        </div>
      </main>

      {/* Email-sent popup (centered, brand gradient layout) */}
      {step === 'emailSent' && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Close button */}
            <button
              type="button"
              onClick={handleEmailSentClose}
              className="absolute top-3 right-4 z-20 text-white/80 hover:text-white text-xl leading-none"
            >
              ×
            </button>

            {/* Top section - brand gradient (logo theme) */}
            <div className="bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral px-8 pt-12 pb-10 text-center text-white">
              <div className="mx-auto mb-6 h-24 w-32 rounded-xl flex items-center justify-center text-5xl bg-white/10 shadow-lg">
                ✉️
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                We’ve emailed you a secure login link
              </h2>
              <p className="text-sm text-white/90">
                Open the message we sent to{' '}
                <span className="font-semibold">
                  {email || 'your email address'}
                </span>{' '}
                and tap the link inside to finish signing in.
              </p>
            </div>

            {/* White bottom section */}
            <div className="bg-white px-8 py-6 text-center">
              <p className="text-xs text-slate-600 mb-4">
                Didn&apos;t receive anything yet? Check your spam or promotions folder, or request a fresh link from the login page.
              </p>
              <button
                type="button"
                onClick={handleOpenEmailInbox}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral hover:opacity-90 transition"
              >
                Go to your email inbox
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promo popup – appears while waiting on birthday step */}
      {showPromoPopup && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPromoPopup(false)}
              className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 text-xl leading-none z-10"
            >
              ×
            </button>

            {promoStage === 'teaser' && (
              <div className="px-6 pt-8 pb-6 text-center">
                <p className="text-xs font-semibold text-white bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral rounded-full inline-block px-3 py-1 mb-4">
                  Don&apos;t miss your perfect match
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  We have new members who are a great fit for you.
                </h3>
                <p className="text-xs text-slate-600 mb-5">
                  Create your free Vantage account to start talking to attractive, active singles right away.
                </p>
                <button
                  type="button"
                  onClick={handlePromoPrimaryClick}
                  className="w-full bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral hover:opacity-90 text-white text-sm font-semibold rounded-full py-3 mb-3"
                >
                  Create account
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full border border-slate-300 rounded-full py-3 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white overflow-hidden">
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="h-3 w-3"
                    />
                  </span>
                  <span>Sign in with Google</span>
                </button>
              </div>
            )}

            {promoStage === 'form' && (
              <div className="px-6 pt-8 pb-6 text-center">
                <p className="text-xs font-semibold text-white bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral rounded-full inline-block px-3 py-1 mb-4">
                  Finish setting up your profile
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Create your free Vantage account in seconds
                </h3>
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Name or nickname"
                    className="w-full rounded-full border border-slate-300 px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-vantage-pink"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Real email address"
                    className="w-full rounded-full border border-slate-300 px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-vantage-pink"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-[11px] text-vantage-pink mb-2">{error}</p>
                )}
                <button
                  type="button"
                  onClick={handlePromoPrimaryClick}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral hover:opacity-90 text-white text-sm font-semibold rounded-full py-3 mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating account…' : 'Create account'}
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full border border-slate-300 rounded-full py-3 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white overflow-hidden">
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="h-3 w-3"
                    />
                  </span>
                  <span>Sign in with Google</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="w-full py-4 text-[11px] text-slate-600 bg-transparent relative z-10">
        <div className="w-full px-4 md:px-8 grid md:grid-cols-2 gap-2">
          {/* Left side footer content, aligned with left section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-left flex-1">
              Copyright Vantage Dating 2026. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
              <a
                href="https://app.vantagedating.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-inherit"
              >
                About
              </a>
              <a
                href="https://app.vantagedating.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-inherit"
              >
                Terms &amp; Conditions
              </a>
              <a
                href="https://app.vantagedating.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-inherit"
              >
                Privacy Policy
              </a>
              <a
                href="https://app.vantagedating.com/safety"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-inherit"
              >
                Dating Security
              </a>
            </div>
          </div>
          {/* Empty right column so nothing overlaps image side text */}
          <div />
        </div>
      </footer>
    </div>
  );
}

export default App;

