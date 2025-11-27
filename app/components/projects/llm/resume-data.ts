// Pre-chunked resume data for context-aware LLM responses
// These chunks are optimized for semantic search and retrieval

export const resumeChunks = [
    {
        id: "resume-001",
        text: "Data Engineer at Ideon Technologies (2022-2025). Designed a Kubernetes-based system in Azure to execute ML model training. Developed systems to monitor and store optimization results, enabling horizontal scaling of geological analysis and reducing inversion time by 50% with cloud capabilities.",
        section: "Professional Experience",
        company: "Ideon Technologies"
    },
    {
        id: "resume-002",
        text: "Built event-driven pipelines processing terabytes of data from 100+ global sensors at Ideon Technologies, enhancing scalability and reliability. Developed monitoring and logging dashboards equipped with anomaly detection to trigger alerts for sensor issues, ensuring high data quality.",
        section: "Professional Experience",
        company: "Ideon Technologies"
    },
    {
        id: "resume-003",
        text: "Created containerized software and REST APIs in Azure to support ML workflows at Ideon Technologies. Researched and implemented 3D CNN models for state-of-the-art geological modelling. Deployed a RAG-based LLM system with REST APIs and Pinecone, enabling hundreds of users to query thousands of proprietary documents for scientific analysis.",
        section: "Professional Experience",
        company: "Ideon Technologies"
    },
    {
        id: "resume-004",
        text: "Started knowledge-sharing initiatives at Ideon Technologies to encourage cross-team collaboration. This helped build a strong culture of learning and information exchange across teams working on various data engineering and ML projects.",
        section: "Professional Experience",
        company: "Ideon Technologies"
    },
    {
        id: "resume-005",
        text: "Data Scientist at Pacmed (2020-2021) in Amsterdam, Netherlands. Fine-tuned ICU discharge model, achieving a 5% performance improvement. Established and monitored ETL pipelines for data QA, processing terabytes of medical data.",
        section: "Professional Experience",
        company: "Pacmed"
    },
    {
        id: "resume-006",
        text: "Discovered new predictive features and researched advanced interpretability techniques at Pacmed to enhance predictive accuracy. This work focused on improving model performance in healthcare settings with critical data.",
        section: "Professional Experience",
        company: "Pacmed"
    },
    {
        id: "resume-007",
        text: "Data Analyst & Software Engineer at AnalysisWorks (2017-2019) in Vancouver, BC. Collaborated with health authority executives and stakeholders to present hospital and occupancy planning initiatives using predictive models to estimate patient needs.",
        section: "Professional Experience",
        company: "AnalysisWorks"
    },
    {
        id: "resume-008",
        text: "Automated ETL pipelines in SQL Server at AnalysisWorks to process gigabytes of hospital patient data. Built an anomaly detection system to monitor ETL and ensure performance quality assurance.",
        section: "Professional Experience",
        company: "AnalysisWorks"
    },
    {
        id: "resume-009",
        text: "Programming & Frameworks: Python, R, C++, JavaScript/TypeScript, REST, FastAPI, Linux. Azure: Kubernetes, Azure Functions, CosmosDB, Azure Container Apps, Azure Data Factory, Azure Machine Learning, Azure Event Hub, Azure Service Bus.",
        section: "Skills",
        category: "Technical Skills"
    },
    {
        id: "resume-010",
        text: "AWS: AWS Lambda, S3, EC2, RDS. Google Cloud: Google Kubernetes Engine, Vertex AI, BigQuery. Databases: MongoDB, PostgreSQL, SQL Server, Pinecone, Graph Databases, TimescaleDB.",
        section: "Skills",
        category: "Cloud & Database Skills"
    },
    {
        id: "resume-011",
        text: "DevOps Tools: Git, Docker, Kubernetes, KEDA, Airflow, Terraform, CI/CD, Datadog. Machine Learning & AI: TensorFlow, PyTorch, Scikit-Learn, Pandas, PySpark, TensorFlow Extended, TensorFlow Lite, Data Version Control (DVC), Optuna, Langchain, NLP, LLMs.",
        section: "Skills",
        category: "DevOps & ML Skills"
    },
    {
        id: "resume-012",
        text: "Project Management & Collaboration: Agile and Scrum methodologies, technical writing, team leadership. Strong experience in cross-functional teamwork and communicating complex technical concepts to stakeholders.",
        section: "Skills",
        category: "Soft Skills"
    },
    {
        id: "resume-013",
        text: "Education: MSc in Data Science from Maastricht University, Netherlands. BSc in Computer Science and Mathematics from McGill University, Canada.",
        section: "Education",
        degree: "Advanced"
    },
    {
        id: "resume-014",
        text: "Authored data science articles that garnered 250,000+ views, sharing insights with the community. Completed 25+ online courses in machine learning, deep learning, and MLOps. Demonstrated commitment to continuous learning and knowledge sharing.",
        section: "Accomplishments",
        achievement: "Publications & Learning"
    },
    {
        id: "resume-015",
        text: "Presented 'Course Recommender Systems with Statistical Confidence' at the 2020 EDM Conference. This research contributed to the broader data science community's understanding of recommender systems.",
        section: "Accomplishments",
        achievement: "Conferences & Speaking"
    },
    {
        id: "resume-016",
        text: "Built a Proof of Concept for a startup reading emotion through speech emotional recognition, facial positioning recognition, and integrated Hume AI. The PoC was built in React and Node.js, demonstrating expertise in full-stack development with cutting-edge emotion AI technology.",
        section: "Projects",
        project: "Emotion Recognition"
    },
    {
        id: "resume-017",
        text: "Built Belugaro, a React and Node web app with a scalable AWS backend designed to teach languages with AI tools for translation and dynamic personalization algorithms. This demonstrates expertise in building scalable, AI-driven educational applications.",
        section: "Projects",
        project: "Language Learning Platform"
    }
];

export type ResumeChunk = typeof resumeChunks[0];
