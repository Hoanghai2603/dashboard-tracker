/**
 * Central query key factory cho React Query.
 * Tất cả query key trong app nên được quản lý tại đây.
 */
export const queryKeys = {
  tokens: {
    all: ['tokens'] as const,
    list: (limit: number, page: number) => ['tokens', 'list', limit, page] as const,
    detail: (id: string) => ['tokens', 'detail', id] as const,
    chart: (id: string, days: string | number) => ['tokens', 'chart', id, days] as const,
    search: (query: string) => ['tokens', 'search', query] as const,
    global: () => ['tokens', 'global'] as const,
  },
  wallet: {
    all: ['wallet'] as const,
    balance: (address: string) => ['wallet', 'balance', address] as const,
  },
  staking: {
    all: ['staking'] as const,
    info: (address: string) => ['staking', 'info', address] as const,
    rewards: (address: string) => ['staking', 'rewards', address] as const,
  },
} as const
