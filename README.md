# FLMintDeals Backend - Strapi CMS

This is the Strapi backend for FLMintDeals, a cannabis deals platform running on PostgreSQL database.

## 🔑 Database Configuration

### PostgreSQL Credentials (Development)
- **Host**: localhost
- **Port**: 5432
- **Database**: flmintdeal_dev
- **Username**: postgres
- **Password**: postgres
- **Connection String**: `postgresql://postgres:postgres@localhost:5432/flmintdeal_dev`

### Environment Variables (.env)
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=flmintdeal_dev
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false
```

## 📊 Content Types & Data

The database contains **99 entities** across various content types:
- **Brands**: Cannabis brand information (2 entries)
- **Cities**: Florida cities with dispensaries (14 entries)
- **Stores**: Dispensary locations (6 entries)
- **Regions**: Geographic regions (8 entries)
- **Dosage Forms**: Product delivery methods (7 entries)
- **Deals**: Cannabis deals and promotions
- **Announcements**: Site announcements
- **Events**: Cannabis events
- **Jobs**: Employment opportunities

## 🚀 Getting started with Strapi

### Prerequisites
1. **Docker Desktop** - Required for PostgreSQL database
2. **Node.js** v18+ - For running Strapi

### Database Setup
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Verify database is running
docker ps | grep postgres
```

### Development Commands

#### `develop`
Start your Strapi application with autoReload enabled:
```bash
npm install                 # Install dependencies
npm run develop            # Start development server
# or
npm run dev                # Alias for develop
```

**Access Points:**
- **Admin Panel**: http://localhost:1337/admin
- **API**: http://localhost:1337/api/*
- **Documentation**: http://localhost:1337/documentation

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

### Production Deployment (Fly.io)
The backend is configured for deployment on Fly.io with PostgreSQL:

```bash
# Deploy to production
fly deploy --app flmintdeal

# Set up PostgreSQL on Fly.io (first time)
fly pg create --name flmintdeal-db --region ord
fly pg attach flmintdeal-db --app flmintdeal
```

### Production Environment
- **URL**: https://flmintdeal-dev.fly.dev
- **Admin**: https://flmintdeal-dev.fly.dev/admin
- **API**: https://flmintdeal-dev.fly.dev/api/*

For more deployment options, browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment).

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
