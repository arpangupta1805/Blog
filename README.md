# FusionBlog - Professional Blog Platform

A modern, responsive blog platform built with React, TypeScript, and TailwindCSS. Features a powerful admin panel with custom markdown-like parsing for rich content creation.

## Features

- 🎨 **Modern UI**: Beautiful, responsive design with dark/light theme support
- 📝 **Rich Text Editor**: Custom parsing system for blog content creation
- 🖼️ **Image Upload**: Upload local images directly from your computer
- 🗃️ **Interactive Tables**: Visual table editor with add/remove rows/columns
- 🔗 **Hyperlinks**: Easy link creation with dialog interface
- 👁️ **Live Preview**: See exactly how your blog will look before publishing
- 🔍 **Advanced Search**: Search by title, category, keywords, and content
- 🔐 **Admin Panel**: Secure admin access with password protection
- 📱 **Responsive**: Mobile-first design that works on all devices
- ⚡ **Fast**: Built with Vite for lightning-fast development and builds

## Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Install backend dependencies
cd server
npm install

# Start MongoDB (ensure it's running)
brew services start mongodb/brew/mongodb-community  # macOS
sudo systemctl start mongod                         # Linux

# Start backend server
npm start
```

### Access the Application

- **Blog**: `http://localhost:5173`
- **Admin Panel**: `http://localhost:5173/admin` (password: `admin123`)
- **API Health**: `http://localhost:3001/api/health`

## Content Parsing System

The blog editor uses a custom parsing system with special commands for rich content formatting:

### Structural Elements

| Command           | Usage                                     | Description                                        |
| ----------------- | ----------------------------------------- | -------------------------------------------------- |
| `/title`          | `/title Your Main Title`                  | Creates a main heading (H1)                        |
| `/subtitle`       | `/subtitle Section Title`                 | Creates a section heading (H2)                     |
| `/img`            | `/img https://example.com/image.jpg`      | Inserts an image from URL                          |
| **Upload Button** | Click "Upload" in toolbar                 | Upload local images from your computer             |
| `/imgcaption`     | `/imgcaption Image description`           | Adds caption to the previous image                 |
| `/code`           | `/code\nyour code here`                   | Creates a code block                               |
| `/table`          | Click "/table" button in toolbar          | Opens interactive table editor for creating tables |
| `\\hyperlink`     | `\\hyperlink{https://google.com}[Google]` | Creates a hyperlink that opens in new tab          |

### Text Formatting

| Syntax                   | Result      | Description                  |
| ------------------------ | ----------- | ---------------------------- |
| `**text**`               | **text**    | Bold formatting              |
| `*text*`                 | _text_      | Italic formatting            |
| `__text__`               | <u>text</u> | Underlined text              |
| `\\hyperlink{url}[text]` | [text](url) | Hyperlink (opens in new tab) |

### Example Blog Post

```markdown
/title Getting Started with React and TypeScript

/subtitle Why TypeScript with React?

TypeScript brings **static typing** to JavaScript, making your React applications more _robust_ and **maintainable**. Learn more from the \\hyperlink{https://www.typescriptlang.org/}[official TypeScript documentation].

/img https://images.unsplash.com/photo-1581091226825-a6a2a5aee158
/imgcaption TypeScript and React working together

/subtitle Setting Up Your Project

The easiest way to start is using Create React App:

/code
npx create-react-app my-app --template typescript
cd my-app
npm start

This combination provides a **powerful development experience** that scales well with team size. You can find more examples in the \\hyperlink{https://create-react-app.dev/docs/adding-typescript/}[Create React App TypeScript guide].
```

### Admin Panel Features

### Authentication

- Secure password protection (default: `admin123`)
- Session-based access control

### Content Management

- Create new blog posts with rich metadata
- Edit existing posts
- Delete posts with confirmation
- **Live preview** - See exactly how your post will look before publishing
- **Local image upload** - Upload images directly from your computer (converts to base64)
- **Interactive table editor** - Visual table creation with add/remove rows/columns
- **Hyperlink support** - Easy link creation with visual dialog interface
- Rich text editor with formatting toolbar

### Table Editor Features

- **Visual Interface**: Click `/table` button to open interactive table editor
- **Dynamic Sizing**: Add/remove rows and columns with + and - buttons
- **Easy Editing**: Click on cells to edit headers and data directly
- **Responsive Tables**: Tables render beautifully on all screen sizes
- **Professional Styling**: Clean borders and proper spacing

### Blog Post Metadata

When creating a post, you'll be prompted to enter:

- **Title**: The main title of your blog post
- **Author**: Author name
- **Date**: Publication date
- **Category**: Post category (e.g., Programming, AI, Design)
- **Keywords**: Comma-separated tags for search functionality
- **Cover Image**: URL to the main image for the post

## Project Structure

### Frontend (React + Vite)

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── BlogCard.tsx    # Blog post card component
│   ├── Layout.tsx      # Main layout wrapper
│   └── ...
├── pages/              # Page components
│   ├── Index.tsx       # Homepage with blog list
│   ├── BlogPost.tsx    # Individual blog post view
│   ├── Admin.tsx       # Admin dashboard
│   └── AdminEditor.tsx # Blog post editor
├── lib/                # Utilities and services
│   ├── api-service.ts  # API communication
│   └── blog-parser.ts  # Content parsing logic
├── types/              # TypeScript type definitions
│   └── blog.ts         # Blog-related interfaces
└── App.tsx             # Main application component
```

### Backend (Express + MongoDB)

```
server/
├── server.js           # Express server with MongoDB integration
└── package.json        # Backend dependencies
```

## Customization

### Styling

The application uses TailwindCSS with a custom design system. Modify `tailwind.config.ts` to customize:

- Colors and themes
- Typography scale
- Spacing and sizing
- Component variants

### Storage

Currently uses localStorage for data persistence. For production use, consider:

- Database integration (PostgreSQL, MongoDB)
- File-based storage
- Cloud storage solutions

### Authentication

The admin password is hardcoded for development. For production:

- Implement proper authentication
- Use environment variables
- Add user management
- Implement role-based access

## Build and Deploy

1. **Build for production**

   ```bash
   npm run build
   ```

2. **Test the build**

   ```bash
   npm run preview
   ```

3. **Deploy**
   The `dist` folder contains the production build ready for deployment to any static hosting service.

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run typecheck` - Type checking
- `npm run format.fix` - Format code with Prettier

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling framework
- **Radix UI** - Accessible UI primitives
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using modern web technologies. Perfect for developers, writers, and content creators who want a fast, customizable blog platform.
