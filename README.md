# Lift Dashboard

An intelligent command center for managing vertical transport assets like elevators and escalators. This application provides real-time monitoring, incident management, and AI-powered analysis to improve operational efficiency and response times.

## Features

- **Command Center Dashboard:** Get a real-time overview of all assets, system uptime, and active high-priority incidents.
- **Incident Management:** Track, view, and manage all reported incidents. Click on any incident to see detailed information.
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

## Deployment to GitHub Pages

This repository is configured to automatically build and deploy to GitHub Pages.

### How it Works

A GitHub Actions workflow located in `.github/workflows/deploy.yml` is set up to run on every push to the `main` branch. It performs the following steps:

1.  Installs all necessary dependencies.
2.  Builds the Next.js application for static export (`next build`).
3.  Deploys the contents of the generated `out` directory to the `gh-pages` branch.

### Enabling Pages for Your Repository

To see your live site, you need to enable GitHub Pages in your repository settings:

1.  Navigate to your repository on GitHub.
2.  Go to **Settings** > **Pages**.
3.  Under "Build and deployment", select **Source** as **Deploy from a branch**.
4.  Select the `gh-pages` branch as the source and `/ (root)` as the folder.
5.  Click **Save**.

It may take a few minutes for your site to become available at `https://<your-username>.github.io/lift-dashboard/`.
