# Lift Dashboard

An intelligent command center for managing vertical transport assets like elevators and escalators. This application provides real-time monitoring, incident management, and AI-powered analysis to improve operational efficiency and response times.

## Features

- **Command Center Dashboard:** Get a real-time overview of all assets, system uptime, and active high-priority incidents.
- **Incident Management:** Track, view, and manage all reported incidents. Click on any incident to see detailed information.
- **AI-Powered Analysis:** Leverage Genkit and Google's Gemini models to automatically summarize incident reports and suggest probable causes.
- **Asset Inventory:** A complete list of all managed assets, their status, type, location, and maintenance schedule.
- **Maintenance Scheduling:** View upcoming and in-progress maintenance tasks for all assets.
- **User Management:** (For Managers) View all personnel, their roles, and current duty status.
- **Authentication:** A simple role-based authentication system (Manager vs. Technician).

## Tech Stack

This project is built with a modern, production-ready tech stack:

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI:** [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **AI:** [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
- **Charts:** [Recharts](https://recharts.org/)
- **Tables:** [TanStack Table](https://tanstack.com/table/v8)
- **Forms:** [React Hook Form](https://react-hook-form.com/)

## Getting Started

To run the application locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at [http://localhost:9002](http://localhost:9002).

## Genkit AI Flows

This project includes AI-powered flows using Genkit. To run the Genkit development server for testing and debugging flows:

```bash
npm run genkit:dev
```

## Deployment

This application is configured for easy deployment with [Firebase App Hosting](https://firebase.google.com/docs/app-hosting). The configuration is located in `apphosting.yaml`.
