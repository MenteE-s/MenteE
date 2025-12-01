MenteE/
│
├── backend/
│ ├── app.py # Unified Flask app for all projects
│ ├── config.py # DB, env, global settings
│ ├── extensions.py # DB, JWT, etc.
│ ├── .env # Environment variables
│ ├── migrations/ # Shared DB migrations for all projects
│ ├── app/
│ │ ├── models/ # Shared database models
│ │ │ ├── **init**.py # Imports all models
│ │ │ ├── cvai/ # CvAI models (to be added)
│ │ │ └── recrui/ # RecruAI models
│ │ │ ├── models/ # Model definitions
│ │ │ ├── instance/ # DB instances (backups)
│ │ │ └── backups/ # DB backups
│ │ ├── blueprints/ # API blueprints
│ │ │ ├── common/ # Shared utilities
│ │ │ ├── cvai/ # CvAI API routes (to be added)
│ │ │ └── recrui/ # RecruAI API routes
│ │ └── services/ # Business logic and API handlers
│ │ ├── recrui/ # RecruiAI services
│ │ │ ├── api/ # RecruiAI API routes
│ │ │ └── ...
│ │ ├── cvai/ # CvAI services (to be added)
│ │ ├── rag/ # Shared RAG services
│ │ └── uploads/ # File uploads
│
├── frontend/
│ ├── recrui/ # RecruAI React app
│ └── package.json
│
├── database/
│ ├── emotions.db # SQLite backup of main DB
│ ├── schema.sql # DB schema backup
│ └── seeds.sql # Seed data
│
├── docker-compose.yml # Multi-container setup (to be configured)
└── README.md
