import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || "main",
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "src/admin",
    publicFolder: "src",
  },
  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "src/img",
    },
  },
  schema: {
    collections: [
      {
        name: "posts",
        label: "Blog Posts",
        path: "src/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "image",
            name: "image",
            label: "Featured Image",
          },
          {
            type: "datetime",
            name: "lastModified",
            label: "Last Modified",
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
          },
        ],
      },
      {
        name: "pages",
        label: "Pages",
        path: "src",
        frontmatterFormat: "yaml",
        match: {
          include: "about/index,speaking/index,newsletter/index,tech-services/index,6-figure-tech-job/index,contact-me/index,privacy/index,terms/index",
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
          },
        ],
      },
    ],
  },
});