
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockUserProfileService, UserProfile, TattooPreferences, PersonalPreferences } from "@/services/mock/mockUserProfileService";

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => mockUserProfileService.getUserProfile(userId),
    enabled: !!userId,
  });
};

export const useUpdateTattooPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, preferences }: { userId: string; preferences: Partial<TattooPreferences> }) =>
      mockUserProfileService.updateTattooPreferences(userId, preferences),
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile', data.user_id], data);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useUpdatePersonalPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, preferences }: { userId: string; preferences: Partial<PersonalPreferences> }) =>
      mockUserProfileService.updatePersonalPreferences(userId, preferences),
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile', data.user_id], data);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useUpdateBasicInfo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, basicInfo }: { userId: string; basicInfo: Partial<UserProfile> }) =>
      mockUserProfileService.updateBasicInfo(userId, basicInfo),
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile', data.user_id], data);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};
