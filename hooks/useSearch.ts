import create from 'zustand';

interface SearchState {
  searchValue: string;
  searchType: 'bank' | 'phone';
  information: string;
  loading: boolean;
  error: string;
  countdown: number;
  setSearchValue: (value: string) => void;
  setSearchType: (type: 'bank' | 'phone') => void;
  setInformation: (info: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  setCountdown: (countdown: number) => void;
}

export const useSearchStore = create<SearchState>(set => ({
  searchValue: '',
  searchType: 'bank',
  information: '',
  loading: false,
  error: '',
  countdown: 180,
  setSearchValue: value => set({ searchValue: value }),
  setSearchType: type => set({ searchType: type }),
  setInformation: info => set({ information: info }),
  setLoading: isLoading => set({ loading: isLoading }),
  setError: error => set({ error: error }),
  setCountdown: countdown => set({ countdown: countdown }),
}));
