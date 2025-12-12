"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import { ProjectsCharts } from "@/components/projects/ProjectsCharts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { Project } from "@/types";
import Link from "next/link";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await api.getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProjects();
    }, []);

    if (isLoading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                        <p className="text-muted-foreground">Manage your conversion batches and view extraction performance.</p>
                    </div>
                    <Button asChild>
                        <Link href="/convert">
                            <Plus className="mr-2 h-4 w-4" /> New Project
                        </Link>
                    </Button>
                </div>

                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 border-2 border-dashed rounded-lg bg-muted/10">
                        <div className="p-4 rounded-full bg-muted">
                            <Plus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-lg font-semibold">No projects yet</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                Upload your first bank statement to start converting data.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/convert">
                                Create your first project
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <ProjectsCharts projects={projects} />
                        <ProjectsTable projects={projects} />
                    </>
                )}
            </div>
        </AppShell>
    );
}
