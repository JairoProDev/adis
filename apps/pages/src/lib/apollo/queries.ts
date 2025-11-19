import { gql } from '@apollo/client';

// Auth
export const SIGNUP = gql`
  mutation Signup($input: SignupInput!, $tenantId: String) {
    signup(input: $input, tenantId: $tenantId) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      avatar
      bio
      role
      createdAt
    }
  }
`;

// Business
export const CREATE_BUSINESS = gql`
  mutation CreateBusiness($input: CreateBusinessInput!) {
    createBusiness(input: $input) {
      id
      slug
      name
      tagline
      description
      logo
      coverImage
      email
      phone
      city
      country
    }
  }
`;

export const GET_BUSINESS = gql`
  query Business($slug: String!) {
    business(slug: $slug) {
      id
      slug
      name
      tagline
      description
      logo
      coverImage
      email
      phone
      whatsapp
      website
      address
      city
      country
      status
      verified
      featured
      plan
      viewCount
      owner {
        id
        firstName
        lastName
        avatar
      }
      listings {
        id
        slug
        title
        price
        city
      }
      reviews {
        id
        rating
        comment
        createdAt
        user {
          firstName
          avatar
        }
      }
    }
  }
`;

export const UPDATE_BUSINESS = gql`
  mutation UpdateBusiness($id: ID!, $input: UpdateBusinessInput!) {
    updateBusiness(id: $id, input: $input) {
      id
      name
      tagline
      description
      logo
    }
  }
`;

// Listings
export const CREATE_LISTING = gql`
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      slug
      title
      description
      price
      city
      status
    }
  }
`;

export const GET_LISTINGS = gql`
  query Listings($tenantId: String, $filters: ListingFilters) {
    listings(tenantId: $tenantId, filters: $filters) {
      id
      slug
      title
      description
      price
      priceType
      currency
      city
      country
      status
      featured
      viewCount
      createdAt
      category {
        id
        name
        slug
      }
      user {
        id
        firstName
        lastName
        avatar
      }
      business {
        id
        name
        slug
        logo
      }
      images {
        id
        url
      }
    }
  }
`;

export const GET_LISTING = gql`
  query Listing($slug: String!) {
    listing(slug: $slug) {
      id
      slug
      title
      description
      price
      priceType
      currency
      city
      country
      status
      featured
      viewCount
      metadata
      createdAt
      category {
        id
        name
        slug
        icon
      }
      user {
        id
        firstName
        lastName
        avatar
        phone
      }
      business {
        id
        name
        slug
        logo
        phone
        whatsapp
      }
      images {
        id
        url
        caption
      }
      reviews {
        id
        rating
        title
        comment
        createdAt
        user {
          id
          firstName
          avatar
        }
      }
    }
  }
`;

// Categories
export const GET_CATEGORIES = gql`
  query Categories {
    categories {
      id
      slug
      name
      description
      icon
      order
      active
    }
  }
`;

// Payments
export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession($planId: String!, $businessId: String) {
    createCheckoutSession(planId: $planId, businessId: $businessId)
  }
`;

export const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription($subscriptionId: String!) {
    cancelSubscription(subscriptionId: $subscriptionId)
  }
`;

// AI / ADIS
export const AI_CHAT = gql`
  mutation AiChat($input: ChatInput!) {
    aiChat(input: $input)
  }
`;

export const AI_GENERATE_BUSINESS_DESCRIPTION = gql`
  mutation AiGenerateBusinessDescription($input: GenerateDescriptionInput!) {
    aiGenerateBusinessDescription(input: $input)
  }
`;

export const AI_GENERATE_LISTING_DESCRIPTION = gql`
  mutation AiGenerateListingDescription($input: GenerateListingDescriptionInput!) {
    aiGenerateListingDescription(input: $input)
  }
`;

export const AI_ADD_KNOWLEDGE_BASE = gql`
  mutation AiAddKnowledgeBase($input: AddKnowledgeBaseInput!) {
    aiAddKnowledgeBase(input: $input)
  }
`;

export const AI_SEARCH_KNOWLEDGE_BASE = gql`
  query AiSearchKnowledgeBase($input: SearchKnowledgeBaseInput!) {
    aiSearchKnowledgeBase(input: $input) {
      id
      question
      answer
      score
    }
  }
`;

export const AI_AUTO_GENERATE_KNOWLEDGE_BASE = gql`
  mutation AiAutoGenerateKnowledgeBase($input: AutoGenerateKBInput!) {
    aiAutoGenerateKnowledgeBase(input: $input)
  }
`;

export const AI_SUGGEST_KNOWLEDGE_BASE = gql`
  mutation AiSuggestKnowledgeBase($input: SuggestKBInput!) {
    aiSuggestKnowledgeBase(input: $input) {
      question
      answer
      category
    }
  }
`;

// Page Builder
export const UPDATE_PAGE_CONFIG = gql`
  mutation UpdatePageConfig($input: UpdatePageConfigInput!) {
    updatePageConfig(input: $input) {
      id
      slug
      theme
    }
  }
`;

export const GET_PAGE_CONFIG = gql`
  query PageConfig($businessId: ID!) {
    pageConfig(businessId: $businessId) {
      id
      slug
      theme
    }
  }
`;
