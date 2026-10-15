import type { Dispatch, SetStateAction } from 'react';
import { useRef, useState } from 'react';

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

import { Button } from '@/components/ui/button/button';

import { Search, Funnel, ListSortAscending } from 'lucide-react';

type ProjectsToolbarProps = {
  searchQuery: string;
  onSearchQueryChange: Dispatch<SetStateAction<string>>;
};

type Panel = 'filter' | 'sort';

export const ProjectsToolbar = ({
  searchQuery,
  onSearchQueryChange,
}: ProjectsToolbarProps) => {
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
            {panel === 'filter' ? <FilterPanel /> : <SortPanel />}
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

const FilterPanel = () => {
  return <h4 className="font-medium">Filter</h4>;
};

const SortPanel = () => {
  return <h4 className="font-medium">Sort</h4>;
};
