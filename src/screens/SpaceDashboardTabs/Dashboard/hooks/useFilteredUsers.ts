import { useState, useMemo, useCallback } from "react";
import { User, SortField, SortOrder } from "../types";

const SORT_COMPARATORS: Record<
  SortField,
  (a: User, b: User) => number
> = {
  name: (a, b) => a.name.localeCompare(b.name),
  email: (a, b) => a.email.localeCompare(b.email),
  flagged: (a, b) => (a.flagged === b.flagged ? 0 : a.flagged ? -1 : 1),
};

export const useFilteredUsers = (users: User[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const clearSearch = useCallback(() => setSearchQuery(""), []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
    },
    [sortField]
  );

  const filteredAndSortedUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const filtered = query
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        )
      : users;

    const comparator = SORT_COMPARATORS[sortField];
    const sorted = [...filtered].sort((a, b) => {
      const comparison = comparator(a, b);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [users, searchQuery, sortField, sortOrder]);

  return {
    searchQuery,
    sortField,
    sortOrder,
    filteredAndSortedUsers,
    handleSearchChange,
    clearSearch,
    handleSort,
  };
};