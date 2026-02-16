import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "@mui/material/utils";
import toast from "react-hot-toast";
import * as HTTPRequest from "../../../../utils/HTTPRequests";
import type { User, SearchUser } from "../types";

export const useUserSearch = (handleReloadCurrentUsers: () => void) => {
  const navigate = useNavigate();

  // Autocomplete state
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<SearchUser[]>(
    []
  );
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);

  // Manual search state
  const [manualSearchQuery, setManualSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  // Sign-in dialog state
  const [signInDialog, setSignInDialog] = useState<{
    open: boolean;
    user: User | SearchUser | null;
  }>({ open: false, user: null });
  const [signingIn, setSigningIn] = useState(false);

  // Debounced autocomplete fetcher
  const fetchAutocompleteOptions = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 2) {
          setAutocompleteOptions([]);
          return;
        }

        setAutocompleteLoading(true);
        try {
          const response = await HTTPRequest.get(
            `staff_dashboard/populate_users?search=${encodeURIComponent(query)}`
          );
          setAutocompleteOptions(
            response.users.map((user: SearchUser) => ({
              name: user.name,
              username: user.username,
            }))
          );
        } catch (error) {
          console.error(error);
          toast.error("Failed to search users");
        } finally {
          setAutocompleteLoading(false);
        }
      }, 300),
    []
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      fetchAutocompleteOptions.clear();
    };
  }, [fetchAutocompleteOptions]);

  const handleAutocompleteInputChange = useCallback(
    (_event: React.SyntheticEvent, value: string) => {
      fetchAutocompleteOptions(value);
    },
    [fetchAutocompleteOptions]
  );

  const handleManualSearch = useCallback(async () => {
    const trimmed = manualSearchQuery.trim();
    if (!trimmed) return;

    setSearching(true);
    try {
      const response = await HTTPRequest.get(
        `staff_dashboard/search?query=${encodeURIComponent(trimmed)}`
      );
      setSearchResults(response);

      if (response.length === 0) {
        toast.error("No users found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }, [manualSearchQuery]);

  const openSignInDialog = useCallback((user: User | SearchUser) => {
    setSignInDialog({ open: true, user });
  }, []);

  const closeSignInDialog = useCallback(() => {
    setSignInDialog({ open: false, user: null });
  }, []);

  const confirmSignIn = useCallback(async () => {
    if (!signInDialog.user) return;

    setSigningIn(true);
    try {
      await HTTPRequest.put(
        `staff_dashboard/add_users?added_users=${signInDialog.user.username}`,
        {}
      );
      handleReloadCurrentUsers();
      toast.success(`${signInDialog.user.name} signed in successfully!`, {
        icon: "👍",
      });
      closeSignInDialog();
      setSelectedUser(null);
      setManualSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in user. Please try again.");
    } finally {
      setSigningIn(false);
    }
  }, [signInDialog.user, handleReloadCurrentUsers, closeSignInDialog]);

  const clearSelectedUser = useCallback(() => setSelectedUser(null), []);

  const clearManualSearch = useCallback(() => {
    setManualSearchQuery("");
    setSearchResults([]);
  }, []);

  const navigateToProfile = useCallback(
    (username: string) => navigate(`/profile/${username}`),
    [navigate]
  );

  return {
    // Autocomplete
    autocompleteOpen,
    setAutocompleteOpen,
    autocompleteOptions,
    autocompleteLoading,
    selectedUser,
    setSelectedUser,
    handleAutocompleteInputChange,
    clearSelectedUser,

    // Manual search
    manualSearchQuery,
    setManualSearchQuery,
    searchResults,
    searching,
    handleManualSearch,
    clearManualSearch,

    // Sign-in
    signInDialog,
    signingIn,
    openSignInDialog,
    closeSignInDialog,
    confirmSignIn,

    // Navigation
    navigateToProfile,
  };
};