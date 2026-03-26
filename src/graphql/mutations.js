import { gql } from '@apollo/client/core';

export const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token user { _id name email role }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token user { _id name email role }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: PostInput!) {
    createPost(input: $input) {
      _id slug title category
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: PostInput!) {
    updatePost(id: $id, input: $input) {
      _id slug title
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export const INCREMENT_VIEWS = gql`
  mutation IncrementViews($slug: String!) {
    incrementViews(slug: $slug) { _id views }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!, $parentComment: ID) {
    addComment(postId: $postId, content: $content, parentComment: $parentComment) {
      _id content createdAt
      author { _id name }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;
