
import { useMemo } from 'react';

interface ProfileData {
  // Campos básicos (40% do total)
  name: string;
  artistName: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  
  // Campos profissionais (35% do total)
  experience?: number;
  studioType?: string;
  mainEquipment?: string;
  specialties: string[];
  detailedStyles?: string[];
  
  // Campos de engajamento (25% do total)
  certifications?: string[];
  collaborationAvailable?: boolean;
  communityInterests?: string[];
  artistBio?: string;
}

export const useProfileProgress = (profile: ProfileData) => {
  const progress = useMemo(() => {
    let totalProgress = 0;
    
    // Campos básicos (40 pontos total)
    const basicFields = [
      profile.name,
      profile.artistName,
      profile.email,
      profile.phone,
      profile.location,
      profile.avatar
    ];
    const basicProgress = (basicFields.filter(Boolean).length / basicFields.length) * 40;
    totalProgress += basicProgress;
    
    // Campos profissionais (35 pontos total) 
    const professionalFields = [
      profile.experience,
      profile.studioType,
      profile.mainEquipment,
      profile.specialties?.length > 0,
      profile.detailedStyles?.length > 0
    ];
    const professionalProgress = (professionalFields.filter(Boolean).length / professionalFields.length) * 35;
    totalProgress += professionalProgress;
    
    // Campos de engajamento (25 pontos total)
    const engagementFields = [
      profile.certifications?.length > 0,
      profile.collaborationAvailable !== undefined,
      profile.communityInterests?.length > 0,
      profile.artistBio
    ];
    const engagementProgress = (engagementFields.filter(Boolean).length / engagementFields.length) * 25;
    totalProgress += engagementProgress;
    
    return Math.min(totalProgress, 100);
  }, [profile]);

  const sectionProgress = useMemo(() => {
    // Progresso por seção
    const basicFields = [profile.name, profile.artistName, profile.email, profile.phone, profile.location, profile.avatar];
    const basicProgress = (basicFields.filter(Boolean).length / basicFields.length) * 100;
    
    const professionalFields = [
      profile.experience, 
      profile.studioType, 
      profile.mainEquipment, 
      profile.specialties?.length > 0, 
      profile.detailedStyles?.length > 0
    ];
    const professionalProgress = (professionalFields.filter(Boolean).length / professionalFields.length) * 100;
    
    const engagementFields = [
      profile.certifications?.length > 0,
      profile.collaborationAvailable !== undefined,
      profile.communityInterests?.length > 0,
      profile.artistBio
    ];
    const engagementProgress = (engagementFields.filter(Boolean).length / engagementFields.length) * 100;
    
    return {
      basic: basicProgress,
      professional: professionalProgress,
      engagement: engagementProgress
    };
  }, [profile]);

  const completedMilestones = useMemo(() => {
    const milestones = [];
    if (progress >= 25) milestones.push(25);
    if (progress >= 50) milestones.push(50);
    if (progress >= 75) milestones.push(75);
    if (progress >= 100) milestones.push(100);
    return milestones;
  }, [progress]);

  const unlockedContent = useMemo(() => {
    return {
      biosafetyGuide: progress >= 25,
      advancedTechniques: progress >= 50,
      contractTemplate: progress >= 75,
      stockManagement: progress >= 75,
      mentorship: progress >= 100,
      verifiedBadge: progress >= 100
    };
  }, [progress]);

  return {
    progress,
    sectionProgress,
    completedMilestones,
    unlockedContent
  };
};
