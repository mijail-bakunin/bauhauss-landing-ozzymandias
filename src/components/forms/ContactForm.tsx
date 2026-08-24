import { useState, type FormEvent } from 'react'
import { budgetRanges, copy, projectTypes } from '../../data/content'
import type { Locale } from '../../types'
import { track } from '../../lib/analytics'

interface FormState {
  name: string
  email: string
  company: string
  projectType: string
  budget: string
  currency: 'USD' | 'ARS'
  message: string
  consent: boolean
}

const initialState: FormState = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  budget: '',
  currency: 'USD',
  message: '',
  consent: false,
}

export function ContactForm({ locale }: { locale: Locale }) {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const t = copy[locale]

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    if (status !== 'idle') setStatus('idle')
  }

  const validate = () => {
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = t.required
    if (!form.email.trim()) next.email = t.required
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = t.invalidEmail
    if (!form.projectType) next.projectType = t.required
    if (!form.message.trim()) next.message = t.required
    if (!form.consent) next.consent = t.required
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    track('form_submit_attempt', { locale })
    if (!validate()) return
    setStatus('sending')
    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!response.ok) throw new Error('Contact request failed')
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 900))
      }
      setStatus('success')
      setForm(initialState)
      track('form_submit_success', { locale, mode: endpoint ? 'api' : 'demo' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" noValidate onSubmit={submit} onFocus={() => track('form_start', { locale })}>
      <div className="form-row form-row--two">
        <label>
          <span>{t.formName} *</span>
          <input
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <small id="name-error" role="alert">{errors.name}</small>}
        </label>
        <label>
          <span>{t.formEmail} *</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <small id="email-error" role="alert">{errors.email}</small>}
        </label>
      </div>
      <div className="form-row form-row--two">
        <label>
          <span>{t.formCompany}</span>
          <input name="company" autoComplete="organization" value={form.company} onChange={(event) => update('company', event.target.value)} />
        </label>
        <label>
          <span>{t.formType} *</span>
          <select
            name="projectType"
            value={form.projectType}
            onChange={(event) => update('projectType', event.target.value)}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? 'type-error' : undefined}
          >
            <option value="">{t.projectTypePlaceholder}</option>
            {projectTypes[locale].map((type) => <option key={type}>{type}</option>)}
          </select>
          {errors.projectType && <small id="type-error" role="alert">{errors.projectType}</small>}
        </label>
      </div>
      <div className="form-row form-row--budget">
        <label>
          <span>{t.formBudget}</span>
          <select name="budget" value={form.budget} onChange={(event) => update('budget', event.target.value)}>
            <option value="">{t.budgetPlaceholder}</option>
            {budgetRanges.map((range) => <option key={range}>{range}</option>)}
          </select>
        </label>
        <fieldset>
          <legend>{t.formCurrency}</legend>
          {(['USD', 'ARS'] as const).map((currency) => (
            <label className="radio-control" key={currency}>
              <input
                type="radio"
                name="currency"
                value={currency}
                checked={form.currency === currency}
                onChange={() => update('currency', currency)}
              />
              <span>{currency}</span>
            </label>
          ))}
        </fieldset>
      </div>
      <label>
        <span>{t.formMessage} *</span>
        <textarea
          name="message"
          rows={5}
          value={form.message}
          onChange={(event) => update('message', event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && <small id="message-error" role="alert">{errors.message}</small>}
      </label>
      <label className="checkbox-control">
        <input type="checkbox" checked={form.consent} onChange={(event) => update('consent', event.target.checked)} />
        <span className="checkbox-shape" aria-hidden="true" />
        <span>{t.formConsent}</span>
      </label>
      {errors.consent && <small role="alert">{errors.consent}</small>}

      <div className="form-submit-row">
        <button className="assembly-button" data-magnetic type="submit" disabled={status === 'sending'}>
          <span>{status === 'sending' ? t.sending : t.submit}</span>
          <i aria-hidden="true" />
        </button>
        <p className={`form-status form-status--${status}`} aria-live="polite">
          {status === 'success' && t.demoSuccess}
          {status === 'error' && 'No se pudo completar el envío. Intentá nuevamente.'}
        </p>
      </div>
    </form>
  )
}
