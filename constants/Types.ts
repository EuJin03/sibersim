interface User {
  email: string;
  username: string;
  password: string;
  profilePicture: string;
  jobPosition: string;
  bios: string;
}

interface Group {
  name: string;
  description: string;
  members: { id: string }[];
  createdBy: string;
}

interface Quiz {
  tag: string;
  description: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Blog {
  title: string;
  image: string;
  authorId: string;
  slug: string;
  author: string;
  date: string;
  content: string[];
  category: string;
  tags: string[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  upvote: number;
  postedBy: string;
  commentsId: string[];
}

interface Comment {
  content: string;
  postedBy: string;
  upvote: number;
}

export type { User, Group, Quiz, Blog, Post, Comment };
