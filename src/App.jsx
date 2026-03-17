import { useState } from 'react';
import './index.css';

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
  const [ageFrom, setAgeFrom] = useState(25);
  const [ageTo, setAgeTo] = useState(45);
  const [interests, setInterests] = useState([]);
  const [birthday, setBirthday] = useState({ day: '', month: '', year: '' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPromoPopup, setShowPromoPopup] = useState(false); // kept for later use (currently not shown)

  const activeRight = RIGHT_MESSAGES[step];

  const toggleInterest = (value) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const handleNext = () => {
    const currentIndex = STEPS.indexOf(step);
    if (currentIndex < STEPS.length - 1) {
      setStep(STEPS[currentIndex + 1]);
    }
  };

  const handleEmailSentClose = () => {
    setStep('gender');
  };

  const renderLeftCard = () => {
    const compatibility = step === 'gender' ? null : step === 'goal' ? 92 : step === 'emailSent' ? null : 95;

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
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      );
    }

    const goals = ['Serious', 'Pen pal', 'Romantic', 'Flirty', 'Naughty'];
    const interestOptions = ['Games', 'Cooking', 'Nature', 'Dancing', 'Travelling', 'Biking', 'Camping', 'Movies'];

    let title = '';
    let content = null;

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
              className="flex-1 border border-slate-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
              value={ageFrom}
              onChange={(e) => setAgeFrom(Number(e.target.value))}
            >
              {[18, 21, 25, 30, 35].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="text-xs">to</span>
            <select
              className="flex-1 border border-slate-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
              value={ageTo}
              onChange={(e) => setAgeTo(Number(e.target.value))}
            >
              {[30, 35, 40, 45, 50, 60].map((n) => (
                <option key={n} value={n}>
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
              className="border border-slate-300 rounded-md px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
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
              className="border border-slate-300 rounded-md px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
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
              className="border border-slate-300 rounded-md px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
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
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
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
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
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
              Your match compatibility score
            </span>
          </p>
        )}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-5 text-center">{title}</h2>
          {content}
          <button
            type="button"
            onClick={() => (step === 'email' ? setStep('emailSent') : handleNext())}
            className="w-full py-3.5 rounded-full font-semibold text-base text-white bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral hover:opacity-90 transition"
          >
            Next
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
            defaultValue="en"
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

      {/* Email-sent popup (centered) */}
      {step === 'emailSent' && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg text-center text-slate-900 relative">
            <button
              type="button"
              onClick={handleEmailSentClose}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-xl leading-none"
            >
              ×
            </button>
            <div className="mb-6">
              <div className="mx-auto h-20 w-28 rounded-lg flex items-center justify-center text-4xl bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral text-white">
                ✉️
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-3">
              We’ve sent a login link to your email
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Please open the email we sent to{' '}
              <span className="font-semibold text-slate-900">
                {email || 'your email address'}
              </span>{' '}
              and click the link to finish signing in.
            </p>
            <button
              type="button"
              onClick={handleEmailSentClose}
              className="mt-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-vantage-purple via-vantage-pink to-vantage-coral hover:opacity-90 transition"
            >
              Open your email
            </button>
          </div>
        </div>
      )}

      {/* Promo popup temporarily disabled */}
      {false && showPromoPopup && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            {/* ...popup content kept here for future use... */}
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
              <button className="hover:underline">About</button>
              <button className="hover:underline">Terms &amp; Conditions</button>
              <button className="hover:underline">Privacy Policy</button>
              <button className="hover:underline">Dating Security</button>
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

