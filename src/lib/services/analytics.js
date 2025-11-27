/**
 * Analytics Service
 *
 * Provides tracking functions for datafa.st analytics.
 * Tracks user interactions, conversions, and custom events.
 */

import { browser } from '$app/environment';

/**
 * Track a custom event with datafa.st
 * @param {string} eventName - Name of the event to track
 * @param {Object} [properties={}] - Optional properties to include with the event
 * @returns {void}
 */
export function trackEvent(eventName, properties = {}) {
  if (!browser) return;

  try {
    window?.datafast?.(eventName, properties);
  } catch (err) {
    console.error('Analytics tracking error:', err);
  }
}

/**
 * Track user signup
 * @param {Object} params - Signup parameters
 * @param {string} [params.email] - User email
 * @param {string} [params.name] - User name
 * @param {string} [params.role] - User role (student/tutor)
 * @returns {void}
 */
export function trackSignup({ email, name, role } = {}) {
  trackEvent('signup', {
    email,
    name,
    role
  });
}

/**
 * Track user login
 * @param {Object} params - Login parameters
 * @param {string} [params.email] - User email
 * @param {string} [params.method] - Login method (email, oauth, etc.)
 * @returns {void}
 */
export function trackLogin({ email, method = 'email' } = {}) {
  trackEvent('login', {
    email,
    method
  });
}

/**
 * Track job creation
 * @param {Object} params - Job parameters
 * @param {string} [params.jobId] - Job ID
 * @param {string} [params.title] - Job title
 * @param {string} [params.category] - Job category
 * @param {number} [params.budget] - Job budget
 * @returns {void}
 */
export function trackJobCreated({ jobId, title, category, budget } = {}) {
  trackEvent('job_created', {
    job_id: jobId,
    title,
    category,
    budget
  });
}

/**
 * Track job application
 * @param {Object} params - Application parameters
 * @param {string} [params.jobId] - Job ID
 * @param {string} [params.applicantId] - Applicant user ID
 * @returns {void}
 */
export function trackJobApplication({ jobId, applicantId } = {}) {
  trackEvent('job_application', {
    job_id: jobId,
    applicant_id: applicantId
  });
}

/**
 * Track checkout initiation
 * @param {Object} params - Checkout parameters
 * @param {string} [params.name] - User name
 * @param {string} [params.email] - User email
 * @param {string} [params.productId] - Product/Job ID
 * @param {number} [params.amount] - Payment amount
 * @param {string} [params.currency] - Currency code
 * @returns {void}
 */
export function trackInitiateCheckout({ name, email, productId, amount, currency = 'USD' } = {}) {
  trackEvent('initiate_checkout', {
    name,
    email,
    product_id: productId,
    amount,
    currency
  });
}

/**
 * Track payment completion
 * @param {Object} params - Payment parameters
 * @param {string} [params.transactionId] - Transaction ID
 * @param {string} [params.productId] - Product/Job ID
 * @param {number} [params.amount] - Payment amount
 * @param {string} [params.currency] - Currency code
 * @param {string} [params.paymentMethod] - Payment method (crypto, etc.)
 * @returns {void}
 */
export function trackPaymentComplete({
  transactionId,
  productId,
  amount,
  currency = 'USD',
  paymentMethod
} = {}) {
  trackEvent('payment_complete', {
    transaction_id: transactionId,
    product_id: productId,
    amount,
    currency,
    payment_method: paymentMethod
  });
}

/**
 * Track message sent
 * @param {Object} params - Message parameters
 * @param {string} [params.conversationId] - Conversation ID
 * @param {string} [params.recipientId] - Recipient user ID
 * @returns {void}
 */
export function trackMessageSent({ conversationId, recipientId } = {}) {
  trackEvent('message_sent', {
    conversation_id: conversationId,
    recipient_id: recipientId
  });
}

/**
 * Track profile update
 * @param {Object} params - Profile parameters
 * @param {string} [params.userId] - User ID
 * @param {Array<string>} [params.fieldsUpdated] - List of fields that were updated
 * @returns {void}
 */
export function trackProfileUpdate({ userId, fieldsUpdated = [] } = {}) {
  trackEvent('profile_update', {
    user_id: userId,
    fields_updated: fieldsUpdated
  });
}

/**
 * Track resource view
 * @param {Object} params - Resource parameters
 * @param {string} [params.resourceId] - Resource ID
 * @param {string} [params.resourceType] - Type of resource
 * @param {string} [params.title] - Resource title
 * @returns {void}
 */
export function trackResourceView({ resourceId, resourceType, title } = {}) {
  trackEvent('resource_view', {
    resource_id: resourceId,
    resource_type: resourceType,
    title
  });
}

/**
 * Track tool usage
 * @param {Object} params - Tool parameters
 * @param {string} [params.toolName] - Name of the tool
 * @param {string} [params.action] - Action performed
 * @returns {void}
 */
export function trackToolUsage({ toolName, action } = {}) {
  trackEvent('tool_usage', {
    tool_name: toolName,
    action
  });
}

/**
 * Track page view (for SPA navigation)
 * @param {Object} params - Page parameters
 * @param {string} [params.path] - Page path
 * @param {string} [params.title] - Page title
 * @returns {void}
 */
export function trackPageView({ path, title } = {}) {
  trackEvent('page_view', {
    path,
    title
  });
}

/**
 * Track search
 * @param {Object} params - Search parameters
 * @param {string} [params.query] - Search query
 * @param {string} [params.category] - Search category/filter
 * @param {number} [params.resultsCount] - Number of results returned
 * @returns {void}
 */
export function trackSearch({ query, category, resultsCount } = {}) {
  trackEvent('search', {
    query,
    category,
    results_count: resultsCount
  });
}

/**
 * Track rating submission
 * @param {Object} params - Rating parameters
 * @param {string} [params.targetUserId] - User being rated
 * @param {number} [params.rating] - Rating value
 * @param {string} [params.jobId] - Related job ID
 * @returns {void}
 */
export function trackRatingSubmitted({ targetUserId, rating, jobId } = {}) {
  trackEvent('rating_submitted', {
    target_user_id: targetUserId,
    rating,
    job_id: jobId
  });
}

/**
 * Identify user for analytics
 * @param {Object} params - User parameters
 * @param {string} [params.userId] - User ID
 * @param {string} [params.email] - User email
 * @param {string} [params.name] - User name
 * @param {Object} [params.traits] - Additional user traits
 * @returns {void}
 */
export function identifyUser({ userId, email, name, traits = {} } = {}) {
  trackEvent('identify', {
    user_id: userId,
    email,
    name,
    ...traits
  });
}