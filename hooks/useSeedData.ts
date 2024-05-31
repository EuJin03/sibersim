import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {
  User,
  Group,
  Quiz,
  Blog,
  Post,
  Comment,
  Template,
  Result,
} from '@/constants/Types';

const { users } = require('@/assets/seeds/user');
const { groups } = require('@/assets/seeds/group');
const { quizzes } = require('@/assets/seeds/quiz');
const { blogs } = require('@/assets/seeds/blog');
const { posts } = require('@/assets/seeds/post');
const { comments } = require('@/assets/seeds/comment');
const { templates } = require('@/assets/seeds/template');
const { results } = require('@/assets/seeds/result');

async function seedData() {
  const db = getFirestore();

  // Seed users
  const usersCollection = collection(db, 'users');
  const usersDocs = await Promise.all(
    users.map((user: User) => addDoc(usersCollection, user))
  );
  const usersData: { id: string; data: User }[] = usersDocs.map(
    (doc, index) => ({ id: doc.id, data: users[index] })
  );

  // // Seed groups
  const groupsCollection = collection(db, 'groups');
  const groupsDocs = await Promise.all(
    groups.map((group: Group) => addDoc(groupsCollection, group))
  );
  const groupsData: { id: string; data: Group }[] = groupsDocs.map(
    (doc, index) => ({ id: doc.id, data: groups[index] })
  );

  // Seed quizzes
  const quizzesCollection = collection(db, 'quizzes');
  const quizzesDocs = await Promise.all(
    quizzes.map((quiz: Quiz) => addDoc(quizzesCollection, quiz))
  );
  const quizzesData: { id: string; data: Quiz }[] = quizzesDocs.map(
    (doc, index) => ({ id: doc.id, data: quizzes[index] })
  );

  // Seed blogs
  const blogsCollection = collection(db, 'blogs');
  const blogsDocs = await Promise.all(
    blogs.map((blog: Blog) => {
      addDoc(blogsCollection, blog);
    })
  );
  const blogsData: { id: string; data: Blog }[] = blogsDocs.map(
    (doc, index) => {
      return { id: doc.id, data: blogs[index] };
    }
  );

  // Seed posts
  const postsCollection = collection(db, 'posts');
  const postsDocs = await Promise.all(
    posts.map((post: Post) => {
      addDoc(postsCollection, post);
    })
  );

  const postsData: { id: string; data: Post }[] = postsDocs.map(
    (doc, index) => {
      return { id: doc.id, data: posts[index] };
    }
  );

  // Seed comments
  const commentsCollection = collection(db, 'comments');
  const commentsDocs = await Promise.all(
    comments.map((comment: Comment) => {
      addDoc(commentsCollection, comment);
    })
  );
  const commentsData: { id: string; data: Comment }[] = commentsDocs.map(
    (doc, index) => {
      return { id: doc.id, data: comments[index] };
    }
  );

  // // Seed templates
  const templatesCollection = collection(db, 'templates');
  const templatesDocs = await Promise.all(
    templates.map((template: Template) => addDoc(templatesCollection, template))
  );
  const templatesData: { id: string; data: Template }[] = templatesDocs.map(
    (doc, index) => ({ id: doc.id, data: templates[index] })
  );

  // // Seed results
  const resultsCollection = collection(db, 'results');
  const resultsDocs = await Promise.all(
    results.map((result: Result) => {
      addDoc(resultsCollection, result);
    })
  );
  const resultsData: { id: string; data: Result }[] = resultsDocs.map(
    (doc, index) => {
      return { id: doc.id, data: results[index] };
    }
  );
}

export default seedData;

//  const blogsCollection = collection(db, 'blogs');
//  const blogsDocs = await Promise.all(
//    blogs.map((blog: Blog) => {
//      const authorRef = usersData.find(
//        user => user.data.username === blog.author
//      )?.data;
//      return addDoc(blogsCollection, { ...blog, authorId: authorRef?.id });
//    })
//  );
//  const blogsData: { id: string; data: Blog }[] = blogsDocs.map((doc, index) => {
//    const blog = blogs[index];
//    const authorRef = usersData.find(
//      user => user.data.username === blog.author
//    )?.data;
//    return { id: doc.id, data: { ...blog, authorId: authorRef?.id } };
//  });
