import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Doctor,
  SearchFilters,
  SearchResults,
  SearchState,
} from '@/types/doctor';
import {
  allMockDoctors,
  mockSpecializations,
  mockClinics,
  popularSearches,
  searchSuggestions,
} from '@/data/mockDoctors';

interface DoctorSearchStore extends SearchState {
  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  searchDoctors: () => Promise<void>;
  selectDoctor: (doctor: Doctor) => void;
  clearSelectedDoctor: () => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setLoading: (isLoading: boolean) => void;

  // Computed getters
  getFilteredDoctors: () => Doctor[];
  getAvailableFilters: () => SearchResults['filters'];
  getSuggestions: (query: string) => string[];
}

const initialFilters: SearchFilters = {
  query: '',
  specializations: [],
  locations: [],
  locationRadius: 10,
  languages: [],
  insuranceProviders: [],
  minRating: undefined,
  priceRange: undefined,
  availableToday: undefined,
  availableThisWeek: undefined,
  acceptingNewPatients: undefined,
  clinicType: [],
  sortBy: 'relevance',
};

const useDoctorSearchStore = create<DoctorSearchStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoading: false,
      isSearching: false,
      query: '',
      filters: initialFilters,
      results: undefined,
      selectedDoctor: undefined,
      searchHistory: [],
      recentSearches: [],
      popularSearches: popularSearches.map(query => ({ query, count: Math.floor(Math.random() * 100) + 50 })),

      // Actions
      setQuery: (query: string) => {
        set({ query });

        // Auto-search if query is not empty
        if (query.trim().length > 0) {
          const store = get();
          store.searchDoctors();
        } else {
          set({ results: undefined });
        }
      },

      setFilters: (newFilters: Partial<SearchFilters>) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };
        set({ filters: updatedFilters });

        // Trigger search with new filters
        const store = get();
        store.searchDoctors();
      },

      resetFilters: () => {
        set({ filters: initialFilters });
        const store = get();
        store.searchDoctors();
      },

      searchDoctors: async () => {
        const { query, filters } = get();

        set({ isSearching: true });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
          const filteredDoctors = get().getFilteredDoctors();

          // Sort doctors based on sortBy filter
          const sortedDoctors = [...filteredDoctors].sort((a, b) => {
            switch (filters.sortBy) {
              case 'rating':
                return b.rating.overall - a.rating.overall;
              case 'price_low':
                return a.consultationFees.min - b.consultationFees.min;
              case 'price_high':
                return b.consultationFees.max - a.consultationFees.max;
              case 'experience':
                return b.experienceYears - a.experienceYears;
              case 'distance':
                // Mock distance sorting (random for demo)
                return Math.random() - 0.5;
              case 'relevance':
              default:
                // Score by relevance to query and rating
                const aScore = (a.rating.overall * 0.3) + (query ? (
                  a.name.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
                ) : 0);
                const bScore = (b.rating.overall * 0.3) + (query ? (
                  b.name.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
                ) : 0);
                return bScore - aScore;
            }
          });

          const results: SearchResults = {
            doctors: sortedDoctors,
            totalCount: sortedDoctors.length,
            hasMore: false, // For pagination
            filters: get().getAvailableFilters(),
          };

          set({ results, isSearching: false });

          // Add to search history if there's a query
          if (query.trim()) {
            get().addToSearchHistory(query.trim());
          }
        } catch (error) {
          console.error('Search failed:', error);
          set({ isSearching: false });
        }
      },

      selectDoctor: (doctor: Doctor) => {
        set({ selectedDoctor: doctor });
      },

      clearSelectedDoctor: () => {
        set({ selectedDoctor: undefined });
      },

      addToSearchHistory: (query: string) => {
        const { searchHistory, recentSearches } = get();

        // Add to search history
        const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);

        // Add to recent searches with timestamp
        const newRecent = [
          { query, timestamp: new Date().toISOString() },
          ...recentSearches.filter(r => r.query !== query)
        ].slice(0, 5);

        set({
          searchHistory: newHistory,
          recentSearches: newRecent
        });
      },

      clearSearchHistory: () => {
        set({ searchHistory: [], recentSearches: [] });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // Computed getters
      getFilteredDoctors: () => {
        const { query, filters } = get();
        let filtered = allMockDoctors;

        // Filter by query (name, specialization, clinic)
        if (query.trim()) {
          const searchTerm = query.toLowerCase();
          filtered = filtered.filter(doctor =>
            doctor.name.toLowerCase().includes(searchTerm) ||
            doctor.specializations.some(spec =>
              spec.name.toLowerCase().includes(searchTerm) ||
              spec.nameId.toLowerCase().includes(searchTerm)
            ) ||
            doctor.clinics.some(clinic =>
              clinic.name.toLowerCase().includes(searchTerm) ||
              clinic.city.toLowerCase().includes(searchTerm)
            ) ||
            doctor.bio.toLowerCase().includes(searchTerm) ||
            doctor.bioId.toLowerCase().includes(searchTerm)
          );
        }

        // Filter by specializations
        if (filters.specializations && filters.specializations.length > 0) {
          filtered = filtered.filter(doctor =>
            doctor.specializations.some(spec =>
              filters.specializations!.includes(spec.id)
            )
          );
        }

        // Filter by locations
        if (filters.locations && filters.locations.length > 0) {
          filtered = filtered.filter(doctor =>
            doctor.clinics.some(clinic =>
              filters.locations!.includes(clinic.city)
            )
          );
        }

        // Filter by languages
        if (filters.languages && filters.languages.length > 0) {
          filtered = filtered.filter(doctor =>
            doctor.languages.some(lang =>
              filters.languages!.includes(lang.code)
            )
          );
        }

        // Filter by insurance providers
        if (filters.insuranceProviders && filters.insuranceProviders.length > 0) {
          filtered = filtered.filter(doctor =>
            doctor.insuranceAccepted.some(insurance =>
              filters.insuranceProviders!.includes(insurance.id)
            )
          );
        }

        // Filter by rating
        if (filters.minRating) {
          filtered = filtered.filter(doctor =>
            doctor.rating.overall >= filters.minRating!
          );
        }

        // Filter by price range
        if (filters.priceRange) {
          filtered = filtered.filter(doctor =>
            doctor.consultationFees.min <= filters.priceRange!.max &&
            doctor.consultationFees.max >= filters.priceRange!.min
          );
        }

        // Filter by availability
        if (filters.availableToday) {
          filtered = filtered.filter(doctor => doctor.isAvailableToday);
        }

        if (filters.acceptingNewPatients) {
          filtered = filtered.filter(doctor => doctor.isNewPatientAccepting);
        }

        // Filter by clinic type
        if (filters.clinicType && filters.clinicType.length > 0) {
          filtered = filtered.filter(doctor =>
            doctor.clinics.some(clinic =>
              filters.clinicType!.includes(clinic.type)
            )
          );
        }

        return filtered;
      },

      getAvailableFilters: () => {
        const filtered = get().getFilteredDoctors();

        // Count specializations
        const specializationCounts = new Map<string, number>();
        filtered.forEach(doctor => {
          doctor.specializations.forEach(spec => {
            specializationCounts.set(spec.id, (specializationCounts.get(spec.id) || 0) + 1);
          });
        });

        // Count locations
        const locationCounts = new Map<string, number>();
        filtered.forEach(doctor => {
          doctor.clinics.forEach(clinic => {
            locationCounts.set(clinic.city, (locationCounts.get(clinic.city) || 0) + 1);
          });
        });

        // Calculate price range
        const prices = filtered.flatMap(doctor => [
          doctor.consultationFees.min,
          doctor.consultationFees.max
        ]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return {
          specializations: Array.from(specializationCounts.entries()).map(([id, count]) => {
            const spec = mockSpecializations.find(s => s.id === id);
            return {
              id,
              name: spec?.name || id,
              count,
            };
          }),
          locations: Array.from(locationCounts.entries()).map(([city, count]) => ({
            city,
            count,
          })),
          priceRange: {
            min: minPrice || 0,
            max: maxPrice || 1000000,
          },
        };
      },

      getSuggestions: (query: string) => {
        if (!query.trim()) return [];

        const searchTerm = query.toLowerCase();
        return searchSuggestions
          .filter(suggestion =>
            suggestion.toLowerCase().includes(searchTerm)
          )
          .slice(0, 8);
      },
    }),
    {
      name: 'doctor-search-store',
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        recentSearches: state.recentSearches,
        filters: state.filters,
      }),
    }
  )
);

export default useDoctorSearchStore;