// schemas/material.js
import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'material',
  title: 'Material',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'id',
      title: 'ID',
      type: 'string',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'string',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'string',
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'string',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'string',
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'string',
    },
    {
      name: 'topic',
      title: 'Topic',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'ID',
              type: 'string',
            },
            {
              name: 'topic',
              title: 'Topic',
              type: 'string',
            },
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'lesson',
              title: 'Lesson',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    {
                      name: 'id',
                      title: 'ID',
                      type: 'string',
                    },
                    {
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                    },
                  ],
                }),
              ],
            },
          ],
        }),
      ],
    },
  ],
})
