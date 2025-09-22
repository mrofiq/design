"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SearchBarProps } from '@/types/doctor';
import useDoctorSearchStore from '@/stores/doctorSearchStore';

interface DoctorSearchBarProps extends Omit<SearchBarProps, 'onChange' | 'onSearch'> {
  className?: string;
}

export function DoctorSearchBar({
  value,
  placeholder = "Cari dokter, spesialisasi, atau rumah sakit...",
  className,
}: DoctorSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    searchHistory,
    recentSearches,
    popularSearches,
    clearSearchHistory,
    getSuggestions,
    isSearching,
  } = useDoctorSearchStore();

  // Sync with store
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const suggestions = getSuggestions(inputValue);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setQuery(value);
    setOpen(value.length > 0);
  };

  const handleSearch = (searchValue: string) => {
    setQuery(searchValue);
    setInputValue(searchValue);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setInputValue('');
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    return `${Math.floor(diffInHours / 24)} hari lalu`;
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setOpen(true)}
              className="pl-10 pr-20 h-12 text-base"
              aria-label="Search doctors"
              aria-expanded={open}
              aria-haspopup="listbox"
              role="combobox"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isSearching && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
              {inputValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-6 w-6 p-0 hover:bg-muted"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0 shadow-lg border-0"
          align="start"
          sideOffset={4}
        >
          <Command className="border-0" shouldFilter={false}>
            <CommandList className="max-h-80">
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <CommandGroup heading="Saran Pencarian">
                  {suggestions.map((suggestion, index) => (
                    <CommandItem
                      key={`suggestion-${index}`}
                      value={suggestion}
                      onSelect={() => handleSearch(suggestion)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{suggestion}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Recent Searches */}
              {!inputValue && recentSearches.length > 0 && (
                <CommandGroup
                  heading="Pencarian Terbaru"
                >
                  {recentSearches.map((search, index) => (
                    <CommandItem
                      key={`recent-${index}`}
                      value={search.query}
                      onSelect={() => handleSearch(search.query)}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{search.query}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(search.timestamp)}
                      </span>
                    </CommandItem>
                  ))}
                  <div className="px-2 py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearchHistory}
                      className="h-6 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Hapus Riwayat
                    </Button>
                  </div>
                </CommandGroup>
              )}

              {/* Popular Searches */}
              {!inputValue && popularSearches.length > 0 && (
                <CommandGroup heading="Pencarian Populer">
                  {popularSearches.slice(0, 5).map((search, index) => (
                    <CommandItem
                      key={`popular-${index}`}
                      value={search.query}
                      onSelect={() => handleSearch(search.query)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{search.query}</span>
                      <Badge variant="secondary" className="text-xs">
                        {search.count}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Empty State */}
              {inputValue && suggestions.length === 0 && (
                <CommandEmpty className="py-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Tidak ada saran untuk "{inputValue}"
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tekan Enter untuk mencari
                    </p>
                  </div>
                </CommandEmpty>
              )}

              {/* No Data State */}
              {!inputValue && recentSearches.length === 0 && popularSearches.length === 0 && (
                <div className="py-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Mulai mengetik untuk mencari dokter
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Coba "dokter jantung" atau "Jakarta"
                    </p>
                  </div>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Quick Search Tags */}
      {!inputValue && (
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-sm text-muted-foreground mr-2">Populer:</span>
          {['Dokter Anak', 'Spesialis Jantung', 'BPJS', 'Jakarta'].map((tag, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSearch(tag)}
              className="h-7 text-xs rounded-full border-muted hover:bg-muted/50"
            >
              {tag}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}