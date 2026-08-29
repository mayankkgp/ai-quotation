import React, { useState, useEffect, useRef } from 'react';
import { PhoneCall, Mail, Check, MessageCircle, X } from 'lucide-react';

/**
 * High-Density Inline Morphing Primary CTA Bar for Quotation Area
 * Replaces floating popovers with an ultra-compact single-row inline strip.
 */
export function PrimaryCtaBar({ authState, activeQuoteId }) {
  const [activeForm, setActiveForm] = useState(null); // 'callback' | 'email' | null
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const firstInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Auto-focus the first input field whenever the inline form opens
  useEffect(() => {
    if (activeForm && !authState?.isLoggedIn) {
      const timer = setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeForm, authState?.isLoggedIn]);

  // Reset success timers on unmount or activeQuoteId change
  useEffect(() => {
    let cbTimer;
    if (callbackSuccess) {
      cbTimer = setTimeout(() => {
        setCallbackSuccess(false);
      }, 4000);
    }
    return () => clearTimeout(cbTimer);
  }, [callbackSuccess]);

  useEffect(() => {
    let emailTimer;
    if (emailSuccess) {
      emailTimer = setTimeout(() => {
        setEmailSuccess(false);
      }, 4000);
    }
    return () => clearTimeout(emailTimer);
  }, [emailSuccess]);

  const isLoggedIn = authState?.isLoggedIn;

  // Handlers
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      `Hello Fabrito, I am interested in fabric quote details for session ${activeQuoteId || 'active'}.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleCallbackClick = () => {
    if (isLoggedIn) {
      setCallbackSuccess(true);
    } else {
      if (activeForm === 'callback') {
        setActiveForm(null);
        setFormErrors({});
      } else {
        setActiveForm('callback');
        setFormErrors({});
      }
    }
  };

  const handleEmailClick = () => {
    if (isLoggedIn) {
      setEmailSuccess(true);
    } else {
      if (activeForm === 'email') {
        setActiveForm(null);
        setFormErrors({});
      } else {
        setActiveForm('email');
        setFormErrors({});
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmitCallback = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.phone || formData.phone.trim().length < 6) {
      errors.phone = 'Valid phone number is required';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setActiveForm(null);
    setFormErrors({});
    setCallbackSuccess(true);
    setFormData({ name: '', businessName: '', phone: '', email: '' });
  };

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Valid email address is required';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setActiveForm(null);
    setFormErrors({});
    setEmailSuccess(true);
    setFormData({ name: '', businessName: '', phone: '', email: '' });
  };

  const handleCancelForm = () => {
    setActiveForm(null);
    setFormErrors({});
  };

  return (
    <div className="shrink-0 border-t border-neutral-100 bg-white p-2.5 z-20">
      {activeForm && !isLoggedIn ? (
        /* Single-Row Flex Inline Morphing Form Strip */
        <form
          id={`inline-morph-form-${activeForm}`}
          data-cta="true"
          onSubmit={activeForm === 'callback' ? handleSubmitCallback : handleSubmitEmail}
          className="flex items-center gap-1.5 w-full animate-in fade-in duration-150"
        >
          {/* [ Name ] */}
          <input
            ref={firstInputRef}
            id="inline-input-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="h-8 px-2 py-1 text-[11px] bg-neutral-50 border border-neutral-200/80 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-800 flex-1 min-w-0"
          />

          {/* [ Company ] */}
          <input
            id="inline-input-company"
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Company"
            className="h-8 px-2 py-1 text-[11px] bg-neutral-50 border border-neutral-200/80 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-800 flex-1 min-w-0"
          />

          {/* [ Phone / Email ] */}
          {activeForm === 'callback' ? (
            <input
              id="inline-input-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={formErrors.phone ? 'Phone required *' : 'Phone *'}
              title={formErrors.phone || 'Valid phone number is required'}
              className={`h-8 px-2 py-1 text-[11px] rounded-md focus:bg-white focus:outline-none focus:ring-1 flex-1 min-w-0 transition-colors ${
                formErrors.phone
                  ? 'border border-red-500 ring-1 ring-red-500 bg-red-50/30 placeholder:text-red-500'
                  : 'bg-neutral-50 border border-neutral-200/80 focus:ring-neutral-800'
              }`}
            />
          ) : (
            <input
              id="inline-input-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={formErrors.email ? 'Email required *' : 'Email *'}
              title={formErrors.email || 'Valid email address is required'}
              className={`h-8 px-2 py-1 text-[11px] rounded-md focus:bg-white focus:outline-none focus:ring-1 flex-1 min-w-0 transition-colors ${
                formErrors.email
                  ? 'border border-red-500 ring-1 ring-red-500 bg-red-50/30 placeholder:text-red-500'
                  : 'bg-neutral-50 border border-neutral-200/80 focus:ring-neutral-800'
              }`}
            />
          )}

          {/* [ Submit Button ] */}
          <button
            type="submit"
            id="btn-submit-inline-strip"
            className={`h-8 px-3 rounded-md text-[11px] font-medium text-white transition-colors cursor-pointer shrink-0 ${
              activeForm === 'email'
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-neutral-900 hover:bg-neutral-800'
            }`}
          >
            Submit
          </button>

          {/* [ ✕ Cancel Button ] */}
          <button
            type="button"
            id="btn-cancel-inline-strip"
            onClick={handleCancelForm}
            className="h-8 w-8 flex items-center justify-center text-black hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer shrink-0"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        /* Standard Split-Grouped Action Row */
        <div className="flex items-center justify-between gap-2">
          {/* Far Left: Email Quote */}
          <div>
            <button
              type="button"
              id="btn-cta-email"
              data-cta="true"
              onClick={handleEmailClick}
              className={`h-8 px-3 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 w-auto ${
                emailSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {emailSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Email Sent</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5 text-white/90 shrink-0" />
                  <span>Email Quote</span>
                </>
              )}
            </button>
          </div>

          {/* Far Right Cluster: WhatsApp & Callback */}
          <div className="flex items-center gap-1.5">
            {/* WhatsApp / Talk to us */}
            <button
              type="button"
              id="btn-cta-whatsapp"
              data-cta="true"
              onClick={handleWhatsAppClick}
              className="h-8 px-3 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <MessageCircle className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Talk to us</span>
            </button>

            {/* Request Callback */}
            <button
              type="button"
              id="btn-cta-callback"
              data-cta="true"
              onClick={handleCallbackClick}
              className={`h-8 px-3 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 w-auto ${
                callbackSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              {callbackSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Requested</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-3.5 h-3.5 text-white/90 shrink-0" />
                  <span>Request Callback</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
