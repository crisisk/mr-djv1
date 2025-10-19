// schema.ts
import { gql } from 'apollo-server-express';
import { Event } from './models/Event'; // Assuming Event model is defined

// Define the GraphQL schema for event queries
export const typeDefs = gql`
  type Event {
    id: ID!
    name: String!
    date: String!
    location: String!
    dj: String!
    description: String
    price: Float
  }

  type Query {
    # Fetch all events
    events: [Event!]!
    
    # Fetch a single event by ID
    event(id: ID!): Event
  }
`;

// Resolvers for the event queries
export const resolvers = {
  Query: {
    events: async () => {
      try {
        // Fetch all events from the database
        const events = await Event.find();
        return events;
      } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
      }
    },
    
    event: async (_, { id }) => {
      try {
        // Fetch a single event by ID from the database
        const event = await Event.findById(id);
        if (!event) {
          throw new Error('Event not found');
        }
        return event;
      } catch (error) {
        console.error(`Error fetching event with ID ${id}:`, error);
        throw new Error('Failed to fetch event');
      }
    },
  },
};

// Example usage/test
// Assuming Apollo Server is set up and running
/*
const query = gql`
  query {
    events {
      id
      name
      date
      location
      dj
      description
      price
    }
  }
`;

const querySingleEvent = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      date
      location
      dj
      description
      price
    }
  }
`;

// Example usage with Apollo Client or GraphQL Playground
// Query all events:
// {
//   events {
//     id
//     name
//     date
//     location
//     dj
//     description
//     price
//   }
// }

// Query a single event by ID:
// query GetEvent($id: ID!) {
//   event(id: $id) {
//     id
//     name
//     date
//     location
//     dj
//     description
//     price
//   }
// }
*/
