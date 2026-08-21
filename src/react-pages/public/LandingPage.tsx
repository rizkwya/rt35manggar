import React, { useState, useEffect } from 'react';
import { UserRole, RTSettings, NavigationItem, RTPengurus } from '../../types/database';
import { HeaderBanner } from '../../components/landing/HeaderBanner';
import { ProfileSection } from '../../components/landing/ProfileSection';
import { DemographicsSection } from '../../components/landing/DemographicsSection';
import { OrganogramSection } from '../../components/landing/OrganogramSection';
import { LatestActivitiesSection } from '../../components/landing/LatestActivitiesSection';
import { DeveloperCreditsSection } from '../../components/landing/DeveloperCreditsSection';
import { ContactLocationSection } from '../../components/landing/ContactLocationSection';
import { SupabaseService, supabase } from '../../lib/supabase';

interface LandingPageProps {
  currentRole: UserRole;
  navigateTo: (path: string) => void;
  settings?: RTSettings;
  navItems: NavigationItem[];
  pengurusList: RTPengurus[];
  onSettingsUpdate?: (settings: RTSettings) => void;
  defaultFormTab?: 'aspirasi' | 'wajib_lapor';
  onClearDefaultFormTab?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentRole,
  navigateTo,
  settings: initialSettings,
  navItems: initialNavItems,
  pengurusList,
  onSettingsUpdate,
  defaultFormTab,
  onClearDefaultFormTab
}) => {
  const [navItems, setNavItems] = useState<NavigationItem[]>(initialNavItems || []);
  const [liveSettings, setLiveSettings] = useState<RTSettings | undefined>(initialSettings);

  useEffect(() => {
    // 1. Fetch fresh settings and navigation on mount
    const loadLiveContent = async () => {
      try {
        const [freshSettings, freshNav] = await Promise.all([
          SupabaseService.fetchSettings(),
          SupabaseService.fetchNavItems()
        ]);
        if (freshSettings) setLiveSettings(freshSettings);
        if (freshNav && freshNav.length > 0) setNavItems(freshNav);
      } catch (err) {
        console.warn('Failed to fetch live landing page content:', err);
      }
    };
    loadLiveContent();

    // 2. Realtime subscription for Navigation Items
    const navChannel = supabase
      .channel('realtime-navigation-public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rt_navigation_items' },
        async () => {
          const updatedItems = await SupabaseService.fetchNavItems();
          if (updatedItems) {
            setNavItems(updatedItems);
          }
        }
      )
      .subscribe();

    // 3. Realtime subscription for Portal Settings
    const settingsChannel = supabase
      .channel('realtime-settings-landing-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rt_settings' },
        async () => {
          const updatedSettings = await SupabaseService.fetchSettings();
          if (updatedSettings) {
            setLiveSettings(updatedSettings);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(navChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, [initialNavItems, initialSettings]);

  return (
    <>
      {/* 1. HERO BANNER PORTAL RT 35 */}
      <HeaderBanner
        currentRole={currentRole}
        onOpenAuth={() => navigateTo('/login')}
        onOpenDashboard={() => navigateTo('/admin/dashboard')}
        onOpenPresensi={() => navigateTo('/presensi')}
        settings={liveSettings}
      />

      {/* 2. PROFIL RT (VISI, MISI, SEJARAH, BATAS WILAYAH) */}
      <ProfileSection settings={liveSettings} />

      {/* 3. STATISTIK DEMOGRAFI & WARGA */}
      <DemographicsSection settings={liveSettings} />

      {/* 4. ORGANOGRAM & PENGURUS RT 35 */}
      <OrganogramSection pengurusList={pengurusList} />

      {/* 6. DOKUMENTASI KEGIATAN TERBARU */}
      <LatestActivitiesSection navigateTo={navigateTo} navItems={navItems} />

      {/* TENTANG PENGEMBANG KKN UNIVERSITAS MULIA */}
      <DeveloperCreditsSection navigateTo={navigateTo} />

      {/* 7. POSKO, LOKASI & CONTACT ASPIRASI WARGA */}
      <ContactLocationSection 
        settings={liveSettings} 
        onSettingsUpdate={(upd) => {
          setLiveSettings(upd);
          if (onSettingsUpdate) onSettingsUpdate(upd);
        }} 
        defaultFormTab={defaultFormTab}
        onClearDefaultFormTab={onClearDefaultFormTab}
      />
    </>
  );
};
