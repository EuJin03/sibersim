interface User {
  id?: string;
  email: string;
  displayName: string;
  profilePicture: string;
  jobPosition: string;
  phoneNum?: string;
  bios: string;
  isNewUser: boolean;
}

interface Group {
  id?: string;
  name: string;
  description: string;
  members: { id: string }[];
  createdBy: string;
  createdAt: string;
  templates: Template[];
  results: Result[];
}

interface Quiz {
  id?: string;
  tag: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Blog {
  id?: string;
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
  id?: string;
  title: string;
  content: string;
  image?: string;
  upvote: number;
  postedBy: string;
  commentsId: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface Comment {
  id?: string;
  content: string;
  postedBy: string;
  upvote: number;
}

interface Template {
  id?: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  template: string;
}

interface Result {
  id?: string;
  user: string;
  comment: string;
  templateId: string;
}

interface Topic {
  id: string;
  topic: string;
  name: string;
  lesson: Lesson[];
  input: null | string;
  output: null | string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
}

interface Material {
  type: 'video' | 'course';
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  videoUrl?: string;
  thumbnail?: string;
  topic?: Topic[];
}

export type {
  User,
  Group,
  Quiz,
  Blog,
  Post,
  Comment,
  Template,
  Result,
  Topic,
  Material,
};
