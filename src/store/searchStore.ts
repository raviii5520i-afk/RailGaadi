import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RecentSearch, Train } from "@/types/train";
import { APP_CONFIG } from "@/constants/config";

interface SearchState {
  // Recent searches
  recentSearches: RecentSearch[];
  addRecentSearch: (search: RecentSearch) => void;
  removeRecentSearch: (trainNumber: string) => void;
  clearRecentSearches: () => void;

  // Favourite trains
  favouriteTrains: Train[];
  addFavourite: (train: Train) => void;
  removeFavourite: (trainNumber: string) => void;
  isFavourite: (trainNumber: string) => boolean;
  toggleFavourite: (train: Train) => void;

  // Active search query
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      favouriteTrains: [],
      searchQuery: "",

      addRecentSearch: (search) => {
        set((state) => {
          const filtered = state.recentSearches.filter(
            (r) => r.trainNumber !== search.trainNumber
          );
          return {
            recentSearches: [search, ...filtered].slice(
              0,
              APP_CONFIG.search.maxRecent
            ),
          };
        });
      },

      removeRecentSearch: (trainNumber) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter(
            (r) => r.trainNumber !== trainNumber
          ),
        }));
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      addFavourite: (train) => {
        set((state) => {
          if (state.favouriteTrains.some((f) => f.number === train.number)) {
            return state;
          }
          return {
            favouriteTrains: [...state.favouriteTrains, train].slice(
              0,
              APP_CONFIG.search.maxFavourites
            ),
          };
        });
      },

      removeFavourite: (trainNumber) => {
        set((state) => ({
          favouriteTrains: state.favouriteTrains.filter(
            (f) => f.number !== trainNumber
          ),
        }));
      },

      isFavourite: (trainNumber) => {
        return get().favouriteTrains.some((f) => f.number === trainNumber);
      },

      toggleFavourite: (train) => {
        const { isFavourite, addFavourite, removeFavourite } = get();
        if (isFavourite(train.number)) {
          removeFavourite(train.number);
        } else {
          addFavourite(train);
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "railgaadi-search",
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        favouriteTrains: state.favouriteTrains,
      }),
    }
  )
);
