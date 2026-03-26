import { gql } from '@apollo/client/core';

export const GET_POSTS = gql`
  query GetPosts($category: String, $search: String, $page: Int, $limit: Int) {
    getPosts(category: $category, search: $search, page: $page, limit: $limit) {
      posts {
        _id slug title excerpt category tags coverColor featured views readTime createdAt
        author { _id name }
      }
      total pages currentPage
    }
  }
`;

export const GET_POST = gql`
  query GetPost($slug: String!) {
    getPost(slug: $slug) {
      _id slug title excerpt content category tags coverColor featured views readTime createdAt
      author { _id name bio }
    }
  }
`;

export const GET_COMMENTS = gql`
  query GetComments($postId: ID!) {
    getComments(postId: $postId) {
      _id content createdAt
      author { _id name }
      parentComment
    }
  }
`;

export const GET_STATS = gql`
  query GetStats {
    getStats { totalPosts totalViews totalComments totalAuthors }
  }
`;

export const GET_ME = gql`
  query GetMe {
    getMe { _id name email role bio }
  }
`;
