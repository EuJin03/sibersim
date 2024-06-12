interface User {
  id?: string;
  email: string;
  displayName: string;
  profilePicture: string;
  jobPosition: string;
  phoneNum?: string;
  bios: string;
  isNewUser: boolean;
  group?: string;
}

interface Result {
  id?: string;
  user: string;
  comment: string;
  templateId: string;
  username: string;
  updatedAt?: string;
}

interface Group {
  id?: string;
  name: string;
  description: string;
  members: string[];
  invitationLink: string;
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
  content: string;
  image?: string[];
  upvote: string[];
  postedBy: string;
  authorId: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  authorJob: string;
  authorImage: string;
}

interface Comment {
  id?: string;
  content: string;
  postedBy: string;
  authorId: string;
  upvote: string[];
  authorJob: string;
  authorImage: string;
  createdAt?: string;
}

interface Template {
  id?: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  template: string;
  type: string;
  service: string;
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
  tags?: string[];
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
