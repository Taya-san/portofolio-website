import type { Dispatch, SetStateAction } from 'react';
import type { SearchFilters, SortKey } from '@/features/search-toolbar';
import type { CustomProject } from '@/types/api';
import { collectLanguages, SORT_OPTIONS } from '@/features/search-toolbar';
import { useRef, useState } from 'react';
import { capitalize } from '@/lib/capitalize';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from '@/components/ui/popover';

import {
  ToggleGroup,
  ToggleGroupItem
} from './toggle-group';

import { Button } from '@/components/ui/button/button';

import { Search, Funnel, ListSortAscending } from 'lucide-react';

type SearchToolbarProps = {
  projects: CustomProject[];
  searchQuery: string;
  onSearchQueryChange: Dispatch<SetStateAction<string>>;
  filters: SearchFilters;
  onFiltersChange: Dispatch<SetStateAction<SearchFilters>>;
  sort: SortKey;
  onSortChange: Dispatch<SetStateAction<SortKey>>;
};

type FilterPanelProps = {
  filters: SearchFilters;
  onFiltersChange: Dispatch<SetStateAction<SearchFilters>>;
  languageOptions: string[];
}

type SortPanelProps = {
  sort: SortKey;
  onSortChange: Dispatch<SetStateAction<SortKey>>;
}

type Panel = 'filter' | 'sort';

export const SearchToolbar = ({
  projects,
  searchQuery,
  onSearchQueryChange,
  filters,
  onFiltersChange,
  sort,
  onSortChange
}: SearchToolbarProps) => {
  const [panel, setPanel] = useState<Panel>('filter');
  const [open, setOpen] = useState<boolean>(false);

  const filterRef = useRef<HTMLButtonElement>(null);
  const sortRef = useRef<HTMLButtonElement>(null);
  const interactedOutside = useRef(false);

  const interactPanel = (which: Panel) => {
    if (open && panel === which) {
      setOpen(false);
      return;
    }
    setPanel(which);
    setOpen(true);
  };

  const languages = collectLanguages(projects);

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <InputGroup className="max-w-xs">
        <InputGroupInput
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <div className="relative flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor asChild>
            <div className="absolute inset-x-0 top-full" />
          </PopoverAnchor>

          <PopoverContent
            className="w-80"
            sideOffset={8}
            onInteractOutside={(e) => {
              e.preventDefault();
              setOpen(false);
              interactedOutside.current = true;
            }}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              if (!interactedOutside.current) {
                (panel === 'filter' ? filterRef : sortRef).current?.focus();
              }
              interactedOutside.current = false;
            }}
          >
            {
              panel === 'filter' ?
                <FilterPanel
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  languageOptions={languages}
                /> :
                <SortPanel
                  sort={sort}
                  onSortChange={onSortChange}
                />}
          </PopoverContent>
        </Popover>

        <Button
          ref={filterRef}
          size="icon-lg"
          className="rounded-full"
          variant={panel === 'filter' && open ? 'secondary' : 'outline'}
          onClick={() => interactPanel('filter')}
        >
          <Funnel />
        </Button>

        <Button
          ref={sortRef}
          size="icon-lg"
          className="rounded-full"
          variant={panel === 'sort' && open ? 'secondary' : 'outline'}
          onClick={() => interactPanel('sort')}
        >
          <ListSortAscending />
        </Button>
      </div>
    </div>
  );
};

const FilterPanel = ({
  filters,
  onFiltersChange,
  languageOptions
}: FilterPanelProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <h4 className="font-medium">Programming Language</h4>
      <ToggleGroup
        type="multiple"
        variant={'default'}
        value={filters.languages}
        onValueChange={(languages) => {
          onFiltersChange({
            ...filters,
            languages
          })
        }}
        className='w-full flex flex-wrap'
      >
        {
          languageOptions.map((language) => {
            return (
              <ToggleGroupItem
                key={language}
                value={language}
              >
                {capitalize(language)}
              </ToggleGroupItem>
            )
          })
        }
      </ToggleGroup>
    </div>
  )
};

const SortPanel = ({
  sort,
  onSortChange,
}: SortPanelProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <h4 className="font-medium">Sort</h4>
      <ToggleGroup
        type="single"
        variant={'default'}
        value={sort}
        onValueChange={(value) => {
          onSortChange((value || 'default') as SortKey)
        }}
        className='w-full flex flex-wrap'
      >
        {
          (SORT_OPTIONS.filter((sort) => sort.value !== 'default')).map((option) => {
            return (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </ToggleGroupItem>
            )
          })
        }
      </ToggleGroup>
    </div>
  );
};
