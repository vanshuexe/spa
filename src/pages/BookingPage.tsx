import React, { useState } from 'react';
import { PageId } from '../types';
import {
  THERAPISTS_DATA,
  BANGALORE_AREAS,
  SPA_NAME,
  SPA_LOGO_URL,
  SPA_PHONE,
  SPA_WHATSAPP_LINK,
  PRICING_DATA,
} from '../data/siteData';

interface BookingPageProps {
  onNavigate: (page: PageId) => void;
  onShowAlert: (title: string, message: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  onNavigate,
  onShowAlert,
}) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'book' | 'login' | 'register'>('book');

  // Booking form state
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>('any');
  const [serviceStyle, setServiceStyle] = useState('Swedish Massage');
  const [selectedDuration, setSelectedDuration] = useState('90 Minutes');
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [locationType, setLocationType] = useState<'home' | 'hotel' | 'hotel-assist'>('home');
  const [area, setArea] = useState(BANGALORE_AREAS[0]);
  const [address, setAddress] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const durationPricingMap: Record<string, { price: number; label: string }> = {
    '60 Minutes': { price: 1799, label: '₹1,799 (60 Mins)' },
    '90 Minutes': { price: 2100, label: '₹2,100 (90 Mins - Recommended)' },
    '120 Minutes': { price: 3400, label: '₹3,400 (120 Mins - Ultimate Luxury)' },
    '30 Minutes': { price: 999, label: '₹999 (30 Mins Express)' },
    '45 Minutes': { price: 1299, label: '₹1,299 (45 Mins Express)' },
  };

  const currentPriceInfo = durationPricingMap[selectedDuration] || {
    price: 2100,
    label: '₹2,100',
  };

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      onShowAlert('Required Fields', 'Please enter your Full Name and 10-digit Mobile Number.');
      return;
    }
    if (clientPhone.trim().length < 9) {
      onShowAlert('Invalid Phone', 'Please provide a valid 9-10 digit mobile number.');
      return;
    }

    const therapistName =
      selectedTherapistId === 'any'
        ? 'Assigned Certified Therapist'
        : THERAPISTS_DATA.find((t) => t.id === selectedTherapistId)?.name || 'Certified Therapist';

    const bookingRef = `DRS-BLR-${Math.floor(100000 + Math.random() * 900000)}`;
    const hotelNote =
      locationType === 'hotel-assist'
        ? '\n(Hotel assistance requested: +Rs 1300 approx)'
        : '';

    onShowAlert(
      'Appointment Confirmed!',
      `Thank you ${clientName}! Your doorstep session for a ${selectedDuration} ${serviceStyle} with ${therapistName} on ${bookingDate} at ${bookingTime} in ${area} has been successfully scheduled.\n\nBooking Reference: ${bookingRef}\nTotal Rate: ₹${currentPriceInfo.price.toLocaleString()}${hotelNote}\n\nOur coordinator will call you from 9180471825 shortly to reconfirm.`
    );

    // Reset fields
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setAddress('');
    setSpecialInstructions('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim() || !loginPassword.trim()) {
      onShowAlert('Error', 'Please enter both your mobile number and password.');
      return;
    }
    onShowAlert(
      'Signed In Successfully',
      `Welcome back! Logged in as ${loginPhone}. You can now view all verified therapist profiles and your past appointments.`
    );
    setActiveTab('profiles');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      onShowAlert('Error', 'Please fill in all required registration fields.');
      return;
    }
    onShowAlert(
      'Registration Complete',
      `Your account has been created for ${regPhone}. A verification link has been sent to ${regEmail}. You now have full access to therapist profiles and booking discounts!`
    );
    setActiveTab('profiles');
  };

  return (
    <article className="col-xs-12 maincontent col-md-12 col-sm-12 max-w-5xl mx-auto px-4 sm:px-6">
      <header className="page-header text-center my-4">
        <img
          src={SPA_LOGO_URL}
          alt="Doorstep Royale Spa Logo"
          className="w-20 h-20 rounded-full object-cover border-2 border-[#a28321] shadow-lg mx-auto mb-2 bg-[#3a0202]"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <h1 className="page-title text-3xl font-bold text-[#840000]">
          Doorstep Royale Spa Bangalore
        </h1>
        <p className="text-sm font-semibold text-[#228b22] uppercase tracking-wider mt-1">
          Online Appointment Booking & Certified Therapist Profiles
        </p>
        <div className="ico-border mt-2">
          <i className="ico-bg flower"></i>
        </div>
      </header>

      {/* Quick Direct Contact Banner */}
      <div className="bg-[#fff9ef] border border-[#a28321] rounded-lg p-3 sm:p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">📞</span>
          <span className="text-sm font-bold text-[#840000]">
            Prefer Instant Booking by Phone or WhatsApp?
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            id="bookingPageCallBtn"
            href={`tel:${SPA_PHONE}`}
            className="btn btn-action text-xs sm:text-sm px-4 py-1.5 inline-flex items-center gap-1.5 no-underline text-[#ffdf88] hover:text-white"
          >
            <span>Call: {SPA_PHONE}</span>
          </a>
          <a
            id="bookingPageWhatsAppBtn"
            href={SPA_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1 no-underline shadow"
          >
            <span>💬 WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 my-4">
        <button
          id="tabBookAppointmentBtn"
          type="button"
          className={`px-5 py-2.5 rounded-t-lg font-bold text-base transition ${
            activeTab === 'book'
              ? 'bg-[#5a0101] text-[#81d742] shadow'
              : 'bg-white/50 text-[#840000] hover:bg-white/80'
          }`}
          onClick={() => setActiveTab('book')}
        >
          📅 Book Appointment
        </button>
        <button
          id="tabViewProfilesBtn"
          type="button"
          className={`px-5 py-2.5 rounded-t-lg font-bold text-base transition ${
            activeTab === 'profiles'
              ? 'bg-[#5a0101] text-[#81d742] shadow'
              : 'bg-white/50 text-[#840000] hover:bg-white/80'
          }`}
          onClick={() => setActiveTab('profiles')}
        >
          👤 View Therapist Profiles
        </button>
        <button
          id="tabClientLoginBtn"
          type="button"
          className={`px-5 py-2.5 rounded-t-lg font-bold text-base transition ${
            activeTab === 'login'
              ? 'bg-[#5a0101] text-[#81d742] shadow'
              : 'bg-white/50 text-[#840000] hover:bg-white/80'
          }`}
          onClick={() => setActiveTab('login')}
        >
          🔐 Client Sign In
        </button>
        <button
          id="tabClientRegisterBtn"
          type="button"
          className={`px-5 py-2.5 rounded-t-lg font-bold text-base transition ${
            activeTab === 'register'
              ? 'bg-[#5a0101] text-[#81d742] shadow'
              : 'bg-white/50 text-[#840000] hover:bg-white/80'
          }`}
          onClick={() => setActiveTab('register')}
        >
          📝 Register New Client
        </button>
      </div>

      {/* TAB 1: ONLINE BOOKING FORM */}
      {activeTab === 'book' && (
        <div className="panel max-w-3xl mx-auto my-4 bg-[#f5f0e8] border-2 border-[#840000] p-6 sm:p-8 rounded-lg shadow-md">
          <div className="border-b border-[#a28321]/40 pb-3 mb-6 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-2xl font-bold text-[#840000] m-0">
                Book a Doorstep Royale Spa Session
              </h4>
              <p className="text-sm text-[#228b22] m-0 mt-1 font-semibold">
                Professional doorstep wellness • Sanitized linens & organic oils • Punctual certified therapists
              </p>
            </div>
            <div className="bg-[#5a0101] text-[#ffdf88] px-4 py-2 rounded text-base font-bold shadow border border-[#a28321]">
              ₹{currentPriceInfo.price.toLocaleString()} ({selectedDuration})
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Step 1: Duration & Pricing Tier */}
            <div>
              <label className="block text-sm font-bold text-[#840000] mb-2">
                Select Duration & Pricing Tier <span className="text-danger">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRICING_DATA.map((tier) => (
                  <button
                    key={tier.duration}
                    type="button"
                    className={`p-3 rounded-lg border-2 text-center transition cursor-pointer ${
                      selectedDuration === tier.duration
                        ? 'bg-[#840000] text-white border-[#a28321] shadow-md'
                        : 'bg-white/70 text-[#840000] border-[#a28321]/50 hover:bg-white'
                    }`}
                    onClick={() => setSelectedDuration(tier.duration)}
                  >
                    <div className="text-sm font-bold">{tier.duration}</div>
                    <div
                      className={`text-lg font-extrabold ${
                        selectedDuration === tier.duration ? 'text-[#ffdf88]' : 'text-[#840000]'
                      }`}
                    >
                      {tier.formatted}
                    </div>
                    {tier.badge && (
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${
                          selectedDuration === tier.duration
                            ? 'bg-[#ffdf88] text-[#840000]'
                            : 'bg-[#e0d5c1] text-[#840000]'
                        }`}
                      >
                        {tier.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Therapist & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bkTherapist" className="block text-sm font-bold text-[#840000]">
                  Select Therapist Preference
                </label>
                <select
                  id="bkTherapist"
                  value={selectedTherapistId}
                  onChange={(e) => setSelectedTherapistId(e.target.value)}
                  className="form-control"
                >
                  <option value="any">Any Available Doorstep Royale Certified Therapist</option>
                  {THERAPISTS_DATA.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.gender}, {t.experience}, ★{t.rating})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="bkStyle" className="block text-sm font-bold text-[#840000]">
                  Massage Style <span className="text-danger">*</span>
                </label>
                <select
                  id="bkStyle"
                  value={serviceStyle}
                  onChange={(e) => setServiceStyle(e.target.value)}
                  className="form-control"
                >
                  <option value="Swedish Massage">Swedish Massage (Smooth flowing relaxation)</option>
                  <option value="Deep Tissue Massage">Deep Tissue Massage (Firmer pressure for muscle knots)</option>
                  <option value="Aromatherapy Massage">Aromatherapy Massage (Relaxing essential oils)</option>
                  <option value="Relaxation Massage">Relaxation Massage (Calming unwinding experience)</option>
                  <option value="Head, Neck & Shoulder Massage">Head, Neck & Shoulder Massage (Desk strain relief)</option>
                  <option value="Foot Massage">Foot Massage (Targeted reflexology)</option>
                  <option value="Balinese Massage">Balinese Massage (Acupressure & essential oils)</option>
                  <option value="Traditional Thai Massage">Traditional Thai (Yoga stretches, no oils)</option>
                </select>
              </div>
            </div>

            {/* Step 3: Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bkDate" className="block text-sm font-bold text-[#840000]">
                  Preferred Date <span className="text-danger">*</span>
                </label>
                <input
                  id="bkDate"
                  type="date"
                  required
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="form-control"
                />
              </div>

              <div>
                <label htmlFor="bkTime" className="block text-sm font-bold text-[#840000]">
                  Appointment Time Slot <span className="text-danger">*</span>
                </label>
                <select
                  id="bkTime"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="form-control"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 4: Location & Setting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bkArea" className="block text-sm font-bold text-[#840000]">
                  Bangalore Area <span className="text-danger">*</span>
                </label>
                <select
                  id="bkArea"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="form-control"
                >
                  {BANGALORE_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="bkLocType" className="block text-sm font-bold text-[#840000]">
                  Location Type <span className="text-danger">*</span>
                </label>
                <select
                  id="bkLocType"
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value as 'home' | 'hotel' | 'hotel-assist')}
                  className="form-control"
                >
                  <option value="home">My Home / Residence / Villa</option>
                  <option value="hotel">My Hotel / Service Apartment Room</option>
                  <option value="hotel-assist">Need Hotel Assistance (~Rs 1300 hotel cost)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="bkAddress" className="block text-sm font-bold text-[#840000]">
                Full Address / Apartment / Hotel Room Details <span className="text-danger">*</span>
              </label>
              <textarea
                id="bkAddress"
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Building name, flat/house number, street, landmark in Bangalore..."
                className="form-control"
              />
            </div>

            {/* Step 5: Client Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bkClientName" className="block text-sm font-bold text-[#840000]">
                  Your Full Name <span className="text-danger">*</span>
                </label>
                <input
                  id="bkClientName"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter name"
                  className="form-control"
                />
              </div>

              <div>
                <label htmlFor="bkClientPhone" className="block text-sm font-bold text-[#840000]">
                  Mobile Number (10 Digits) <span className="text-danger">*</span>
                </label>
                <input
                  id="bkClientPhone"
                  type="tel"
                  maxLength={10}
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="9876543210"
                  className="form-control"
                />
              </div>

              <div>
                <label htmlFor="bkClientEmail" className="block text-sm font-bold text-[#840000]">
                  Email Address
                </label>
                <input
                  id="bkClientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="form-control"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bkInstructions" className="block text-sm font-bold text-[#840000]">
                Special Instructions (Pain points, pressure preferences, notes)
              </label>
              <textarea
                id="bkInstructions"
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="E.g., focus on upper shoulder knots, light scent preferred, quiet session..."
                className="form-control"
              />
            </div>

            <div className="bg-[#e8decb] p-3 rounded text-xs text-[#228b22] leading-relaxed">
              <strong>Doorstep Royale Spa Guarantee:</strong> Transparent fixed rates (₹1,799 for 60m, ₹2,100 for 90m, ₹3400 for 120m). No unexpected surge pricing. The therapist brings sanitized fresh sheets, aromatic herbal oils, pain relief ointment, and ambient music directly to you.
            </div>

            <div className="text-center pt-2">
              <button
                id="submitBookingFormBtn"
                type="submit"
                className="btn btn-action text-lg px-10 py-3 shadow-md hover:scale-105 transition"
              >
                Confirm Doorstep Appointment (₹{currentPriceInfo.price.toLocaleString()} for {selectedDuration})
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: VIEW THERAPIST PROFILES */}
      {activeTab === 'profiles' && (
        <div className="space-y-6 my-6">
          <div className="bg-white/50 p-4 rounded-lg border border-[#a28321]/40 text-center">
            <h4 className="text-xl font-bold text-[#840000] mb-1">
              Verified Doorstep Royale Spa Therapists in Bangalore
            </h4>
            <p className="text-sm text-[#228b22] m-0 font-medium">
              Every therapist undergoes rigorous training to Doorstep Royale Spa standards. All therapists adhere to strict hygienic and professional ethics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {THERAPISTS_DATA.map((t) => (
              <div
                key={t.id}
                className="bg-[#f5f0e8] border-2 border-[#840000] p-5 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-center sm:items-start"
              >
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-md border-2 border-[#a28321] flex-shrink-0 shadow"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://californiamassage.in${t.photo}`;
                  }}
                />

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h3 className="text-2xl font-bold text-[#840000] m-0">{t.name}</h3>
                    <span className="text-amber-600 text-sm font-bold">
                      ★ {t.rating} ({t.reviewsCount} reviews)
                    </span>
                  </div>

                  <p className="text-xs text-[#b30af3] font-bold mt-1">
                    {t.gender} • {t.age} Years • {t.experience} Experience
                  </p>

                  <p className="text-xs text-[#333] leading-relaxed my-2 font-sans">
                    {t.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 my-2 justify-center sm:justify-start">
                    {t.specialties.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-[#e0d5c1] text-[#840000] text-[11px] font-bold px-2 py-0.5 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="btn btn-action text-xs px-4 py-1.5 mt-2"
                    onClick={() => {
                      setSelectedTherapistId(t.id);
                      setActiveTab('book');
                    }}
                  >
                    Book with {t.name} (From ₹1,799)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLIENT LOGIN */}
      {activeTab === 'login' && (
        <div className="max-w-md mx-auto my-6">
          <div className="panel panel-default bg-[#f5f0e8] border-2 border-[#840000] p-6 sm:p-8 rounded-lg shadow-md">
            <h4 className="text-center text-2xl font-bold text-[#840000] mb-2">
              Client Sign In
            </h4>
            <p className="text-center text-xs text-[#228b22] mb-4">
              Sign in with your mobile number to view scheduled sessions and past appointments.
            </p>
            <hr className="my-4 border-[#a28321]/40" />

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="loginUserPhone" className="block text-sm font-bold text-[#840000]">
                  Username (9-10 digit mobile number) <span className="text-danger">*</span>
                </label>
                <input
                  id="loginUserPhone"
                  type="tel"
                  required
                  maxLength={10}
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="9876543210"
                  className="form-control"
                />
              </div>

              <div>
                <label htmlFor="loginUserPass" className="block text-sm font-bold text-[#840000]">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  id="loginUserPass"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="form-control"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <a
                  href="#forgot"
                  className="text-[#840000] underline"
                  onClick={(e) => {
                    e.preventDefault();
                    onShowAlert(
                      'Password Recovery',
                      `Please contact Doorstep Royale Spa admin via WhatsApp (${SPA_PHONE}) to instantly reset your credentials.`
                    );
                  }}
                >
                  Forgot password?
                </a>

                <button
                  type="button"
                  className="text-[#b30af3] underline font-bold"
                  onClick={() => setActiveTab('register')}
                >
                  New client? Register here
                </button>
              </div>

              <div className="text-center pt-3">
                <button id="loginSubmitBtn" type="submit" className="btn btn-action w-full py-2.5">
                  Sign In to Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: CLIENT REGISTER */}
      {activeTab === 'register' && (
        <div className="max-w-md mx-auto my-6">
          <div className="panel panel-default bg-[#f5f0e8] border-2 border-[#840000] p-6 sm:p-8 rounded-lg shadow-md">
            <h4 className="text-center text-2xl font-bold text-[#840000] mb-2">
              Register a New Account
            </h4>
            <p className="text-center text-xs text-[#228b22] mb-4">
              Register to access complete verified therapist profiles and appointment history.
            </p>
            <hr className="my-4 border-[#a28321]/40" />

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label htmlFor="regUserEmail" className="block text-sm font-bold text-[#840000]">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  id="regUserEmail"
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="form-control"
                />
              </div>

              <div>
                <label htmlFor="regUserPhone" className="block text-sm font-bold text-[#840000]">
                  Mobile Number (10 digits) <span className="text-danger">*</span>
                </label>
                <input
                  id="regUserPhone"
                  type="tel"
                  maxLength={10}
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="9876543210"
                  className="form-control"
                />
                <small className="text-xs text-gray-500">
                  Verification details will be sent via SMS / WhatsApp
                </small>
              </div>

              <div>
                <label htmlFor="regUserPass" className="block text-sm font-bold text-[#840000]">
                  Create Password <span className="text-danger">*</span>
                </label>
                <input
                  id="regUserPass"
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="form-control"
                />
              </div>

              <div className="text-center pt-3">
                <button id="registerSubmitBtn" type="submit" className="btn btn-action w-full py-2.5">
                  Register Account
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-[#840000]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="underline text-[#b30af3] font-bold"
                    onClick={() => setActiveTab('login')}
                  >
                    Click here to Sign In
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>
  );
};
