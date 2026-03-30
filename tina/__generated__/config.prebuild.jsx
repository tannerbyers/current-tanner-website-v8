// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.GITHUB_BRANCH || "main",
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "src"
  },
  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "src/img"
    }
  },
  schema: {
    collections: [
      {
        name: "posts",
        label: "Blog Posts",
        path: "src/posts",
        frontmatterFormat: "yaml",
        extension: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            dateFormat: "YYYY-MM-DD"
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            ui: {
              component: "tags"
            }
          },
          {
            type: "image",
            name: "image",
            label: "Featured Image"
          },
          {
            type: "datetime",
            name: "lastModified",
            label: "Last Modified",
            dateFormat: "YYYY-MM-DD"
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
            default: false
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            templates: [],
            paths: []
          }
        ]
      },
      {
        name: "pages",
        label: "Pages",
        path: "src",
        frontmatterFormat: "yaml",
        match: {
          include: ["about/index", "speaking/index", "newsletter/index", "tech-services/index", "6-figure-tech-job/index", "contact-me/index", "privacy/index", "terms/index"]
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body"
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
