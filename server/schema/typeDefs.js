export const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    email: String!
    bio: String
    role: String!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Post {
    _id: ID!
    title: String!
    slug: String!
    excerpt: String!
    content: String!
    category: String!
    tags: [String]
    coverColor: String
    author: User
    views: Int!
    featured: Boolean!
    readTime: String!
    createdAt: String!
  }

  type Comment {
    _id: ID!
    content: String!
    post: ID!
    author: User
    parentComment: ID
    createdAt: String!
  }

  type PostsResult {
    posts: [Post!]!
    total: Int!
    pages: Int!
    currentPage: Int!
  }

  type Stats {
    totalPosts: Int!
    totalViews: Int!
    totalComments: Int!
    totalAuthors: Int!
  }

  input PostInput {
    title: String!
    excerpt: String!
    content: String!
    category: String!
    tags: [String]
    coverColor: String
    featured: Boolean
    readTime: String
  }

  type Query {
    getMe: User
    getPosts(category: String, search: String, page: Int, limit: Int): PostsResult!
    getPost(slug: String!): Post
    getComments(postId: ID!): [Comment!]!
    getStats: Stats!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createPost(input: PostInput!): Post!
    updatePost(id: ID!, input: PostInput!): Post!
    deletePost(id: ID!): Boolean!
    incrementViews(slug: String!): Post!
    addComment(postId: ID!, content: String!, parentComment: ID): Comment!
    deleteComment(id: ID!): Boolean!
  }
`;
