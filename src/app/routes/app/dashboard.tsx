import { Link } from 'react-router';

import { paths } from '@/config/paths';
import { useProjects } from '@/features/projects/api/get-projects';

import { useState } from 'react';

import type {
  SearchFilters,
  SortKey
} from '@/features/search-toolbar';

import {
  matchesFilters,
  sorters
} from '@/features/search-toolbar';

import { SearchToolbar } from '@/components/ui/search-toolbar';

const DashboardRoute = () => {
  const projectsQuery = useProjects();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilters>({languages: []})
  const [sort, setSort] = useState<SortKey>('default')

  if (projectsQuery.isPending) {
    return <p className="text-muted-foreground">Loading projects...</p>;
  }

  if (projectsQuery.isError) {
    return <p className="text-destructive">Could not load projects.</p>;
  }

  if (projectsQuery.data.data.length === 0) {
    return <p className="text-muted-foreground">No projects yet.</p>;
  }

  const projects = projectsQuery.data.data
    .filter((project) => matchesFilters(project, filters, searchQuery))
    .sort(sorters[sort]);

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>

      <SearchToolbar
        projects={projectsQuery.data.data}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        sort={sort}
        onSortChange={setSort}
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              className="flex h-full flex-col gap-2 rounded-xl border bg-card p-5 transition-colors hover:bg-accent"
              to={paths.app.project.getHref(project.id)}
            >
              <h2 className="text-base font-medium">{project.title}</h2>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {project.body}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardRoute;
